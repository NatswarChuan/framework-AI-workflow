# Rule 30: Chuẩn Đặc Thù Spring-NWVMC (Delta Standards — Single-Module OSS, Stack-Trace & Traceability)

Quy chuẩn này bổ sung các ràng buộc đặc thù cho `io.github.natswarchuan:spring-nwvmc` chưa được bao phủ bởi `.agents/rules/01`–`29`. Không lặp lại các chuẩn Java Google Style, Util/Helper, Constants, SonarQube, Lombok, UUIDv7, i18n, Caching, Profiles, JWT, Validation hay Virtual Threads đã có.

---

## 1. SINGLE-MODULE MAVEN & BACKWARD COMPATIBILITY

1. **Cấu trúc Single-Module Bắt Buộc**:
   - Duy trì cấu trúc Single-Module Maven tại `controller-to-api-framework/pom.xml`. Tuyệt đối không tách framework thành các Maven sub-module rời rạc hoặc tạo BOM riêng.
   - Ngoại lệ có kiểm soát đối với Rule 28 (`Modular Architecture`): Trong nội bộ thư viện framework, engine truy vấn và sub-resource tiếp tục hỗ trợ đầy đủ `@ManyToOne`, `@OneToMany`, `@OneToOne` trên các Entity do ứng dụng consumer định nghĩa.
2. **Bảo Toàn 100% Tương Thích Ngược Annotation & Public Contract**:
   - Mọi thay đổi tối ưu nội bộ (`MethodHandle`, `LambdaMetafactory`, GraalVM AOT, Fail-Fast Diagnostics, Guardrails, Escape Hatch) phải giữ nguyên chữ ký và hành vi tương thích ngược của toàn bộ annotation công khai:
     - `@AutoRestController`, `@AutoGet`, `@AutoPost`, `@AutoPut`, `@AutoPatch`, `@AutoDelete`, `@BusinessAction`, `@CustomEndpoint`, `@CustomQuery`
     - `@EntitySecurity`, `@FieldSecurity`, `@HumanPolicy`, `@MultiTenant`, `@StateMachine`, `@ComputedField`, `@HttpCacheable`
     - `@DistributedLock`, `@Idempotent`, `@EntityCircuitBreaker`, `@EntityRetry`, `@RateLimit`, `@PublishCloudEvent`, `@EntityWebhook`
3. **Zero-Config Ideal Metadata**:
   - Bổ sung `@ConfigurationProperties` / `spring-boot-configuration-processor` cho các lớp trong `config.properties` để sinh tự động `META-INF/spring-configuration-metadata.json` khi biên dịch. Mặc định của các trường cấu hình tiếp tục tham chiếu lớp `*Constant` tuân thủ Rule 05.

---

## 2. BẢO TOÀN STACK-TRACE & TRUY VẾT NGUYÊN NHÂN GỐC (STACK-TRACE PRESERVATION & ROOT-CAUSE POLICY)

1. **Bắt Buộc Trong Server-Side Logging**:
   - Mọi khối xử lý ngoại lệ trong framework (`GlobalExceptionHandler`, `ServletFilterExceptionHandler`, `CustomContainerErrorController`, bridge/aspect catch blocks) khi ghi log mức `ERROR` hoặc `WARN` cho lỗi hệ thống **bắt buộc truyền nguyên đối tượng ngoại lệ gốc (`log.error(template, ..., exception)`)** để bảo toàn trọn vẹn chuỗi `Caused by` trên hệ thống log/observability.
   - Tuyệt đối cấm nuốt ngoại lệ (`catch (Exception ignored) {}`) trên luồng xử lý request/dispatch hoặc chỉ ghi `e.getMessage()`.
2. **Làm Sạch Tách Bạch Với HTTP Client Response (Anti-Fingerprinting)**:
   - Tại lớp dựng JSON response trả về client (`ApiResponse`, `ExceptionResponseFactoryUtil`, `SecurityErrorResponseUtil`), thực hiện bóc tách các lớp bọc phản xạ (`InvocationTargetException`, `UndeclaredThrowableException`), loại bỏ mọi proxy frame (`jdk.proxy*`, `ControllerProxyInvocationHandler`) và ẩn hoàn toàn stack-trace khỏi payload HTTP để ngăn chặn fingerprinting từ AI vulnerability scanner.
   - Phần sửa đổi này bổ sung chặt chẽ cho Rule 21 (cấm trả `throwable.getMessage()` thô trực tiếp cho client khi phát sinh lỗi hệ thống).
3. **Bắt Buộc Truy Vết Từ Gốc `Caused by` Khi Agent Debug & Chạy Test**:
   - Khi thực thi `mvn clean verify`, integration tests hoặc Playwright E2E (`controller-to-api-ui/e2e/marketplace-e2e.spec.ts`) mà phát sinh lỗi, Agent **bắt buộc phải đọc và trích xuất toàn bộ stack-trace xuống tới khung `Caused by` sâu nhất** để xác định nguyên nhân gốc trước khi sửa mã nguồn.
   - Cấm đoán mò, cấm thêm `try-catch` nuốt lỗi, cấm sửa chắp vá bề mặt và cấm gắn `@Disabled` để né test.

