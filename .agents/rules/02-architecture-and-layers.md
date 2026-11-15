# Rule 02: Kiến trúc Phần mềm SOLID & Phân Tách Lớp (Layering Architecture & Strict SRP)

Hệ thống được thiết kế theo mô hình Clean Architecture & Domain-Driven Design (DDD) thu gọn, tuân thủ triệt để nguyên lý **Single Responsibility Principle (SRP - Đơn trách nhiệm)** cho từng phân tầng: **Mỗi layer chỉ đảm nhiệm duy nhất một vai trò**.

---

## 1. NGUYÊN TẮC: CONTROLLER CHỈ LÀ ĐIỀU PHỐI VIÊN (PURE COORDINATOR / DISPATCHER)

Trong mô hình kiến trúc này, **Controller KHÔNG ĐƯỢC PHÉP chứa bất kỳ logic nào ngoài việc điều phối HTTP**.

### 1.1. Bốn (4) Trách Nhiệm Duy Nhất Của Controller:
1. **Tiếp nhận HTTP Request**: Khai báo mapping endpoint (`@GetMapping`, `@PostMapping`,...), nhận Path Variables, Query Params, Headers, Request Body.
2. **Kích hoạt Validation đầu vào**: Gắn annotation `@Valid` trước `@RequestBody` để Spring Validation tự động kiểm tra tính hợp lệ của DTO.
3. **Ủy quyền cho Service Interface**: Chuyển giao toàn quyền thực thi cho phương thức tương ứng của Service Interface (Single Delegation).
4. **Đóng gói và Trả về HTTP Response**: Nhận dữ liệu kết quả từ Service, bọc vào đối tượng chuẩn hóa `ApiResponse<T>` và trả về qua `ResponseEntity` với mã `HttpStatus` chuẩn (`HttpStatus.OK`, `HttpStatus.CREATED`, v.v.).

### 1.2. Những Điều CẤM TUYỆT ĐỐI Trong Controller:
- ❌ **CẤM** viết logic nghiệp vụ, tính toán tiền tệ, xử lý dữ liệu phức tạp.
- ❌ **CẤM** sử dụng câu lệnh điều kiện rẽ nhánh nghiệp vụ (`if/else`) trong Controller.
- ❌ **CẤM** tiêm (`@Autowired` / Constructor) trực tiếp **Repository** hoặc thao tác với **Entity**.
- ❌ **CẤM** gọi trực tiếp các Helper phụ trợ hoặc tự ghi đè database.

```java
// CODE MẪU CONTROLLER CHUẨN ĐIỀU PHỐI VIÊN:
@PostMapping
public ResponseEntity<ApiResponse<UserResponse>> createUser(
    @Valid @RequestBody final UserCreateRequest request) {
  Objects.requireNonNull(request, CommonConstant.MSG_REQUEST_NOT_NULL);

  // 1. Chỉ ủy quyền cho Service Interface
  final UserResponse response = userService.createUser(request);

  // 2. Chỉ bọc vào ApiResponse và trả về HTTP Status
  return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
}
```

---

## 2. MA TRẬN ĐƠN TRÁCH NHIỆM CHO TỪNG TẦNG (LAYER SRP MATRIX)

| Tầng (Layer) | Trách nhiệm DUY NHẤT (What It DOES) | Điều TUYỆT ĐỐI CẤM (What It NEVER Does) |
| :--- | :--- | :--- |
| **`filter`** | Tiền xử lý HTTP (Security, Tracing, CORS, Logging). | Không chứa logic nghiệp vụ domain hay gọi Repository. |
| **`controller`** | Điều phối HTTP: Nhận request, gọi Service, trả response. | Không chứa business logic, không gọi Repository/Entity. |
| **`request`** | Hợp đồng nhận dữ liệu đầu vào + validation Jakarta + `toEntity()` / `toDto()`. | Không chứa logic nghiệp vụ xử lý dữ liệu. |
| **`response`** | Hợp đồng trả dữ liệu đầu ra cho client + `fromEntity()` / `fromDto()`. | Không chứa logic truy vấn DB hoặc biến đổi nghiệp vụ. |
| **`dto`** | Truyền tải dữ liệu trung gian giữa các tầng nội bộ, kèm `toXXX()` / `fromXXX()`. | Không chứa logic nghiệp vụ domain, không chứa annotation ORM. |
| **`model`** | Đại diện cho các đối tượng miền (Domain Model), Value Objects. | Không dính líu đến HTTP Request/Response hay SQL. |
| **`entity`** | Đại diện cho cấu trúc bảng cơ sở dữ liệu (ORM/JPA). | Không trả trực tiếp về Controller/Client; không dùng `@Data`. |
| **`mapper`** | Chuyển đổi dữ liệu đối ứng giữa các tầng qua Builder Pattern. | Không chứa logic nghiệp vụ hay truy vấn DB. |
| **`service` (Interface)** | Định nghĩa hợp đồng nghiệp vụ độc lập với hạ tầng. | Không chứa mã thực thi logic. |
| **`service` (Impl)** | Thực thi 100% quy trình nghiệp vụ (Business Orchestration), giao dịch `@Transactional`. | Không dùng HttpServletRequest, không format HTTP response. |
| **`repository`** | Truy xuất và lưu trữ dữ liệu với Cơ sở dữ liệu (Spring Data JPA). | Không chứa business logic hay validation nghiệp vụ. |
| **`config`** | Cấu hình Spring Beans, Security, `@ConfigurationProperties`, i18n. | Không can thiệp vào quy trình nghiệp vụ runtime. |
| **`handler`** | Bẫy ngoại lệ tập trung (`@RestControllerAdvice`), ánh xạ sang HttpStatus. | Không thực thi nghiệp vụ domain. |
| **`exception`** | Định nghĩa các trạng thái lỗi nghiệp vụ kèm mã `HttpStatus`. | Không chứa logic xử lý ngoại lệ. |
| **`common`** | Chứa định nghĩa chia sẻ dùng chung (Constants, BaseAuditEntity, ApiResponse). | Không chứa logic nghiệp vụ chuyên biệt. |
| **`util`** | Tiện ích tĩnh (public final, private ctor, static only, stateless). | Không là Spring Bean, không trạng thái, không chứa hằng số. |
| **`helper`** | Trợ thủ nghiệp vụ phụ trợ (final, @Component, non-static, tiêm qua DI). | Không chứa static method, không thay thế Service nghiệp vụ. |

