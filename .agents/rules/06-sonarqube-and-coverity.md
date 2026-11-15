# Rule 06: Tiêu Chuẩn Khắt Khe SonarQube & Phân Tích Tĩnh Coverity

Tài liệu này quy chuẩn bắt buộc về kiểm soát chất lượng mã nguồn tĩnh. Toàn bộ mã nguồn khi sinh ra **BẮT BUỘC PHẢI VƯỢT QUA TOÀN BỘ CỔNG CHẤT LƯỢNG (QUALITY GATES)** của **SonarQube** và hệ thống bảo mật tĩnh **Coverity**.

> **NGUYÊN TẮC ZERO-DEFECT (KHẮC PHỤC 100% CẢNH BÁO DÙ LÀ THẤP NHẤT)**:
> Tuyệt đối không chấp nhận bất kỳ cảnh báo hoặc nợ kỹ thuật (Technical Debt) nào ở **MỌI CẤP ĐỘ**:
> - 🔴 **BLOCKER**: 0 lỗi.
> - 🟠 **CRITICAL**: 0 lỗi.
> - 🟡 **MAJOR**: 0 lỗi.
> - 🔵 **MINOR**: 0 lỗi.
> - ⚪ **INFO**: 0 lỗi.
> Bất kỳ Code Smell nào, dù là nhỏ nhất (như biến thừa, khoảng trắng, thứ tự khai báo, chú thích thiếu), đều bắt buộc phải được xử lý triệt để trước khi bàn giao.

---

## 1. TIÊU CHUẨN KHẮT KHE VỀ ĐỘ DÀI & ĐỘ PHỨC TẠP (COMPLEXITY & SIZING)

Hệ thống thiết lập các ngưỡng khắt khe hơn tiêu chuẩn mặc định của SonarQube nhằm bảo đảm tính đơn giản, dễ đọc, dễ kiểm thử và khả năng bảo trì tối đa:

| Chỉ số đo lường (Metric) | SonarQube Rule ID | Ngưỡng Mặc Định Sonar | **Ngưỡng Bắt Buộc Dự Án (Strict)** | Hành Động Khi Vượt Ngưỡng |
| :--- | :--- | :---: | :---: | :--- |
| **Độ dài Phương thức (Method Length)** | `java:S138` | 75 dòng | **Tối đa 30 - 40 dòng** (không tính chuỗi builder mapping phẳng) | Tách logic sang lớp Helper/Util mới với phương thức `public`. |
| **Độ dài Tập tin / Lớp (Class Length)** | `java:S00104` | 750 / 1000 dòng | **Tối đa 200 - 300 dòng** | Phân rã trách nhiệm theo Single Responsibility Principle (SRP). |
| **Số lượng Tham số (Method Parameters)** | `java:S107` | 7 tham số | **Tối đa 3 tham số** | Gom các tham số thành một DTO / Parameter Object chuyên biệt. |
| **Độ phức tạp Nhận thức (Cognitive Complexity)** | `java:S3776` | 15 điểm | **Tối đa <= 8 điểm** | Sử dụng Flat Guard Clauses (`return` sớm), xóa bỏ vòng lặp/điều kiện lồng nhau. |
| **Độ phức tạp Chu trình (Cyclomatic Complexity)** | `java:S1541` | 10 điểm | **Tối đa <= 8 điểm** | Loại bỏ rẽ nhánh phức tạp, áp dụng Strategy Pattern qua Interface `default`. |
| **Số lượng Phương thức Public trong Lớp** | `java:S1448` | 35 methods | **Tối đa <= 10 - 15 methods** | Tách class thành các Service hoặc Helper nhỏ hơn theo từng miền nghiệp vụ. |

---

## 2. KIỂM SOÁT ĐỘ PHỨC TẠP NHẬN THỨC & CHU TRÌNH (S3776 & S1541)

### 2.1. Quy tắc tính điểm Cognitive Complexity:
SonarQube cộng điểm mỗi khi luồng điều khiển bị phá vỡ tuyến tính (B1) hoặc khi có cấu trúc lồng nhau (nesting increment):
- Khối `if`, `for`, `while`, `catch`: +1 điểm (cộng thêm điểm lồng nhau nếu nằm trong khối khác).
- Cú pháp ternary `? :`: Bị cấm hoàn toàn.
- Toán tử logic kết hợp `&&`, `||`: Bị cấm hoàn toàn (mỗi `if` chỉ 1 điều kiện đơn).

### 2.2. Kỹ thuật giảm độ phức tạp:
1. **Flat Guard Clauses (Kiểm tra biên và `return` sớm)**:
   - Xử lý các điều kiện null, điều kiện biên ngay tại đầu hàm.
   - Tránh việc bọc toàn bộ khối xử lý bên trong một khối `if`.
2. **Không lồng điều kiện (`No Nested If`)**:
   - Tuyệt đối không viết `if` bên trong `if`.
