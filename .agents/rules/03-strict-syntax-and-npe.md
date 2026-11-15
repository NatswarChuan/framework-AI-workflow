# Rule 03: Ràng Buộc Cú Pháp Nghiêm Ngặt & Phòng Chống NPE Hàng Đầu

Quy tắc này quy định các chuẩn mực cú pháp và kỹ thuật phòng thủ lỗi thời gian thực (Runtime Errors), đặc biệt đặt việc triệt tiêu **NullPointerException (NPE)** lên ưu tiên số một.

---

## 1. CÁC CÚ PHÁP BỊ CẤM TUYỆT ĐỐI (FORBIDDEN SYNTAX)

### 1.1. CẤM: Toán tử 3 ngôi (`condition ? a : b`)
- **Lý do**: Giảm khả năng đọc hiểu mã nguồn, gây khó khăn cho việc đặt breakpoint debug, dễ ẩn giấu lỗi NPE khi unboxing giá trị null.
- **Quy tắc**: Bắt buộc sử dụng cấu trúc `if (...) { ... } else { ... }` đầy đủ khối ngoặc nhọn `{}`.

```java
// SAI (BỊ CẤM):
String statusName = Objects.nonNull(status) ? status.getName() : CommonConstant.EMPTY_STRING;

// ĐÚNG:
String statusName = CommonConstant.EMPTY_STRING;
if (Objects.nonNull(status)) {
  statusName = status.getName();
}
```

---

### 1.2. CẤM: Sử dụng Nested If (if lồng nhau)
- **Lý do**: Cấu trúc `nested if` (lồng `if` này bên trong `if` khác) làm tăng cấp độ thụt dòng (indentation depth), làm rối mắt logic rẽ nhánh, vi phạm nguyên tắc "Flat is better than nested" và làm tăng vọt Cognitive Complexity của SonarQube.
- **Quy tắc**: **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP VIẾT `if` LỒNG NHAU TRONG THÂN HÀM**.
- **Giải pháp**: Bắt buộc sử dụng **Flat Guard Clauses (kiểm tra điều kiện biên và `return` sớm)** ở cùng 1 cấp độ.

```java
// SAI (BỊ CẤM TUYỆT ĐỐI - NESTED IF):
if (Objects.nonNull(user)) {
  if (user.isActive()) {
    if (Objects.equals(user.getRole(), RoleConstant.ADMIN)) {
      executeAdminTask(user);
    }
  }
}

// ĐÚNG: SỬ DỤNG FLAT GUARD CLAUSES (CÙNG CẤP ĐỘ, KHÔNG LỒNG NHAU)
if (Objects.isNull(user)) {
  return;
}
if (!user.isActive()) {
  return;
}
if (!Objects.equals(user.getRole(), RoleConstant.ADMIN)) {
  return;
}
executeAdminTask(user);
```

---

### 1.3. CẤM: Nhiều hơn 1 điều kiện (`&&` hoặc `||`) trong 1 câu lệnh `if`
- **Lý do**: Biểu thức điều kiện phức tạp (compound boolean expressions) làm tăng độ phức tạp nhận thức, dễ nhầm lẫn thứ tự ưu tiên logic và che giấu các trường hợp biên gây lỗi NPE.
- **Quy tắc**: Mỗi câu lệnh `if` chỉ được chứa **đúng 1 biểu thức điều kiện đơn**.
- **Giải pháp**:
  - Dùng các Flat Guard Clauses tuần tự ở cùng 1 cấp độ.
  - Nếu cần gom nhóm logic kiểm tra phức tạp: Tách sang một lớp Helper hoặc Util độc lập mới với phương thức `public` (không dùng private method).

---

