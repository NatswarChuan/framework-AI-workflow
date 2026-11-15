---
name: spring-boot-quality-audit
description: >-
  Kích hoạt kỹ năng này khi thực hiện kiểm tra mã nguồn (Code Review), kiểm toán chất lượng tĩnh (Static Analysis),
  quét tuân thủ SonarQube / Coverity / Java Google Style và đối chiếu toàn bộ các cú pháp bị cấm trước khi bàn giao.
---

# Kỹ Năng: Kiểm Toán Chất Lượng & Tuân Thủ Quy Chuẩn (Quality Audit)

Kỹ năng này cung cấp quy trình và bảng kiểm tra (Audit Checklist) toàn diện để phát hiện và loại bỏ 100% các vi phạm về cú pháp, nguyên tắc kiến trúc và tiêu chuẩn chất lượng mã nguồn theo chuẩn khắt khe nhất của **SonarQube** (từ Blocker đến Minor/Info) và **Coverity**.

---

## 1. QUY TRÌNH KIỂM TOÁN TỪNG BƯỚC (STEP-BY-STEP AUDIT)

```
[ Bắt đầu Kiểm Toán ]
         │
         ▼
[ BƯỚC 1: Quét Cú Pháp Bị Cấm ] ────► (Phát hiện: Exception có sẵn, ? :, Nested If, &&/||, private func, static class/enum/record, abstract class, UUIDv4)
         │
         ▼
[ BƯỚC 2: Kiểm Tra Giới Hạn Sizing ] ► (Method <= 30-40 dòng, Class <= 200-300 dòng, Params <= 3)
         │
         ▼
[ BƯỚC 3: Độ Phức Tạp SonarQube ] ──► (Cognitive Complexity <= 8, Cyclomatic <= 8)
         │
         ▼
[ BƯỚC 4: Rà Soát Sonar Minor/Info ] ► (S1118 ctor private, S1488 redundant return, S125 no comments, S1155 isEmpty, S1226 final params)
         │
         ▼
[ BƯỚC 5: Kiểm Tra Lớp Đặc Thù ] ───► (Util: final + static only, Helper: final + @Component + non-static)
         │
         ▼
[ BƯỚC 6: Controller Điều Phối ] ───► (Controller chỉ dispatch, không business logic, không gọi Repo/Entity)
         │
         ▼
[ BƯỚC 7: Hiệu Năng & Caching ] ────► (Phân tích Cache, chống N+1 với @EntityGraph, dùng thư viện chuẩn đã kiểm chứng)
         │
         ▼
[ BƯỚC 8: Bảo Vệ Transaction ] ─────► (@Transactional(rollbackFor = Exception.class) cho mọi hàm ghi)
         │
         ▼
[ BƯỚC 9: Logging & Tracing ] ──────► (Log bắt đầu/kết thúc bằng hằng số, TraceIdFilter UUIDv7 qua MDC)
         │
         ▼
[ BƯỚC 10: Kiểm Tra Chuyển Đổi ] ───► (Hàm toXXX/fromXXX bắt buộc dùng Builder Pattern)
         │
         ▼
[ BƯỚC 11: Kiểm Tra Exception ] ────► (100% Custom Exception mang HttpStatus, GlobalHandler chuẩn hóa)
         │
         ▼
[ BƯỚC 12: Google Javadoc ] ────────► (@param, @return, @throws đầy đủ 100%)
         │
         ▼
[ Hoàn thành & Bàn giao (Zero Defect) ]
```

---

## 2. BẢNG KIỂM TRA ĐỐI SOÁT (DETAILED AUDIT CHECKLIST)

