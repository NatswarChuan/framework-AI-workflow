---
name: spring-boot-caching-and-performance
description: >-
  Kích hoạt kỹ năng này khi phân tích và quyết định có nên sử dụng Cache (Caffeine/Redis) hay không,
  thiết lập cấu hình Spring Cache (@Cacheable, @CacheEvict), tối ưu hóa hiệu năng truy vấn DB
  (chống lỗi N+1, batching, pagination) hoặc lựa chọn thư viện chuẩn kiểm chứng trong Java Spring Boot.
---

# Kỹ Năng: Phân Tích Caching & Tối Ưu Hóa Hiệu Năng (Performance & Caching)

Kỹ năng này hướng dẫn quy trình từng bước phân tích xem có nên áp dụng Caching cho một chức năng cụ thể hay không, triển khai cấu hình Cache chuẩn mực và áp dụng các kỹ thuật tăng tốc độ xử lý của ứng dụng.

---

## 1. QUY TRÌNH PHÂN TÍCH QUYẾT ĐỊNH CACHE TỪNG BƯỚC

### Bước 1: Trả Lời 3 Câu Hỏi Cốt Lõi
1. **Dữ liệu này có tần suất đọc cao hơn ghi rõ rệt (Read >> Write) không?**
   - Nếu dữ liệu thay đổi liên tục từng giây (Real-time updates): **KHÔNG NÊN DÙNG CACHE**.
   - Nếu dữ liệu đọc nhiều lần nhưng chỉ sửa vài lần/ngày: **NÊN DÙNG CACHE**.
2. **Dữ liệu có thể chấp nhận độ trễ (Staleness) ngắn không?**
   - Nếu là số dư ví tiền, token xác thực một lần, stock tồn kho trong flash-sale: **KHÔNG CACHE**.
   - Nếu là thông tin cấu hình, danh mục, hồ sơ người dùng: **NÊN CACHE**.
3. **Chi phí truy vấn DB hoặc tính toán có đủ lớn không?**
   - Nếu câu truy vấn chỉ tốn 1ms trên primary key: Cân nhắc kỹ, tránh lạm dụng làm tăng phức tạp hạ tầng.
   - Nếu câu truy vấn tốn > 50ms hoặc gọi external API: **BẮT BUỘC DÙNG CACHE**.

---

## 2. QUY TRÌNH TRIỂN KHAI CAFFEINE CACHE (L1 IN-MEMORY)

### Bước 1: Thêm Dependency Chuẩn Được Kiểm Chứng
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
  <groupId>com.github.ben-manes.caffeine</groupId>
  <artifactId>caffeine</artifactId>
</dependency>
```

### Bước 2: Cấu Hình Cache Manager (`CacheConfig.java`)
```java
package com.enterprise.app.config;

import com.enterprise.app.common.constant.CacheConstant;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình bộ nhớ đệm Caffeine L1 hiệu năng cao.
 *
 * <p>Triệt tiêu 100% magic number bằng {@link CacheConstant}.
 */
@Configuration
@EnableCaching
public class CacheConfig {

  @Bean
  public CacheManager cacheManager() {
    final CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.setCaffeine(
        Caffeine.newBuilder()
            .initialCapacity(CacheConstant.DEFAULT_INITIAL_CAPACITY)
            .maximumSize(CacheConstant.DEFAULT_MAXIMUM_SIZE)
            .expireAfterWrite(CacheConstant.DEFAULT_EXPIRE_MINUTES, TimeUnit.MINUTES)
            .recordStats()
    );
    return cacheManager;
  }
}
```

### Bước 3: Áp Dụng Annotation Chuẩn Trên Service Implementation
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.CacheConstant;
import com.enterprise.app.common.constant.CacheLogConstant;
import com.enterprise.app.dto.UserDto;
import com.enterprise.app.service.UserService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service có áp dụng cơ chế Caching và Invalidation chuẩn mực.
 *
 * <p>100% tham chiếu cache name và thông điệp log từ lớp Constant.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

  /**
   * Truy vấn thông tin người dùng có Cache đệm.
   */
  @Override
  @Cacheable(value = CacheConstant.CACHE_USERS, key = "#id")
  public UserDto getUserById(final UUID id) {
    log.info(CacheLogConstant.LOG_CACHE_MISS_USER, id);
    // Truy vấn database...
    return userDto;
  }

  /**
   * Cập nhật người dùng và xóa Cache để bảo đảm tính nhất quán dữ liệu.
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  @CacheEvict(value = CacheConstant.CACHE_USERS, key = "#id")
  public UserDto updateUser(final UUID id, final UserUpdateRequest request) {
    log.info(CacheLogConstant.LOG_CACHE_EVICT_USER, id);
    // Cập nhật database...
    return updatedDto;
  }
}
```