### 1.4. CẤM: Khai báo Private Function (Private Method) Trong Mọi Trường Hợp
- **Lý do**: Các private function thường là dấu hiệu của việc vi phạm nguyên lý Single Responsibility Principle (SRP - một class ôm đồm nhiều trách nhiệm ẩn), đồng thời không thể viết Unit Test một cách độc lập nếu không dùng reflection không an toàn.
- **Quy tắc**: **100% PHƯƠNG THỨC TRONG MỌI CLASS PHẢI LÀ `public` (hoặc `protected` khi kế thừa framework)**. Tuyệt đối không khai báo `private` function/method trong Controller, Service, Helper, Util, DTO,...
- **Giải pháp**: Nếu một phương thức cần chia nhỏ logic, bắt buộc phải:
  - Tạo một lớp **`Helper`** (Spring Bean) hoặc **`Util`** (static pure) tương ứng.
  - Đặt phương thức đó là **`public`** trong lớp mới để có thể kiểm thử đơn vị độc lập và tái sử dụng toàn hệ thống.
  *(Lưu ý: Constructor private trong lớp Util/Constant để ngăn khởi tạo là constructor, không phải function thực thi).*

---

### 1.5. CẤM: Tạo Static Class, Enum, Record Trong Mọi Trường Hợp
- **Lý do**:
  - Inner static class làm phá vỡ cấu trúc một file một trách nhiệm, khó quản lý import và khó quét cấu hình.
  - Enum trong Java thường đi kèm với việc nhúng logic hoặc giới hạn khả năng mở rộng đa database / dynamic config.
  - Record có thể thiếu tính tương thích linh hoạt với một số thư viện ORM / serialization cũ và không cho phép tùy biến setter/builder đa hình theo chuẩn doanh nghiệp.
- **Quy tắc**:
  - **CẤM inner static class**: Mỗi class bắt buộc là một tệp `.java` độc lập, top-level class.
  - **CẤM enum**: Mọi tập giá trị hữu hạn phải được chuyển đổi thành một class Constant chuyên biệt chứa các trường hằng số chuỗi: `public static final String`.
  - **CẤM record**: Luôn tạo class chuẩn kết hợp các annotation của Lombok (`@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`).

```java
// SAI (BỊ CẤM - ENUM):
public enum OrderStatus {
  PENDING, COMPLETED, CANCELLED
}

// ĐÚNG: TẠO CLASS HẰNG SỐ ĐỘC LẬP TƯƠNG ỨNG
public final class OrderStatusConstant {

  private OrderStatusConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String PENDING = "PENDING";
  public static final String COMPLETED = "COMPLETED";
  public static final String CANCELLED = "CANCELLED";
}
```

---

### 1.6. CẤM: Khai Báo / Sử Dụng Abstract Class Trong Mọi Trường Hợp
- **Lý do**: `abstract class` làm cứng nhắc cây phả hệ kế thừa (Single Inheritance), tăng độ phụ thuộc chặt chẽ giữa các lớp và làm giảm tính mô-đun hóa.
- **Quy tắc**: **TUYỆT ĐỐI CẤM SỬ DỤNG `abstract class`**.
- **Giải pháp thay thế**:
  - Bắt buộc dùng **`interface` kết hợp với phương thức `default`** (Java 8+ Default Methods).
  - Với các lớp cơ sở bắt buộc theo thiết kế ORM/Exception (`BaseAuditEntity`, `BaseBusinessException`): Khai báo là class thông thường (concrete class), không dùng từ khóa `abstract`.

---

### 1.7. CẤM: Sử Dụng UUIDv4 / `UUID.randomUUID()` (Bắt Buộc Dùng UUIDv7)
- **Lý do**: `UUID.randomUUID()` sinh chuỗi ngẫu nhiên không có thứ tự thời gian, gây phân mảnh B-Tree Index nghiêm trọng trong cơ sở dữ liệu và làm chậm tốc độ ghi.
- **Quy tắc**: **BẮT BUỘC DÙNG UUIDv7 (RFC 9562)** cho mọi mã định danh duy nhất (Entity ID, Trace ID qua `UuidUtil.generateUuidV7()`).

---

