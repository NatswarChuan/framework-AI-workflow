# Rule 13: Phân Tích Caching, Tối Ưu Hiệu Năng & Sử Dụng Thư Viện Chuẩn Kiểm Chứng

Tài liệu này xác lập quy chuẩn bắt buộc về việc đánh giá áp dụng bộ nhớ đệm (Caching), các kỹ thuật tối ưu hiệu năng (Performance Optimization) và nguyên tắc ưu tiên tuyệt đối các thư viện mã nguồn mở chuẩn mực đã qua kiểm chứng (Battle-tested Libraries) thay vì tự lập trình lại (Reinventing the wheel).

---

## 1. KHUNG PHÂN TÍCH & QUYẾT ĐỊNH SỬ DỤNG CACHE (MANDATORY CACHE DECISION PROTOCOL)

Trước khi thiết kế bất kỳ Endpoint API, Service truy vấn hoặc tác vụ tính toán nào, lập trình viên và Agent **BẮT BUỘC PHẢI THỰC HIỆN BƯỚC PHÂN TÍCH ĐÁNH GIÁ CACHE**:

### 1.1. Bảng Tiêu Chí Quyết Định (Decision Matrix)

```
                            [ YÊU CẦU TRUY VẤN / TÍNH TOÁN ]
                                           │
                    Tỷ lệ Đọc / Ghi (Read:Write Ratio) cao (> 80% Đọc)?
                                    ├─── KHÔNG ───► KHÔNG DÙNG CACHE (Truy vấn DB trực tiếp)
                                    └─── CÓ
                                           │
                    Dữ liệu có yêu cầu tính tức thời từng mili-giây tuyệt đối?
                                    ├─── CÓ ──────► KHÔNG DÙNG CACHE (Ví dụ: Số dư ví tiền, Lock thanh toán)
                                    └─── KHÔNG (Chấp nhận độ trễ nhỏ hoặc có cơ chế Evict)
                                           │
                    Chi phí tính toán hoặc độ trễ DB cao?
                                    └─── CÓ ──────► BẮT BUỘC DÙNG CACHE
```

### 1.2. Phân Loại Tầng Cache (L1 vs L2)
- **L1 In-Memory Cache (Caffeine Cache)**:
  - Áp dụng: Dữ liệu tĩnh, cấu hình hệ thống, danh mục ít biến động, metadata cục bộ trên từng node.
  - Ưu điểm: Tốc độ nanosecond/microsecond, không tốn I/O mạng.
- **L2 Distributed Cache (Spring Data Redis)**:
  - Áp dụng: Session người dùng, thông tin quyền hạn (Permissions), giỏ hàng, dữ liệu chia sẻ giữa nhiều instance microservice.
  - Ưu điểm: Đồng bộ trạng thái toàn cụm, hỗ trợ TTL tự động, bền vững khi restart app.

### 1.3. Quy Tắc Thu Hồi & Làm Mới Cache (Cache Invalidation & Anti-Pattern Prevention)
1. **Luôn có chiến lược xóa Cache khi thay đổi dữ liệu**:
   - Mọi phương thức thêm/sửa/xóa đều phải gắn `@CacheEvict(value = "cacheName", key = "...")` hoặc `@CachePut` để đảm bảo dữ liệu trong cache không bị stale (cũ/sai lệch).
2. **Luôn cấu hình thời gian sống (TTL - Time To Live)**:
   - Tuyệt đối không lưu cache vĩnh viễn (gây Memory Leak / OOM). Luôn set TTL hợp lý (ví dụ: 15m, 1h, 24h).
3. **Phòng chống Cache Avalanche & Stampede**:
   - Thêm độ lệch ngẫu nhiên (Jitter) vào TTL để tránh hàng triệu key cùng hết hạn tại một thời điểm làm sập Database.

---

## 2. NGUYÊN TẮC TỐI ƯU HÓA HIỆU NĂNG TOÀN DIỆN (PERFORMANCE BY DESIGN)

### 2.1. Tối ưu tầng Cơ sở dữ liệu & Big Data (Database & JPA)
- **Luôn Ưu Tiên Eager-Load Hơn Lazy-Load (Triệt tiêu N+1 Query)**:
  - Trong xử lý dữ liệu lớn, Lazy-load gây thảm họa N+1 queries và round-trip mạng chậm chạp.
  - Luôn chủ động nạp dữ liệu bằng **Eager-loading** có kiểm soát qua `@EntityGraph` hoặc `JOIN FETCH` trong **duy nhất 1 câu SQL**.
  - Sử dụng **DTO Projections** để chỉ lấy đúng các cột cần thiết, giảm 90% tải bộ nhớ.