---

## 3. LUỒNG DỮ LIỆU ĐIỀU PHỐI CHUẨN (DISPATCH DATA FLOW)

```
[ Client Request ]
       │
       ▼
[ Filter Layer ] (Authentication, Logging, Tracing)
       │
       ▼
[ Controller ] (ĐIỀU PHỐI VIÊN: Validate @Valid -> Gọi Service -> Trả Response)
       │
       ▼
[ Service Interface ] (HỢP ĐỒNG NGHIỆP VỤ)
       │
       ▼
[ Service Implementation ] (THỰC THI TOÀN BỘ LOGIC NGHIỆP VỤ & TRANSACTION)
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                 ▼                                 ▼
[ Mapper / toEntity ]             [ Repository ]                   [ Helper / Util ]
(Dựng Entity qua Builder)       (Truy xuất DB)                   (Gửi mail, sms, token)
       │                                 │
       ▼                                 ▼
  [ Entity ] ───────────────────────► [ DB ]
       │
       ▼
[ Mapper / fromEntity ]
(Dựng Response qua Builder)
       │
       ▼
[ Service Trả Response ] ────────► [ Controller Trả ApiResponse ] ──► [ Client ]
```

---

## 4. QUY TẮC RÀNG BUỘC PHÂN LỚP
1. **Controller** KHÔNG ĐƯỢC phép trực tiếp tương tác với **Repository** hoặc **Entity**. Bắt buộc phải qua **Service**.
2. **Entity** KHÔNG ĐƯỢC phép trả thẳng về cho Client trong Controller. Bắt buộc phải map sang **`*Response`** qua hàm `fromEntity()` dùng Builder.
3. Không tạo circular dependency (phụ thuộc vòng giữa các Service/Component). Nếu phát sinh phụ thuộc vòng, bắt buộc phải tách logic chung ra **`*Helper`**.
4. **Service Implementation CHỈ TRIỂN KHAI PHƯƠNG THỨC `@Override` TỪ INTERFACE (Interface-Only Service Methods)**: Trong lớp `*ServiceImpl`, 100% phương thức khai báo bắt buộc phải là phương thức `@Override` từ Service Interface tương ứng. Tuyệt đối CẤM khai báo bất kỳ phương thức phụ trợ nào (kể cả phương thức `public`) bên trong lớp ServiceImpl. Toàn bộ logic phân rã, nghiệp vụ con, validation phụ trợ, tra cứu dữ liệu phụ hoặc mapping trung gian BẮT BUỘC PHẢI DI CHUYỂN sang các lớp `Helper` độc lập mới (`final class`, `@Component`, tiêm qua Dependency Injection).
5. **Ưu Tiên Tuyệt Đối Builder Pattern Thay Vì Setter (Builder Over Setter Principle)**: Khi khởi tạo hoặc cập nhật đối tượng (Entity, DTO, Request, Response, Model), 100% bắt buộc dùng Builder Pattern (`.builder()...build()`, `@Builder(toBuilder = true)`). Hạn chế tối đa dùng `@Setter` và cấm gọi các chuỗi setter rời rạc `obj.setA(...); obj.setB(...);` để đảm bảo tính bất biến (Immutability), tính an toàn luồng và mã nguồn sạch sẽ.