### 1.8. CẤM: Kiểu dữ liệu generic lỏng lẻo (`Object`, `var`, `Map<String, Object>`)
- **Quy tắc**:
  - Không được dùng từ khóa `var` cho bất kỳ khai báo biến nào. Luôn viết rõ kiểu dữ liệu tường minh (`List<String> items = new ArrayList<>();`).
  - Không được dùng kiểu `Object` chung chung. Phải dùng Generic hoặc DTO cụ thể.
  - Tuyệt đối không dùng `Map<String, Object>` để truyền nhận dữ liệu payload hoặc xử lý nghiệp vụ.

---

### 1.9. CẤM: So sánh null trực tiếp (`== null` hoặc `!= null`)
- **Quy tắc**: **Bắt buộc sử dụng `java.util.Objects`** cho toàn bộ việc kiểm tra null và so sánh:
  - `Objects.isNull(obj)` thay cho `obj == null`.
  - `Objects.nonNull(obj)` thay cho `obj != null`.
  - `Objects.requireNonNull(obj, "Message")` để kiểm tra tham số bắt buộc.
  - `Objects.equals(a, b)` để so sánh 2 đối tượng an toàn trước null.

---

### 1.10. CẤM: Sử Dụng Exception Class Có Sẵn Của Java / Spring Trong Nghiệp Vụ
- **Lý do**:
  - Các Exception class có sẵn (`IllegalArgumentException`, `NoSuchElementException`, `IllegalStateException`, `RuntimeException`, `NullPointerException`, `ResponseStatusException`) làm mất ngữ cảnh nghiệp vụ (Domain Context), không thể định danh chính xác mã lỗi `errorCode`, mặc định bị bẫy thành HTTP 500 sai lệch, vi phạm bảo mật OWASP khi rò rỉ stack trace nội bộ và không hỗ trợ đa ngôn ngữ i18n.