3. **Phân rã logic bằng Helper/Util mới**:
   - Vì dự án **CẤM HOÀN TOÀN private function**, khi một hàm có nguy cơ vượt quá 8 điểm độ phức tạp hoặc 35 dòng, bắt buộc phải tách logic đó thành một lớp Helper (`@Component`) hoặc Util (`final class, static only`) độc lập với phương thức `public`.

---

## 3. KHẮC PHỤC TRIỆT ĐỂ CÁC LỖI SONARQUBE THEO TỪNG CẤP ĐỘ

### 3.1. Cấp Độ BLOCKER & CRITICAL (Zero Defect)

| SonarQube Rule | Mô tả | Giải pháp chuẩn mực bắt buộc |
| :--- | :--- | :--- |
| `java:S2259` | Null pointer dereference (Nguy cơ NPE) | 100% sử dụng `java.util.Objects` kiểm tra null (`Objects.requireNonNull`, `Objects.nonNull`). |
| `java:S2095` | Resources should be closed (Rò rỉ tài nguyên) | 100% tài nguyên `AutoCloseable` (Stream, Connection, Reader) phải dùng `try-with-resources`. |
| `java:S2077` | SQL injection formatting | 100% truy vấn qua JPA Repository hoặc `@Query` có named parameter (`:param`). Cấm nối chuỗi SQL. |
| `java:S2142` | `InterruptedException` should not be ignored | Phải khôi phục cờ ngắt: `Thread.currentThread().interrupt();` trong khối `catch`. |
| `java:S1143` | `return` inside `finally` block | Cấm dùng `return` hoặc ném ngoại lệ trong khối `finally`. |

---

### 3.2. Cấp Độ MAJOR (Zero Defect)

| SonarQube Rule | Mô tả | Giải pháp chuẩn mực bắt buộc |
| :--- | :--- | :--- |
| `java:S112` | Generic exceptions should never be thrown | Cấm ném `RuntimeException`, `Exception`, `Throwable`. 100% dùng Custom Exception kế thừa `BaseBusinessException`. |
| `java:S1166` | Exception handlers should preserve the original exception | Khi bắt exception, bắt buộc truyền `ex` vào Custom Exception (làm cause) hoặc ghi log stacktrace. Cấm nuốt lỗi. |
| `java:S106` | Standard outputs should not be used | Cấm `System.out.println` và `System.err.println`. 100% dùng Logger SLF4J (`@Slf4j`). |
| `java:S1192` | String literals should not be duplicated | Bắt buộc trích xuất 100% chuỗi ký tự thành hằng số trong các file `*Constant`. |
| `java:S2184` | Math operands should be cast before assignment | Ép kiểu số học trước khi gán để tránh tràn số (integer overflow). |
| `java:S1319` | Declarations should use collection interfaces | Khai báo kiểu trả về/tham số là `List`, `Set`, `Map` thay vì `ArrayList`, `HashSet`, `HashMap`. |

---

### 3.3. Cấp Độ MINOR & INFO (Zero Defect - Bắt Buộc Fix 100%)

Nhiều lập trình viên thường bỏ qua cấp độ này, nhưng trong dự án này **100% PHẢI ĐƯỢC XỬ LÝ SẠCH SẼ**:

| SonarQube Rule | Mô tả Code Smell (Minor/Info) | Giải pháp chuẩn mực bắt buộc |
| :--- | :--- | :--- |
| `java:S1118` | Utility classes should not have public constructors | Lớp Util và Constant phải là `public final class` với private constructor ném `UnsupportedOperationException`. |
| `java:S1186` | Methods should not be empty | Không để method hoặc constructor rỗng. Nếu cố ý rỗng, phải có comment giải thích rõ ràng hoặc ném exception. |
| `java:S1488` | Local variables should not be declared and immediately returned | Cấm khai báo `final var x = ...; return x;` thừa thãi. Hãy return trực tiếp kết quả. |
| `java:S125` | Sections of code should not be commented out | Xóa bỏ 100% mã nguồn bị comment. Lịch sử đã có Git lưu trữ. |
| `java:S1155` | Collection.isEmpty() should be used instead of size() == 0 | Luôn dùng `collection.isEmpty()` để kiểm tra rỗng, tối ưu thời gian chạy O(1). |
| `java:S1144` | Unused private fields/methods should be removed | Xóa bỏ toàn bộ trường hoặc phương thức không sử dụng trong mã nguồn. |
| `java:S1481` | Unused local variables should be removed | Xóa bỏ các biến cục bộ được khởi tạo nhưng không bao giờ đọc giá trị. |
| `java:S1226` | Method parameters should not be reassigned | Không gán lại giá trị cho tham số đầu vào. Khai báo `final` cho toàn bộ tham số method. |
| `java:S2293` | The diamond operator (<>) should be used | Sử dụng diamond operator `<>` thay vì lặp lại kiểu generic: `new ArrayList<>()`. |
| `java:S1170` | Constants should be UPPER_SNAKE_CASE | Tên hằng số `public static final` phải viết hoa hoàn toàn và nối bằng dấu gạch dưới `_`. |
| `java:S116` / `S101` | Naming conventions (Java Google Style) | Tên biến/phương thức phải là `lowerCamelCase`, tên lớp là `UpperCamelCase`. |
| `java:S3457` | Composite formatting or parameterization in logs | Dùng cú pháp tham số hóa log `log.info(LogConstant.MSG, param)` thay vì nối chuỗi `+`. |
| `java:S1659` | Multiple variables should not be declared on the same line | Mỗi dòng chỉ khai báo đúng 1 biến. |
| `java:S2131` | Primitives should not be boxed just for "toString()" | Dùng `String.valueOf(intVal)` thay vì `new Integer(intVal).toString()`. |
| `java:S4042` | `java.nio.file.Files.delete` instead of `File.delete` | Dùng `Files.deleteIfExists(path)` thay vì `File.delete()` để có thông báo lỗi chi tiết khi thất bại. |

