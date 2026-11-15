# Rule 09: Quy Chuẩn Cú Pháp Lombok An Toàn & Chuẩn Mực Doanh Nghiệp

Lombok là công cụ giúp giảm thiểu boilerplate code (mã rườm rà), nhưng nếu sử dụng sai cú pháp sẽ dẫn đến các lỗi nghiêm trọng về hiệu năng, rò rỉ bộ nhớ (Memory Leak), lỗi `StackOverflowError` trong Hibernate/JPA và xung đột với các công cụ phân tích tĩnh (SonarQube/Coverity).

---

## 1. CÁC QUY TẮC CÚ PHÁP LOMBOK BẮT BUỘC

### 1.1. TUYỆT ĐỐI CẤM dùng `@Data` trên JPA Entities
- **Nguy cơ tiềm ẩn**: `@Data` tự động sinh `equals()`, `hashCode()` và `toString()` trên toàn bộ các trường. Khi Entity có quan hệ hai chiều (`@OneToMany`, `@ManyToOne`), việc gọi `toString()` hoặc `hashCode()` sẽ gây đệ quy vô hạn dẫn tới **`StackOverflowError`**, đồng thời kích hoạt Lazy Loading ngoài ý muốn làm tê liệt cơ sở dữ liệu (N+1 query).
- **Cú pháp chuẩn cho Entity**:
  ```java
  // ĐÚNG: Tách bạch rõ ràng từng annotation
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Entity
  @Table(name = "orders")
  public class OrderEntity extends BaseAuditEntity {
    // Tự override equals() và hashCode() an toàn theo ID hoặc Business Key
  }
  ```

### 1.2. Cú pháp bắt cặp an toàn khi sử dụng `@Builder`
- Khi dùng `@Builder` trên các lớp DTO, Request, Response (được Jackson/Spring Web deserialize từ JSON hoặc MapStruct ánh xạ), **BẮT BUỘC PHẢI KHAI BÁO ĐỦ 3 ANNOTATION**:
  ```java
  @Getter
  @Setter
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class UserDto {
    private Long id;
    private String name;
  }
  ```
  *(Nếu thiếu `@NoArgsConstructor`, Jackson sẽ không thể khởi tạo đối tượng khi parse JSON. Nếu thiếu `@AllArgsConstructor`, `@Builder` sẽ gây lỗi biên dịch).*

### 1.3. Cú pháp Dependency Injection qua `@RequiredArgsConstructor`
- Chỉ dùng `@RequiredArgsConstructor` kết hợp với các biến được khai báo tường minh là **`private final`**.
- Tuyệt đối không dùng `@AllArgsConstructor` cho mục đích tiêm phụ thuộc Spring Bean.
  ```java
  @Service
  @RequiredArgsConstructor
  public class PaymentServiceImpl implements PaymentService {

    // private final là bắt buộc để @RequiredArgsConstructor tạo constructor tiêm phụ thuộc
    private final PaymentRepository paymentRepository;
    private final NotificationHelper notificationHelper;
  }
  ```

### 1.4. Quản lý Ghi Nhật Ký với `@Slf4j`
- Bắt buộc dùng `@Slf4j` của Lombok trên Controller, Service, Helper.
- Nhờ `@Slf4j`, lập trình viên không phải tự gõ `private static final Logger log = ...`, từ đó tuân thủ 100% quy tắc: **Không khai báo `static final` ở bất kỳ lớp nào ngoài lớp Constant**.

### 1.5. Ưu tiên tuyệt đối Builder Pattern thay vì Setter (Builder Over Setter Principle)
- **CẤM TUYỆT ĐỐI**: Gọi chuỗi setter rời rạc `obj.setA(...); obj.setB(...); obj.setC(...);` khi khởi tạo hoặc tạo bản sao đối tượng. Cách làm này phá vỡ tính bất biến (Immutability), dễ bỏ sót trường dữ liệu và khó kiểm soát trạng thái đối tượng.
- **BẮT BUỘC SỬ DỤNG BUILDER**:
  - Khi tạo mới đối tượng (Entity, DTO, Request, Response): Luôn dùng `.builder().fieldA(...).fieldB(...).build()`.
  - Khi cập nhật hoặc chỉnh sửa một vài trường trên đối tượng hiện có: Khai báo `@Builder(toBuilder = true)` trên Entity/DTO và sử dụng `original.toBuilder().updatedField(...).build()`.
  - Trên JPA Entity: Khai báo đầy đủ `@Getter`, `@Setter`, `@Builder(toBuilder = true)`, `@NoArgsConstructor`, `@AllArgsConstructor`. Hibernate vẫn có thể dùng no-args constructor và reflection, trong khi mã nguồn nghiệp vụ sử dụng Builder Pattern nhất quán.

---

## 2. BẢNG TRA CỨU SỬ DỤNG LOMBOK THEO TẦNG

| Lớp thành phần | Các Annotation Lombok được phép dùng | Annotation bị cấm |
| :--- | :--- | :--- |
| **JPA Entity** | `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor` | `@Data`, `@Value`, `@EqualsAndHashCode` (không an toàn) |
| **Request / Response / DTO** | `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@ToString` | `@val`, `@var` |
| **Service Implementation** | `@Slf4j`, `@RequiredArgsConstructor` | `@AllArgsConstructor`, `@Autowired` |
| **Helper Component** | `@Slf4j`, `@RequiredArgsConstructor` | `@AllArgsConstructor` |
| **Configuration Properties** | `@Getter`, `@Setter` | `@Builder` (gây khó cho Spring Binder) |
| **Constant / Util** | Không dùng (viết Java Core với private ctor theo Rule 04) | `@Data`, `@Component` |

---

## 3. CẤU HÌNH TƯƠNG THÍCH SONARQUBE VÀ COVERITY
Tại thư mục gốc dự án, tệp `lombok.config` phải luôn có dòng:
```properties
lombok.addLombokGeneratedAnnotation = true
```
Dòng cấu hình này tự động gắn annotation `@lombok.Generated` vào bytecode của mọi method do Lombok sinh ra. Khi SonarQube và JaCoCo chạy quét mã, chúng sẽ tự động bỏ qua các getter, setter, builder được sinh ra tự động, loại bỏ 100% cảnh báo "Uncovered lines/branches" giả.