### 2.1. Quét Cú Pháp Cấm (Strict Syntax Gate)
| Tiêu chí kiểm tra | Phát hiện vi phạm | Hành động khắc phục |
| :--- | :--- | :--- |
| **Exception có sẵn của Java/Spring** | Ném `IllegalArgumentException`, `NoSuchElementException`, `IllegalStateException`, `RuntimeException` | **BẮT BUỘC SỬA**: 100% Custom Exception kế thừa `BaseBusinessException`, mang `HttpStatus` và `errorCode`. |
| **Tự viết lại thư viện chuẩn** | Tự code mapper, bộ sinh uuid, crypto, cache | Dùng thư viện chuẩn đã kiểm chứng (MapStruct, `uuid-creator`, Caffeine, Commons). |
| **Abstract Class** | Khai báo hoặc dùng `abstract class` | **BẮT BUỘC SỬA**: Dùng `interface` kết hợp phương thức `default`. Với Exception/Entity dùng concrete class. |
| **UUIDv4 / randomUUID** | Gọi `UUID.randomUUID()` | **BẮT BUỘC SỬA**: Dùng **UUIDv7** qua `UuidUtil.generateUuidV7()`. |
| **Private Function (Hàm private)** | Khai báo phương thức `private` trong bất kỳ class nào | **BẮT BUỘC SỬA**: Chuyển thành `public`. Tách sang lớp Helper/Util mới. |
| **Inner/Nested/Anonymous Class, Enum, Record** | Khai báo inner class, nested class, anonymous class (`new Interface() { ... }`), `enum` hoặc `record` trong 1 class cha | **BẮT BUỘC SỬA**: Tách thành file `.java` độc lập top-level (cả `main` và `test`); chuyển enum thành class hằng số chuỗi; chuyển record thành class thông thường + Lombok. |
| **Sai lệch cấu trúc Util / Helper & Folder Suffix** | Lớp `*Helper` chứa hàm/biến `static` hoặc không nằm trong `helper/`; Lớp `*Util` chứa hàm non-static hoặc không nằm trong `util/`; Hậu tố file không khớp tên folder | **BẮT BUỘC SỬA**: `*Util` trong `util/` (`final class`, `private` ctor, 100% `public static`); `*Helper` trong `helper/` (`final class`, `@Component`/`@AutoComponent`, 0 `static`, 0 `private` func); đồng bộ 100% hậu tố tên file với tên folder. |
| **Toán tử 3 ngôi** | Xuất hiện `?` và `:` | Chuyển đổi thành cấu trúc `if (...) { ... } else { ... }` đầy đủ `{}`. |
| **Nested If (if lồng nhau)** | Khối lệnh `if` lồng trong `if` khác | **BẮT BUỘC SỬA**: Tách thành các Flat Guard Clauses `return` sớm. |
| **Nhiều hơn 1 điều kiện trong `if`** | Xuất hiện `&&` hoặc `\|\|` | Tách thành các câu lệnh `if` tuần tự hoặc trích xuất sang Helper/Util với method `public`. |
| **Từ khóa `var`** | Có từ khóa `var` khi khai báo biến | Viết tường minh kiểu dữ liệu. |
| **Kiểu `Object` chung chung** | Khai báo biến/tham số/trả về là `Object` | Thay bằng kiểu cụ thể hoặc Generic. |
| **Dữ liệu `Map<String, Object>`** | Dùng Map để truyền nhận payload | Tạo Class DTO/Model strongly-typed. |
| **So sánh null trực tiếp** | Sử dụng `== null` hoặc `!= null` | Thay bằng `Objects.isNull(...)` hoặc `Objects.nonNull(...)`. |
| **Magic String / Magic Number / Hard-code** | Viết trực tiếp chuỗi hoặc con số trong logic/log (prefix role, token type, default UUID, status, TTL seconds, limit counts, audit reasons) | **BẮT BUỘC SỬA**: Khai báo hằng số trong các file `*Constant` (`CommonConstant`, `RoleConstant`, `LogConstant`, `*LogConstant`...) kèm Javadoc đầy đủ. |
| **Phương thức non-override trong ServiceImpl** | Lớp `*ServiceImpl` chứa method không có `@Override` từ Service Interface | **BẮT BUỘC SỬA**: 100% method trong ServiceImpl phải là `@Override`. Chuyển toàn bộ logic phụ trợ sang `@Component final class *Helper` độc lập. |
| **Chuỗi hàm setter rời rạc** | Gọi `obj.setA(...)`, `obj.setB(...)` thay vì Builder | **BẮT BUỘC SỬA**: Ưu tiên 100% dùng **Builder Pattern** (`.builder()...build()`, `@Builder(toBuilder = true)`). |

---

### 2.2. Kiểm Soát Độ Dài & Độ Phức Tạp SonarQube Khắt Khe (Complexity & Sizing Gate)
- [ ] **Độ dài Phương thức (Method Length)**: Tối đa 30 - 40 dòng code thực thi (không tính chuỗi builder mapping). Nếu vượt quá: phân rã sang lớp Helper/Util mới với phương thức `public`.
- [ ] **Độ dài Lớp (Class Length)**: Tối đa 200 - 300 dòng code. Nếu vượt quá: tách nhỏ trách nhiệm SRP.
- [ ] **Số lượng Tham số (Method Parameters)**: Tối đa 3 tham số. Nếu vượt quá: đóng gói thành đối tượng DTO/Parameter Object.
- [ ] **Độ phức tạp Nhận thức (Cognitive Complexity)**: Tối đa điểm <= 8. Sử dụng Guard Clauses và loại bỏ hoàn toàn lồng nhau.
- [ ] **Độ phức tạp Chu trình (Cyclomatic Complexity)**: Tối đa điểm <= 8.
- [ ] **Số lượng Phương thức Public trong Lớp**: Tối đa <= 10 - 15 methods.

---

### 2.3. Khắc Phục 100% Cảnh Báo SonarQube Từ Blocker Đến Minor & Info (Zero-Defect Gate)
- [ ] **Blocker / Critical (0)**:
  - [ ] 100% tài nguyên dùng `try-with-resources` (`S2095`).
  - [ ] Chống NPE 100% bằng thư viện `java.util.Objects` (`S2259`).
  - [ ] Không có SQL injection; 100% named parameters (`S2077`).
  - [ ] Khôi phục cờ ngắt `Thread.currentThread().interrupt()` khi bắt `InterruptedException` (`S2142`).