---

## 3. TRUY XUẤT NGUỒN GỐC 1:1 (1:1 CODE-TO-DOC TRACEABILITY)

1. **Mọi Thành Phần Mô Tả Phải Tồn Tại Thật**:
   - Tất cả tên class, method, annotation attribute, khóa YAML `*Properties`, cơ chế tối ưu `MethodHandle`/`LambdaMetafactory`/L1 Cache, lớp phòng vệ chống AI scanner/DoS, đường dẫn Swagger và endpoint `/system/studio` được nhắc đến trong `docs/`, `README.md`, `docs/GUIDE_*.md` và `docs/topics/` **bắt buộc phải tồn tại 1:1** trong `controller-to-api-framework/src` và `controller-to-api-implementation/src`.
2. **Loại Bỏ Ngay Tham Chiếu Ảo**:
   - Mọi API không tồn tại, cấu trúc DTO sai lệch hoặc tên file đã tái cấu trúc đều phải được rà soát và hiệu đính khớp tuyệt đối với mã nguồn thực tế trước khi nghiệm thu.

---

## 4. THANH LỌC NỘI DUNG & CẤM LỘ DIỆN 7 GÓC NHÌN (ZERO-BLOAT & SEAMLESS SYNTHESIS)

1. **Văn Phong Kỹ Thuật Thuần Túy (Zero Marketing Hype)**:
   - Loại bỏ 100% tính từ cảm tính (*"mạnh mẽ vượt trội"*, *"dễ dàng sử dụng"*, *"toàn diện"*, *"effortless"*, *"battle-hardened"*, *"hoàn hảo"*, *"siêu tốc"*). Thay bằng thông số kỹ thuật, độ phức tạp thuật toán, hành vi runtime, trade-off kiến trúc và ví dụ code biên dịch được.
2. **Không Chèn Kiến Thức Nền Thừa & Không Định Dạng FAQ / Hỏi - Đáp**:
   - Không giải thích lại khái niệm HTTP/Java cơ bản. Tuyệt đối không dùng tiêu đề dạng câu hỏi (chứa dấu `?`, `Why`, `How`, `Tại sao`, `Vì sao`, `Làm thế nào`, `なぜ`, `为什么`) hoặc mục FAQ trong tài liệu.
3. **Cấm Tuyệt Đối Lộ Nhãn 7 Góc Nhìn Ra Tài Liệu & UI**:
   - Bảy góc nhìn (CTO, Technical Architect, Senior Java Dev, SRE, Giảng viên Back-end, Kỹ sư mới tốt nghiệp, Tân sinh viên CNTT) chỉ được sử dụng làm **tiêu chuẩn kiểm định nội bộ**.
   - Tuyệt đối **KHÔNG** hiển thị tab, banner (như `TopicFocusBanner`), badge, tiêu đề mục hay nhãn chú thích phân loại đối tượng người đọc trên `docs/` hay các tệp Markdown. Mọi nội dung phải hòa trộn liền mạch theo trình tự *Progressive Disclosure*: *Bản chất bài toán & Cơ chế -> Cấu hình tối thiểu -> Ví dụ thực thi đối chiếu -> Phân tích nội tại (`MethodHandle`, O(1) Cache, Thread-safety) -> Anti-patterns & Production Guardrails*.
4. **Hỗ Trợ Đầy Đủ 20 Ngôn Ngữ & RTL**:
   - Tài liệu web (`docs/`) và tài liệu cấu hình `/system/studio` phải đồng bộ 20 mã ngôn ngữ (`ar`, `bn`, `de`, `en`, `es`, `fa`, `fr`, `hi`, `id`, `it`, `ja`, `ko`, `pl`, `pt`, `ru`, `th`, `tr`, `ur`, `vi`, `zh`), tự động kích hoạt `dir="rtl"` cho `ar`, `fa`, `ur`.
5. **Bắt Buộc Gọi 7 Sub-Agent Đánh Giá Độc Lập (Framework Code -> Document)**:
   - Bổ trợ cho nguyên tắc cấm lộ nhãn ở mục (3) bên trên: mọi đợt cập nhật mã nguồn Framework (`controller-to-api-framework/`), ứng dụng triển khai (`controller-to-api-implementation/`), `ai-agent-kit/` hoặc cổng tài liệu (`docs/`, `README.md`, `docs/GUIDE_*.md`, `docs/topics/`) **BẮT BUỘC** phải chạy **7 Sub-Agent độc lập** (CTO/OSS Maintainer, Principal Technical Architect, Senior Java & Spring Engineer, System Engineer/SRE/AppSec/QA, Giảng viên Back-end/Tech Writer, Kỹ sư mới tốt nghiệp DX, Tân sinh viên CNTT & Kiểm toán 20 ngôn ngữ/UI-UX) để đối chiếu chéo 1:1 từ mã nguồn Framework đến tài liệu và khắc phục toàn bộ lỗi P0/P1 trước khi nghiệm thu/phát hành.

---