---

## 4. AN TOÀN PHÂN TÍCH TĨNH COVERITY (SECURITY & ROBUSTNESS)

### 4.1. Chống Dereference Before Null Check (Forward/Reverse Null Dereference)
Tuyệt đối không truy cập phương thức/thuộc tính của một đối tượng trước khi kiểm tra null đối tượng đó:
```java
// SAI: Dễ bị Coverity gắn cờ Reverse Null Dereference
if (dto.getName() != null && dto != null) { ... }

// ĐÚNG: Luôn kiểm tra đối tượng cha trước bằng Objects
Objects.requireNonNull(dto, CommonConstant.MSG_DTO_NOT_NULL);
if (Objects.nonNull(dto.getName())) {
  processName(dto.getName());
}
```

### 4.2. Chống Rò Rỉ Tài Nguyên (Resource Leak)
Mọi luồng nhập xuất bắt buộc đóng bằng `try-with-resources`:
```java
// ĐÚNG: Tự động đóng stream an toàn tuyệt đối
try (InputStream inputStream = Files.newInputStream(filePath)) {
  processStream(inputStream);
} catch (IOException ex) {
  log.error(FileLogConstant.ERROR_READ_FILE, filePath, ex);
  throw new FileStorageException(ErrorConstant.ERR_FILE_READ_FAILED, ex);
}
```

### 4.3. Chống Bắt Lỗi Generic & Nuốt Ngoại Lệ
- Tuyệt đối không `catch (Exception e)` trong tầng nghiệp vụ Service/Helper. Bắt chính xác loại ngoại lệ cụ thể (`IOException`, `SQLException`, `DataAccessException`).
- Tuyệt đối không để khối `catch` trống hoặc chỉ in log mà không xử lý. Bắt buộc bọc vào Custom Exception kế thừa `BaseBusinessException` mang `HttpStatus` và truyền `ex` vào tham số `cause`.

---

## 5. CHECKLIST ĐỐI SOÁT SONARQUBE KHẮT KHE TRƯỚC KHI BÀN GIAO

Mỗi lớp mã nguồn khi hoàn thành phải thỏa mãn bảng tiêu chuẩn:
- [ ] **Độ dài hàm**: Không phương thức nào vượt quá 30 - 40 dòng code.
- [ ] **Độ dài lớp**: Không tệp nào vượt quá 200 - 300 dòng code.
- [ ] **Số lượng tham số**: Mọi phương thức đều có tối đa 3 tham số. Nếu cần nhiều hơn, đã đóng gói thành DTO.
- [ ] **Cognitive Complexity**: Mọi phương thức đều có điểm độ phức tạp nhận thức <= 8.
- [ ] **Cyclomatic Complexity**: Mọi phương thức đều có điểm độ phức tạp chu trình <= 8.
- [ ] **Không vi phạm Blocker (0)**: Không có nguy cơ NPE, không rò rỉ tài nguyên, không SQL injection.
- [ ] **Không vi phạm Critical (0)**: Không có lỗi đa luồng, không nuốt ngoại lệ.
- [ ] **Không vi phạm Major (0)**: Không ném Exception có sẵn, không magic string/number, không `System.out`.
- [ ] **Không vi phạm Minor & Info (0)**:
  - [ ] 100% lớp Util/Constant có private constructor ném `UnsupportedOperationException`.
  - [ ] Không có biến cục bộ thừa gán xong return ngay (`S1488`).
  - [ ] Không có dòng mã nào bị comment (`S125`).
  - [ ] 100% dùng `collection.isEmpty()` thay cho `size() == 0` (`S1155`).
  - [ ] 100% tham số phương thức có từ khóa `final` (`S1226`).
  - [ ] 100% generics dùng diamond operator `<>` (`S2293`).
  - [ ] 100% logging dùng cú pháp placeholder không nối chuỗi (`S3457`).