- [ ] **Major (0)**:
  - [ ] 100% Custom Exception kế thừa `BaseBusinessException`; không ném `RuntimeException` (`S112`).
  - [ ] Không nuốt ngoại lệ; bảo toàn nguyên nhân lỗi (`S1166`).
  - [ ] 100% dùng Logger SLF4J; cấm `System.out` / `System.err` (`S106`).
  - [ ] 100% chuỗi được trích xuất thành hằng số; không trùng lặp String literal (`S1192`).
  - [ ] Khai báo interface cho Collection (`List`, `Set`, `Map`) thay vì concrete class (`S1319`).
- [ ] **Minor & Info (0 - Luôn Fix Dù Là Thấp Nhất)**:
  - [ ] Lớp Util và Constant có private constructor ném ngoại lệ (`S1118`).
  - [ ] Không có phương thức hoặc constructor rỗng không có chú thích (`S1186`).
  - [ ] Không gán biến cục bộ rồi `return` ngay khi không cần thiết (`S1488`).
  - [ ] Không có dòng mã nào bị comment (`S125`).
  - [ ] Dùng `collection.isEmpty()` thay vì so sánh `size() == 0` (`S1155`).
  - [ ] Không có trường hoặc phương thức thừa không dùng (`S1144`).
  - [ ] Không có biến cục bộ thừa không đọc (`S1481`).
  - [ ] Mọi tham số phương thức đều có từ khóa `final` để chống gán lại (`S1226`).
  - [ ] Sử dụng diamond operator `<>` (`S2293`).
  - [ ] Tên hằng số tuân thủ UPPER_SNAKE_CASE (`S1170`).
  - [ ] Tên biến/phương thức tuân thủ camelCase chuẩn Google Style (`S116`, `S101`).
  - [ ] Log dùng cú pháp placeholder không nối chuỗi (`S3457`).

---

### 2.4. Kiểm Tra Hiệu Năng & Caching (Performance Gate)
- [ ] Đã phân tích có nên dùng Cache (L1 Caffeine / L2 Redis) cho các tác vụ có tỷ lệ Đọc/Ghi cao hay không.
- [ ] Không có truy vấn N+1 (sử dụng `@EntityGraph` hoặc `JOIN FETCH`).
- [ ] Mọi truy vấn danh sách đều có phân trang `Pageable`.
- [ ] Sử dụng MapStruct sinh mã compile-time thay cho Reflection.

---

### 2.5. Kiểm Tra Giao Dịch & Logging (Transaction & Tracing Gate)
- [ ] Mọi phương thức ghi (Thêm, Sửa, Xóa) đều có `@Transactional(rollbackFor = Exception.class)`.
- [ ] Class Service được đánh dấu `@Transactional(readOnly = true)`.
- [ ] Mọi function đều có log bắt đầu và kết thúc sử dụng hằng số (`LogConstant` / `*LogConstant`), tuyệt đối không viết String literal.
- [ ] Không ghi log thông tin nhạy cảm PII (Password, Token, Thẻ).
- [ ] `TraceIdFilter` sinh `traceId` chuẩn UUIDv7 qua MDC.

---

### 2.6. Kiểm Tra Kiến Trúc & Controller (Architecture Gate)
- [ ] Controller chỉ đóng vai trò điều phối viên: Không chứa logic, không query DB, không rẽ nhánh `if/else`.
- [ ] Mỗi layer đảm nhiệm đúng 1 vai trò duy nhất.
- [ ] Mọi Service đều có Interface và Impl tiêm qua Constructor DI (`@RequiredArgsConstructor` với `private final`).
- [ ] Chuyển đổi DTO/Entity/Request/Response dùng `toXXX` và `fromXXX` với Builder Pattern (`.builder()...build()`).
- [ ] Mọi Custom Exception mang trường `HttpStatus` và GlobalHandler trả đúng HTTP Status Code đó.
- [ ] Cấu hình properties có Javadoc, không bị warning trên IDE.
- [ ] 100% method có Google Javadoc đầy đủ (`@param`, `@return`, `@throws`).

---

### 2.7. Kiểm Tra Hiệu Năng & Tải Đồng Thời Bằng Apache JMeter (JMeter Performance & Concurrency Gate)
- [ ] **Chạy bắt buộc trước khi bàn giao**: Đã thực thi lệnh `mvn jmeter:jmeter jmeter:results`.
- [ ] **Tỷ lệ lỗi tuyệt đối bằng 0**: Đạt **0.0% Error Rate** (`Failures: 0.0% (0.0% accepted)`).
- [ ] **Thời gian phản hồi (Response Time SLA)**: Trung bình < 500ms dưới tải đồng thời cao.
- [ ] **Báo cáo HTML trực quan**: Tự động sinh báo cáo tại `target/jmeter/reports/*/index.html`.
- [ ] **Cấm kỵ nghiêm ngặt**: CẤM bàn giao mã nguồn nếu chưa chạy kiểm thử tải JMeter hoặc có bất kỳ request nào thất bại!