## 5. CHÍNH SÁCH PHIÊN BẢN NGHIÊM NGẶT `0.1.xxx` (STRICT `0.1.x` PATCH-ONLY VERSION POLICY)

1. **Chỉ Cho Phép Nâng Patch `0.1.xxx` — Cấm Tự Ý Lên `0.2.x`**:
   - Phiên bản phát hành hiện hành của `io.github.natswarchuan:spring-nwvmc` là **`0.1.0`** (`pom.xml` & tag `v0.1.0`).
   - Mỗi lần cập nhật Framework, Agent **CHỈ ĐƯỢC PHÉP** tăng số patch trong nhánh **`0.1.xxx`** (`0.1.0` -> `0.1.1` -> `0.1.2` -> ...).
   - **TUYỆT ĐỐI CẤM** tự ý nâng phiên bản lên **`0.2.x`** hoặc **`1.0.x`** trên mọi tệp cấu hình, mã nguồn, tài liệu và kiểm thử (`pom.xml`, constants, `Navbar.tsx`, `docs/package.json`, `CHANGELOG.md`, `README.md`, `docs/GUIDE_*.md`, `docs/topics/`, Javadoc `@version`) nếu chưa có sự cho phép tường minh từ Người dùng.

---

## 6. GIAO DIỆN DOCS THUẦN TEXT & ZERO MIXED-LANGUAGE LEAKS (20 NGÔN NGỮ)

1. **Pure-Text Header & Sidebar (`docs/`)**:
   - Tuyệt đối không hiển thị pill badge / tag dư thừa cạnh logo trên `Navbar` (chỉ dùng text thuần `Spring-NWVMC 0.1.x`) và tuyệt đối không gắn pill badge bên phải các mục trong `Sidebar`.
   - Độ rộng Sidebar phải đảm bảo menu items hiển thị gọn trên cùng dòng không bị bẻ gãy mất thẩm mỹ và không phát sinh thanh cuộn ngang (`overflow-x`).
2. **Triệt Tiêu 100% Sót Tiếng Anh (Zero Mixed-Language Leaks Across All 20 Locales)**:
   - Tất cả đoạn văn diễn giải, nội dung trong `<Callout>` (cả tiêu đề và body), caption/tab của `CodeBlock`, tiêu đề/nội dung bảng tham số, kết quả tìm kiếm `Cmd+K`, Mục lục (`TOC`) và phân trang phải hiển thị trọn vẹn theo đúng ngôn ngữ đã chọn trên cả 20 locale.
   - Chỉ giữ nguyên tên class, annotation (`@AutoRestController`, `@EntitySecurity`, `@SecurityRoleEntity`, ...), khóa YAML, lệnh CLI và HTTP status codes.

---

## 7. PHÂN QUYỀN ĐỘNG DATABASE QUA ANNOTATION & MỞ RỘNG CHUẨN SPRING SECURITY

1. **Hệ Thống Annotation RBAC Động Gắn Trên Entity**:
   - Cung cấp bộ annotation thuần Java (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity`, `@RoleCode`, `@RoleName`, `@RolePermissions`, `@PermissionCode`, `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`, `@UserRoleSubject`, `@UserRoleCode`, `@UserRoleTenantId`, `@PolicyResource`, `@PolicyAction`, `@PolicyAllowedRoles`, `@PolicyEffect`).
   - Quét bằng `MethodHandle`, nạp `SecurityGrantedAuthority` động từ DB, cache L1 hiệu năng cao qua `CacheEngineFactoryHelper` và tự động làm mới ngay khi dữ liệu Role/Permission/UserRole thay đổi (`DatabaseRbacChangedEvent`).
2. **Khả Năng Customize Chuẩn Spring Security (Zero Lock-In)**:
   - Cho phép nhà phát triển đăng ký hoặc mở rộng `SecurityFilterChain`, `HttpSecurity` DSL qua `SecurityIdentityCustomizer`, tùy biến `UserDetailsService` / `JwtAuthenticationConverter` / `PermissionEvaluator` / `AuthorizationManager`, và dùng song song `@PreAuthorize` / `@PostAuthorize` chuẩn Spring Security mà không xung đột Bean hoặc Filter Chain.

---

## 8. MAXIMUM DEVELOPER EXPERIENCE (DX) & META-ANNOTATIONS

1. **Composed Meta-Annotations Đa Tầng**:
   - `AnnotationReflectionUtil` bắt buộc hỗ trợ phân giải đệ quy Meta-Annotation nhiều tầng (có chống vòng lặp), cho phép dev gộp nhiều annotation của framework thành annotation domain riêng.
2. **Fail-Fast Diagnostics Với Thông Điệp `[Root Cause] -> [Class/Field] -> [Fix]`**:
   - Mở rộng chẩn đoán startup kiểm tra `@EntitySecurity`, `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@CustomQuery`, `@ComputedField`, `@HumanPolicy`, `@MultiTenant`, quan hệ vòng `CyclicSubResourceException`, kèm gợi ý sửa lỗi cụ thể và khóa i18n đồng bộ cho cả 21 bundles `i18n/messages*.properties`.