---

## 3. TỐI ƯU HÓA SQL CHO BIG DATA & ƯU TIÊN EAGER-LOAD (CHỐNG N+1 QUERY)

- **Nguyên tắc**: Luôn ưu tiên Eager-load có chủ đích bằng `@EntityGraph` hoặc `JOIN FETCH` trong duy nhất 1 câu SQL thay vì Lazy-loading ngầm.
- **DTO Projection**: Chỉ lấy các cột cần thiết từ database để tiết kiệm băng thông.
- **Keyset Pagination**: Thay thế phân trang `OFFSET` bằng Keyset (`WHERE id > :lastSeenId`) cho bảng dữ liệu lớn.

Tại Repository:
```java
package com.enterprise.app.repository;

import com.enterprise.app.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository truy vấn tối ưu nạp sẵn quan hệ tránh N+1 query.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {

  /**
   * Tải người dùng kèm vai trò (Roles) bằng Eager-Loading trong DUY NHẤT 1 câu lệnh SQL.
   */
  @EntityGraph(attributePaths = {"roles"})
  Optional<UserEntity> findWithRolesById(String id);
}
```

---

## 4. BẮT BUỘC KIỂM THỬ TẢI & HIỆU NĂNG BẰNG APACHE JMETER (MANDATORY JMETER STRESS TESTING)

Mọi giải pháp tối ưu hóa hiệu năng và Caching sau khi cấu hình **BẮT BUỘC** phải được kiểm chứng tải bằng **Apache JMeter** thông qua `jmeter-maven-plugin`.

### 4.1. Cấu Trúc Kịch Bản Kiểm Thử Tải (`src/test/jmeter/*.jmx`)
- **Tập tin kịch bản**: Đặt tại thư mục `src/test/jmeter/enterprise_rpac_stress_test.jmx`.
- **Cấu hình Thread Groups**:
  - `TG01 - Guest Login Concurrency`: 20 threads đồng thời, 10 loops (200 requests).
  - `TG02 - Admin User Login Concurrency`: 20 threads đồng thời, 10 loops (200 requests).
  - `TG03 - RPAC Policy Engine Evaluation`: 30 threads đồng thời, 10 loops (300 requests) kiểm thử tốc độ thẩm định dynamic policy & cache hit.
  - `TG04 - POS PIN Verification Concurrency`: 20 threads đồng thời, 10 loops (200 requests).
  - `TG05 - Real-time SSE Notification Broadcast`: 20 threads đồng thời phát sóng thông báo thời gian thực.
  - `TG06 - Real-time SSE Recent Notifications Fetch`: 20 threads đồng thời lấy lịch sử thông báo có cache.

### 4.2. Lệnh Thực Thi & Kiểm Tra Kết Quả
```bash
# Thực thi kiểm thử tải và quét kết quả tự động
mvn jmeter:jmeter jmeter:results
```

### 4.3. Tiêu Chí Nghiệm Thu Bắt Buộc (SLA Acceptance Criteria)
- [ ] **Error Rate = 0.0%**: 100% request thành công (`Failures: 0.0%`).
- [ ] **Response Time SLA**:
  - Cache Hit Requests: Average < 20ms - 50ms.
  - DB Query / Write Requests: Average < 500ms dưới tải cao.
- [ ] **Báo Cáo HTML**: Tự động sinh dashboard trực quan tại `target/jmeter/reports/*/index.html`.
- [ ] **Chặn Bàn Giao**: Nếu có bất kỳ request nào thất bại (Error Rate > 0%), bắt buộc phải điều tra bottleneck (HikariCP pool, Redis/Caffeine hit, Virtual Threads) và chạy lại đến khi 100% Pass.