- **Phân trang Big Data (Keyset / Cursor-based Pagination)**:
  - Dùng Keyset Pagination (`WHERE id > :lastSeenId`) thay vì `OFFSET` chậm chạp trên hàng triệu bản ghi.
  - Chi tiết xem kỹ [Rule 25: SQL Optimization & Big Data](file:///c:/Users/ADMIN/Desktop/Java-Google-Style/.agents/rules/25-sql-optimization-and-bigdata.md).
- **Tối ưu ghi hàng loạt (Batch Processing)**:
  - Cấu hình `spring.jpa.properties.hibernate.jdbc.batch_size=50` và `order_inserts=true`.
- **Cấu hình Connection Pool (HikariCP)**:
  - Đặt `maximum-pool-size`, `minimum-idle`, `connection-timeout` phù hợp với tải hệ thống.

### 2.2. Tối ưu tầng Xử lý & Bộ nhớ (Java Core & Memory)
- **Sử dụng MapStruct thay cho Reflection**:
  - Không dùng `BeanUtils.copyProperties` hay ModelMapper vì dùng Reflection gây chậm hiệu năng từ 10 đến 50 lần. MapStruct sinh mã gán trực tiếp tại thời điểm build (Compile-time), hiệu năng tương đương gõ tay.
- **Khởi tạo kích thước Collection khi biết trước**:
  - `new ArrayList<>(expectedSize)` hoặc `new HashSet<>(expectedSize)` để tránh việc mảng tự động resize và copy lại bộ nhớ nhiều lần.
- **Tận dụng Stream & Flat Logic**:
  - Tránh tạo các list trung gian không cần thiết khi biến đổi dữ liệu.

---

## 3. NGUYÊN TẮC ƯU TIÊN THƯ VIỆN ĐÃ KIỂM CHỨNG (BATTLE-TESTED LIBRARIES FIRST)

> **QUY TẮC BẮT BUỘC**:
> **TUYỆT ĐỐI KHÔNG TỰ VIẾT LẠI (Reinventing the wheel) các thuật toán, bộ chuyển đổi, bộ mã hóa, trình phân tích cú pháp hoặc cơ chế điều phối đã có thư viện chuẩn công nghiệp được cộng đồng tin dùng.**

### 3.1. Bảng Danh Mục Thư Viện Chuẩn Bắt Buộc Sử Dụng

| Nghiệp vụ / Nhu cầu | Thư viện chuẩn được khuyến nghị | Lý do kiểm chứng |
| :--- | :--- | :--- |
| **Sinh UUIDv7** | `com.github.f4b6a3:uuid-creator` | Chuẩn RFC 9562 tối ưu hóa SIMD, tốc độ hàng triệu ID/giây. |
| **Object Mapping** | `org.mapstruct:mapstruct` | Sinh mã compile-time, zero reflection, an toàn kiểu tuyệt đối. |
| **In-Memory Cache** | `com.github.ben-manes.caffeine:caffeine` | Thuật toán Window TinyLFU đạt tỷ lệ hit cache cao nhất thế giới Java. |
| **Distributed Cache** | `org.springframework.boot:spring-boot-starter-data-redis` | Chuẩn kết nối Redis phân tán của Spring. |
| **Xác thực dữ liệu** | `org.hibernate.validator:hibernate-validator` | Thực thi chuẩn Jakarta Bean Validation (JSR-380) toàn diện. |
| **Xử lý chuỗi & tập hợp** | `org.apache.commons:commons-lang3`<br>`org.apache.commons:commons-collections4` | Chuẩn mực Apache xử lý an toàn trước null và hỗ trợ thuật toán nâng cao. |
| **Thao tác JSON** | `com.fasterxml.jackson.core:jackson-databind` | Chuẩn de-facto xử lý JSON hiệu năng cao trong Spring Boot. |
| **Khả năng chịu lỗi (Resilience)** | `io.github.resilience4j:resilience4j-spring-boot3` | Circuit Breaker, Rate Limiter, Retry chuẩn microservice. |
| **Xử lý Thời gian** | `java.time.*` (JSR-310 có sẵn trong JDK 8+) | An toàn đa luồng (Immutable & Thread-safe), thay thế hoàn toàn Date/Calendar. |
| **Tracing & Metrics** | `io.micrometer:micrometer-observation` | Chuẩn đo lường và truy vết tích hợp sâu với Actuator & OpenTelemetry. |
