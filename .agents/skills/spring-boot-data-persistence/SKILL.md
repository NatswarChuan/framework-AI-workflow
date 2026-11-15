---
name: spring-boot-data-persistence
description: >-
  Kích hoạt kỹ năng này khi thiết kế hoặc cấu hình tầng Dữ liệu (Persistence Layer),
  bao gồm JPA Entities, Spring Data Repositories, Database Auditing, tối ưu hóa truy vấn
  và đảm bảo an toàn kiểu dữ liệu trong Java Spring Boot.
---

# Kỹ Năng: Thiết Kế Tầng Dữ Liệu (Persistence & Entity Layer)

Kỹ năng này hướng dẫn quy chuẩn xây dựng Entity và Repository an toàn, phòng chống lỗi N+1, đảm bảo tính toàn vẹn dữ liệu và triệt để tuân thủ quy tắc không dùng `Object` hay toán tử 3 ngôi.

---

## 1. NGUYÊN TẮC BẮT BUỘC TRONG TẦNG DỮ LIỆU

1. **Entity nguyên khối, chuẩn hóa**:
   - Mọi Entity kế thừa từ lớp `BaseAuditEntity` (chứa `createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
   - Tuyệt đối không khai báo hằng số trong Entity (hằng số đưa vào `*Constant`).
   - Sử dụng kiểu dữ liệu wrapper nguyên thủy (`Long`, `Integer`, `Boolean`, `BigDecimal`), không dùng `Object`.
2. **Repository an toàn**:
   - Kế thừa `JpaRepository<T, ID>` và `JpaSpecificationExecutor<T>`.
   - Các phương thức tìm kiếm 1 bản ghi phải trả về `Optional<T>`.
   - Các phương thức tìm kiếm danh sách phải trả về `List<T>` (Spring Data JPA tự đảm bảo không bao giờ trả về null mà trả về empty list).
3. **Ưu Tiên Eager-Loading Hơn Lazy-Loading & Tối Ưu Big Data**:
   - Trong môi trường dữ liệu lớn (Big Data), Lazy-loading là nguyên nhân chính gây ra N+1 queries và `LazyInitializationException`.
   - **Luôn ưu tiên Eager-load có chủ đích**: Sử dụng `@EntityGraph(attributePaths = {...})` hoặc mệnh đề `JOIN FETCH` để nạp trọn vẹn dữ liệu trong **duy nhất 1 câu SQL**.
   - Sử dụng **DTO Projections** để chỉ load đúng các trường cần thiết, giảm 90% tải bộ nhớ.
   - Sử dụng **Keyset Pagination (Cursor-based)** cho Big Data thay vì phân trang `OFFSET` chậm chạp.

---

## 2. CODE MẪU CHUẨN MỰC

### 2.1. Base Audit Entity (`BaseAuditEntity.java`)
```java
package com.enterprise.app.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Lớp thực thể cơ sở cung cấp các trường theo dõi lịch sử chỉnh sửa dữ liệu.
 *
 * <p>Tuân thủ quy tắc không dùng abstract class: là class thông thường.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseAuditEntity {

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Column(name = "created_by", updatable = false)
  private String createdBy;

  @Column(name = "updated_by")
  private String updatedBy;
}
```

### 2.2. JPA Entity (`UserEntity.java`)
```java
package com.enterprise.app.entity;

import com.enterprise.app.common.entity.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Thực thể ánh xạ bảng người dùng {@code users} trong cơ sở dữ liệu.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity extends BaseAuditEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "username", nullable = false, unique = true, length = 50)
  private String username;

  @Column(name = "email", nullable = false, unique = true, length = 100)
  private String email;

  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @Column(name = "status", nullable = false, length = 20)
  private String status;

  @Override
  public boolean equals(final Object obj) {
    if (this == obj) {
      return true;
    }
    if (Objects.isNull(obj)) {
      return false;
    }
    if (!getClass().equals(obj.getClass())) {
      return false;
    }
    final UserEntity that = (UserEntity) obj;
    if (Objects.isNull(id)) {
      return false;
    }
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
```

### 2.3. Repository Interface (`UserRepository.java`)
```java
package com.enterprise.app.repository;

import com.enterprise.app.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Kho chứa dữ liệu truy vấn các thao tác cơ sở dữ liệu cho {@link UserEntity}.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {

  /**
   * Kiểm tra sự tồn tại của tên đăng nhập trong hệ thống.
   *
   * @param username tên đăng nhập cần kiểm tra
   * @return {@code true} nếu username đã tồn tại; ngược lại {@code false}
   */
  boolean existsByUsername(String username);

  /**
   * Kiểm tra sự tồn tại của hòm thư điện tử trong hệ thống.
   *
   * @param email hòm thư điện tử cần kiểm tra
   * @return {@code true} nếu email đã tồn tại; ngược lại {@code false}
   */
  boolean existsByEmail(String email);

  /**
   * Tìm kiếm người dùng bằng tên đăng nhập.
   *
   * @param username tên đăng nhập cần tìm
   * @return {@link Optional} chứa đối tượng người dùng nếu tìm thấy
   */
  Optional<UserEntity> findByUsername(String username);
}
```