- **Quy tắc**:
  - **TUYỆT ĐỐI CẤM** ném các Exception class có sẵn trong luồng nghiệp vụ.
  - **100% NGOẠI LỆ NGHIỆP VỤ BẮT BUỘC PHẢI CUSTOMIZE LẠI**: Tạo Custom Exception kế thừa `BaseBusinessException`, mang mã `HttpStatus` chuẩn, mã lỗi trong `ErrorConstant` và thông điệp hỗ trợ i18n.
  - Chi tiết quy chuẩn và bảng đối chiếu: Xem kỹ [Rule 13: Custom Exceptions & HTTP Status](file:///c:/Users/ADMIN/Desktop/Java-Google-Style/.agents/rules/13-custom-exceptions-and-http-status.md) và Skill [spring-boot-exception-handling](file:///c:/Users/ADMIN/Desktop/Java-Google-Style/.agents/skills/spring-boot-exception-handling/SKILL.md).

---

### 1.11. CẤM: Sử Dụng Magic String & Magic Number Trong Mọi Trường Hợp (Kể Cả Log)
- **Lý do**:
  - Các chuỗi ký tự (String literal) và con số (Numeric literal) viết trực tiếp trong mã nguồn làm phân tán cấu hình, khó tái sử dụng, rủi ro sai sót chính tả khi sửa đổi, và vi phạm nghiêm trọng quy chuẩn Clean Code & SonarQube.
- **Quy tắc**:
  - **TUYỆT ĐỐI CẤM** viết trực tiếp bất kỳ chuỗi String hay giá trị Number (prefix vai trò `"B1-"`, `"Bearer "`, default UUID `"00000000-0000-7000-8000-000000000000"`, status `"ACTIVE"`, `"GRANTED"`, TTL seconds `3600L`, timeout, retry limits, audit reasons) nào trong luồng xử lý logic.
  - **100% String và Number PHẢI ĐƯỢC TẠO CONST TƯƠNG ỨNG**: Bắt buộc định nghĩa trong các lớp `*Constant` chuyên biệt (`CommonConstant`, `RoleConstant`, `LogConstant`, `ErrorConstant`, `DateTimeConstant`, `HttpHeaderConstant`...) kèm Javadoc đầy đủ.
  - **ÁP DỤNG BẮT BUỘC CHO CẢ LOGGING**: Mọi câu lệnh SLF4J (`log.info`, `log.warn`, `log.error`, `log.debug`) đều phải sử dụng mẫu chuỗi từ `LogConstant` hoặc `*LogConstant` theo domain, tuyệt đối không viết String literal trực tiếp vào hàm log.

---

### 1.12. CẤM: Gọi Chuỗi Hàm Setter Rời Rạc Thay Vì Dùng Builder Pattern (Ưu Tiên Builder Over Setter)
- **Lý do**:
  - Việc gọi các setter rời rạc `obj.setA(...); obj.setB(...);` làm phá vỡ tính bất biến (Immutability), dễ bỏ sót trường dữ liệu, khó kiểm soát trạng thái đối tượng khi có concurrency và làm mã nguồn dài dòng, khó bảo trì.
- **Quy tắc**:
  - **ƯU TIÊN TUYỆT ĐỐI BUILDER PATTERN**: 100% các thao tác khởi tạo hoặc cập nhật đối tượng (Entity, DTO, Request, Response, Model) bắt buộc phải sử dụng Builder Pattern (`.builder()...build()` hoặc `@Builder(toBuilder = true)`).
  - Hạn chế tối đa việc dùng `@Setter` và cấm gọi các chuỗi setter rời rạc trong toàn bộ luồng nghiệp vụ.

---

### 1.13. CẤM: Khai Báo Phương Thức Phụ Trợ (Non-Override) Trong Lớp Service Implementation
- **Lý do**:
  - Việc khai báo thêm các phương thức phụ trợ (không thuộc Service Interface) trong `*ServiceImpl` làm phình to kích thước lớp Service, vi phạm nguyên lý Single Responsibility Principle (SRP) và phá vỡ tính trừu tượng của Interface contract.
- **Quy tắc**:
  - Trong lớp `*ServiceImpl`, **100% PHƯƠNG THỨC KHAI BÁO BẮT BUỘC PHẢI CÓ `@Override` TỪ SERVICE INTERFACE**.
  - **TUYỆT ĐỐI CẤM** khai báo thêm bất kỳ phương thức phụ trợ nào (kể cả phương thức `public`).
  - Toàn bộ logic phân rã, tra cứu phụ trợ, validation nghiệp vụ con, mapping trung gian hoặc rẽ nhánh điều kiện phức tạp **BẮT BUỘC DI CHUYỂN SANG CÁC LỚP `Helper`** (`@Component`, `final class`) và tiêm qua DI constructor.

---

## 2. CHIẾN LƯỢC PHÒNG VỆ TRIỆT TIÊU NPE (DEFENSIVE NULL-SAFETY)

1. **Kiểm tra hợp lệ tại ranh giới (Validate at the Border)**:
   - Tất cả tham số đầu vào của public method phải được kiểm tra tính null thông qua `Objects.requireNonNull()` hoặc annotation `@NonNull`.
   - DTO nhận từ bên ngoài phải được đánh dấu bằng `@NotNull`, `@NotBlank` của Jakarta Bean Validation.

2. **Không bao giờ trả về `null` cho Collections**:
   - Nếu phương thức trả về `List`, `Set`, `Map`: Bắt buộc trả về `Collections.emptyList()`, `Collections.emptySet()`, `Collections.emptyMap()` thay vì `null`.

3. **Sử dụng `Optional<T>` đúng chuẩn**:
   - Sử dụng `Optional<T>` làm kiểu trả về của các phương thức truy vấn có thể không tìm thấy kết quả.
   - **Tuyệt đối KHÔNG sử dụng `Optional` làm tham số truyền vào của method**.
   - Không gọi `.get()` trực tiếp trên `Optional` mà không kiểm tra; luôn dùng `.orElseThrow()` hoặc `.orElseGet()`.

4. **Khai báo tham số bất biến (`final`)**:
   - Mọi tham số truyền vào method nên được đánh dấu là `final` (ví dụ: `public void execute(final OrderRequest request)`).
