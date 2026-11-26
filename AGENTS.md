# AGENTS.md - Java Spring Boot Enterprise Agent Directives

Tài liệu này xác lập hành vi bắt buộc cho mọi AI Agent hoạt động trong workspace này.

## AGENT BEHAVIOR PROTOCOL

### 1. Mandatory Pre-Execution Declaration (Gọi Rule & Style trước khi code)
Trước khi tạo mới hoặc sửa đổi bất kỳ tệp mã nguồn Java nào, Agent **BẮT BUỘC** phải phát biểu xác nhận:
1. Xác định quy chuẩn Java Google Style, quy tắc SOLID, chuẩn Layer SRP và các ràng buộc cú pháp đang được áp dụng.
2. Kiểm tra vai trò kiến trúc:
   - **Controller CHỈ ĐÓNG VAI TRÒ ĐIỀU PHỐI VIÊN (Coordinator/Dispatcher)**: Tiếp nhận HTTP, kích hoạt `@Valid`, ủy quyền cho Service Interface và bọc `ApiResponse`. Tuyệt đối không chứa logic nghiệp vụ, không rẽ nhánh `if/else`, không tiêm Repository/Entity.
   - **Mỗi tầng đảm nhiệm duy nhất 1 vai trò (Strict Layer SRP)**.
3. Kiểm tra danh sách cấm kỵ:
   - **KHÔNG sử dụng các Exception class có sẵn của Java/Spring trong nghiệp vụ** (100% phải dùng Custom Exception kế thừa `BaseBusinessException` mang `HttpStatus` và `errorCode`).
   - **KHÔNG tự code lại các giải pháp đã có thư viện chuẩn kiểm chứng** (ưu tiên dùng MapStruct, Caffeine, Redis, `uuid-creator`, Commons, Resilience4j).
   - **KHÔNG dùng `abstract class` trong mọi trường hợp** (bắt buộc dùng `interface` kết hợp phương thức `default`).
   - **KHÔNG ĐƯỢC PHÉP CÓ PRIVATE FUNCTION trong mọi trường hợp** (100% phương thức là `public`; phân rã logic bằng cách tách lớp Helper/Util mới).
   - **KHÔNG ĐƯỢC PHÉP TỒN TẠI CLASS, INTERFACE, ENUM, RECORD HOẶC ANONYMOUS CLASS TRONG 1 CLASS CHA** (áp dụng cho cả `src/main/java` và `src/test/java`; mỗi file `.java` chỉ chứa duy nhất 1 top-level class/interface, bắt buộc tách mọi inner class, test fixture class, callback implementation ra file `.java` độc lập).
   - **QUY TẮC TUYỆT ĐỐI VỀ UTIL VÀ HELPER**:
     - **`Util` (`*Util.java`, đặt trong folder `util/`)**: Bắt buộc là `public final class`, chỉ chứa **100% `public static` function** và **1 `private` constructor** (ném `UnsupportedOperationException(CommonConstant.MSG_UTILITY_CLASS)`). Tuyệt đối không chứa instance method, không gắn `@Component`/`@AutoComponent`.
     - **`Helper` (`*Helper.java`, đặt trong folder `helper/`)**: Bắt buộc là `public final class`, đánh dấu `@Component` / `@AutoComponent`, tiêm phụ thuộc qua `@RequiredArgsConstructor`. Tuyệt đối **KHÔNG chứa bất kỳ từ khóa `static` nào** (không `static` method, không `static` field ngoài `@Slf4j`) và **KHÔNG được phép có `private` function** (100% là `public` instance method). Tuyệt đối cấm đặt tên `*Helper` cho lớp chứa hàm `static`.
   - **QUY TẮC ĐỒNG BỘ HẬU TỐ FILE (SUFFIX) VÀ THƯ MỤC (FOLDER/PACKAGE)**: Cấu trúc các file `.java` bắt buộc phải đặt khớp tuyệt đối giữa hậu tố tên file và thư mục chứa nó (`*Util.java` -> `util/`, `*Helper.java` -> `helper/`, `*Constant.java` -> `constant/`, `*Config.java` -> `config/`, `*Properties.java` -> `properties/`, `*Controller.java` -> `controller/`, `*Service.java` -> `service/`, `*ServiceImpl.java` -> `service/impl/`, `*Dto.java` -> `dto/`, `*Entity.java` -> `entity/`, `*Exception.java` -> `exception/`, `*Filter.java` -> `filter/`, `*Aspect.java` -> `aspect/` hoặc `aop/`, `*Handler.java` -> `handler/`, `*Listener.java` -> `listener/`, `*Provider.java` -> `provider/`, `*Resolver.java` -> `resolver/`, `*Validator.java` -> `validator/`, `*Customizer.java` -> `customizer/`, `*Bridge.java` -> `bridge/`).
   - **KHÔNG dùng `UUID.randomUUID()` / UUIDv4** (luôn sử dụng **UUIDv7** qua `UuidUtil.generateUuidV7()`).
   - **KHÔNG dùng toán tử 3 ngôi (`? :`)**.
   - **KHÔNG dùng nested if (if lồng nhau) - chỉ dùng flat guard clauses**.
   - **KHÔNG ghép nhiều hơn 1 điều kiện (`&&` hoặc `||`) trong 1 `if`**.
   - **KHÔNG dùng kiểu `Object`, `var`, hoặc `Map<String, Object>`**.
   - **KHÔNG so sánh trực tiếp `== null` hoặc `!= null` (dùng `Objects` library)**.
   - **KHÔNG khai báo `static final` ngoài lớp Constant**.
   - **KHÔNG dùng `@Data` trên JPA Entity**.
   - **TRIỆT TIÊU 100% MAGIC NUMBER, MAGIC STRING & HARD-CODE (ZERO HARD-CODE POLICY)**: CẤM TUYỆT ĐỐI hard-code bất kỳ chuỗi literal hoặc số literal nào trong code (bao gồm: tên method/field khi gọi Reflection `getMethod(...)`/`getDeclaredField(...)`, tên Bean, thông điệp log, prefix/suffix vai trò như `"B1-"`, `"Bearer "`, `"+84"`; chuỗi trạng thái/loại như `"ACTIVE"`, `"GRANTED"`, `"STANDARD"`, `"DENIED_*"`; default UUID như `"00000000-0000-7000-8000-000000000000"`; số lượng thời gian TTL `3600L`, loyalty points `1000L`, paging limits, retry counts; lý do audit; so sánh chuỗi literal trong if như `role.startsWith(...)`). 100% String và Number bắt buộc phải được khai báo thành hằng số trong các file `*Constant` tương ứng (`CommonConstant`, `BridgeConstant`, `RoleConstant`, `ScopeConstant`, `ObjectConstant`, `LogConstant`,...) trong thư mục `constant/` kèm Javadoc đầy đủ.
   - **SERVICE CHỈ TRIỂN KHAI PHƯƠNG THỨC `@Override` TỪ SERVICE INTERFACE (INTERFACE-ONLY SERVICE METHODS)**: Trong lớp Service Implementation (`*ServiceImpl`), 100% phương thức khai báo BẮT BUỘC phải là phương thức được đánh dấu `@Override` từ Service Interface tương ứng. Tuyệt đối CẤM khai báo bất kỳ phương thức phụ trợ nào (kể cả phương thức `public`) bên trong lớp ServiceImpl. Toàn bộ logic phân rã, nghiệp vụ con, validation phụ trợ, tra cứu dữ liệu phụ hoặc mapping trung gian BẮT BUỘC PHẢI DI CHUYỂN sang các lớp `Helper` độc lập mới (`final class`, `@Component`, tiêm qua DI).
   - **KHÔNG vi phạm ngưỡng SonarQube khắt khe & Luôn fix dù là mức thấp nhất**: Phương thức tối đa 30 - 40 dòng, Lớp tối đa 200 - 300 dòng, Tham số tối đa 3, Cognitive Complexity <= 8, Cyclomatic <= 8; 100% sạch cảnh báo từ Blocker, Critical, Major, Minor đến Info.
4. **Bắt buộc phân tích đánh giá Cache**: Đánh giá tỷ lệ Read/Write, chi phí tính toán để quyết định có nên dùng Cache (Caffeine/Redis) hay không.
5. **Đảm bảo tối ưu hiệu năng & SQL Big Data**: Triệt tiêu N+1 query bằng cách luôn ưu tiên Eager-load hơn Lazy-load (sử dụng `@EntityGraph`/`JOIN FETCH`, DTO projections), phân trang Keyset Pagination O(1) cho Big Data, batch processing, tối ưu collection allocation.
6. Đảm bảo bảo vệ dữ liệu bằng Transaction: `@Transactional(readOnly = true)` cấp class và `@Transactional(rollbackFor = Exception.class)` cho các thao tác ghi.
7. Đảm bảo mọi Custom Exception đều gắn với `HttpStatus` cụ thể.
8. Đảm bảo mọi chuyển đổi DTO/Model/Entity/Request/Response đều có `toXXX` và `fromXXX` sử dụng Builder Pattern.
9. Đảm bảo ghi log đầy đủ bắt đầu và kết thúc ở mỗi function sử dụng **hằng số thông điệp log** (`LogConstant` / `*LogConstant`), tuyệt đối không viết String literal; duy trì cơ chế Trace Request ID (`X-Request-ID` qua MDC sử dụng UUIDv7).
10. **Bao phủ 100% lỗi Servlet Container & Tomcat ngoại vi Spring**: Triệt tiêu Whitelabel page, bẫy lỗi Filter qua `ServletFilterExceptionHandler`, chuẩn hóa lỗi 400/404/405/413/431/500 qua `CustomContainerErrorController` trả về `ApiResponse<Void>`.
11. **Luôn ưu tiên tạo Global Config trước khi tạo Util**: Tận dụng triệt để cấu hình tập trung của Spring Framework (`JacksonConfig` định dạng ISO-8601 UTC, Bean `ObjectMapper` DI, `WebMvcConfigurer`, `AsyncConfig`, `CacheConfig`) thay vì viết các class Util tĩnh rải rác.
12. **Mỗi hàm viết ra bắt buộc phải có Unit Test tương ứng & test/fix đến khi pass**: Viết Unit Test (JUnit 5, Mockito, AssertJ) cho từng phương thức mới/sửa đổi, bao phủ Happy Path, Negative Path và Guard Clauses; thực thi kiểm thử và sửa lỗi cho đến khi 100% test pass.
13. **Luôn đáp ứng Real-time & Chịu tải công suất cao**: Kích hoạt Virtual Threads Java 21, tối ưu hóa HikariCP Connection Pool, quản lý vòng đời kết nối `SseEmitter`/WebSocket chống rò rỉ bộ nhớ, bảo vệ hệ thống bằng Resilience4j (Rate Limiting, Circuit Breaker).
14. **Tối ưu hóa 100% SQL cho Big Data & Luôn ưu tiên Eager-load hơn Lazy-load**: Cấm Full Table Scan, dùng DTO Projection chỉ lấy cột cần thiết, áp dụng Keyset Pagination thay cho OFFSET; nạp dữ liệu chủ động qua Eager-loading (@EntityGraph / JOIN FETCH) triệt tiêu hoàn toàn thảm họa N+1 queries.
15. **Tài liệu hóa Swagger & OpenAPI 3.0 toàn diện & Ẩn endpoint không dùng**: 100% Endpoint và DTO được mô tả chi tiết bằng `@Tag`, `@Operation`, `@ApiResponses`, `@Parameter`, `@Schema` (mô tả, format, realistic example, requiredMode; 100% trích xuất từ `OpenApiConstant`); bắt buộc dùng `@Hidden` ẩn các endpoint nội bộ/kỹ thuật không thể dùng qua Swagger UI.
16. **Hàm đơn nhiệm, lớp đơn trách nhiệm & tên tự mô tả bản thân**: 1 hàm chỉ làm đúng 1 việc nguyên tử duy nhất (không side effects); 1 lớp chỉ mang đúng 1 ý nghĩa duy nhất (1 lý do để thay đổi, cấm tạo God Class/Manager); Tên package + tên lớp + tên hàm kết hợp phải tự mô tả 100% mục đích và hành vi mà không cần đọc comment mới hiểu (cấm tên hàm mơ hồ như `process()`, `handle()`, `execute()`).
17. **Kiến trúc mô-đun & sẵn sàng tách Microservices**: Phân chia theo Bounded Contexts; CẤM JOIN SQL chéo giữa các bảng thuộc domain độc lập; giữa các domain chỉ lưu khóa ngoại logic UUIDv7; giao tiếp liên module bằng Domain Events hoặc Public Contract DTOs; đảm bảo việc nâng cấp/bảo trì bên trong 1 module có vùng ảnh hưởng cô lập hoàn toàn (Zero Blast Radius, impact = 0 sang các module khác).
18. **Service Implementation chỉ chứa phương thức Override**: 100% method trong `*ServiceImpl` phải có `@Override` từ Service Interface, phân tách toàn bộ helper logic sang `@Component` Helper độc lập.
19. **Ưu tiên tuyệt đối Builder Pattern thay vì Setter (Builder Over Setter Principle)**: Khi khởi tạo hoặc cập nhật đối tượng (Entity, DTO, Request, Response, Model), 100% bắt buộc dùng Builder Pattern (`.builder()...build()`, `@Builder(toBuilder = true)`). Hạn chế tối đa dùng `@Setter` và gọi các hàm setter rời rạc `setX()`, `setY()` để bảo đảm tính bất biến (Immutability), mã nguồn mạch lạc và an toàn luồng.
20. **Bắt Buộc Kiểm Thử Hiệu Năng Bằng Apache JMeter (Mandatory JMeter Performance Testing)**: Bắt buộc 100% các API, luồng nghiệp vụ và tính năng sau khi triển khai hoặc tối ưu phải được kiểm thử hiệu năng/chịu tải bằng Apache JMeter (`jmeter-maven-plugin` qua lệnh `mvn jmeter:jmeter jmeter:results`). Bắt buộc đạt tỷ lệ lỗi **0.0% Error Rate** dưới tải cao và sinh báo cáo HTML chi tiết (`target/jmeter/reports`). Tuyệt đối CẤM bàn giao code mà chưa chạy và kiểm chứng qua JMeter.
21. **Đồng Bộ Hóa Tài Liệu Khi Cập Nhật Framework (Mandatory Documentation Synchronization)**: Khi cập nhật hoặc sửa đổi Framework (thêm annotation, dynamic endpoint, cấu hình, logic xử lý, thay đổi version), Agent BẮT BUỘC phải rà soát và cập nhật đồng bộ toàn bộ hệ thống tài liệu kỹ thuật có ảnh hưởng (`README.md`, cổng tài liệu `docs/index.html`, các tệp hướng dẫn đa ngôn ngữ `docs/GUIDE_*.md`, báo cáo nghiệm thu `audit_and_acceptance_report.md`). Tuyệt đối CẤM để tài liệu bị lỗi thời (stale documentation) hoặc không phản ánh đúng mã nguồn thực tế.
22. **Bắt Buộc Gọi Stitch MCP Khi Thiết Kế Giao Diện (Mandatory Stitch MCP UI Design Protocol)**: Mỗi khi tạo mới, chỉnh sửa hoặc thiết kế lại giao diện người dùng (UI/UX, màn hình, layout, bảng màu, Typography, Component, Theme Sáng/Tối hay Responsive), Agent **BẮT BUỘC** phải gọi hệ thống **Stitch MCP** (`update_design_system`, `generate_screen_from_text`, `edit_screens`, `download_file`) để sinh và kiểm chứng thiết kế trực quan trước khi viết mã giao diện/CSS. Tuyệt đối CẤM tự phán đoán hay tự ý bịa bố cục/màu sắc mà không thông qua Stitch MCP.

### 2. Kích Hoạt Kỹ Năng Theo Tình Huống Cụ Thể (Skills By Use Case)
Agent phải tự động tra cứu và kích hoạt Skill tương ứng theo từng kịch bản nghiệp vụ:
- Khi tạo API / Controller (vai trò điều phối viên) / Request / Response / Swagger OpenAPI -> Dùng Skill `spring-boot-controller-layer`.
- Khi triển khai Logic Nghiệp Vụ / Service Interface / DI / Transaction -> Dùng Skill `spring-boot-service-layer`.
- Khi thiết kế Entity / Repository / Database / UUIDv7 Primary Key -> Dùng Skill `spring-boot-data-persistence`.
- Khi phân tích Caching / Tối ưu hiệu năng / Chống N+1 query -> Dùng Skill `spring-boot-caching-and-performance`.
- Khi xử lý lỗi / Custom Exception theo HttpStatus / Global Handler -> Dùng Skill `spring-boot-exception-handling`.
- Khi chuyển đổi dữ liệu DTO / Entity / Mapper bằng toXXX và fromXXX -> Dùng Skill `spring-boot-mapper-converter`.
- Khi thiết lập Hạ Tầng Logging / Trace Request ID bằng UUIDv7 / Ghi log đầu cuối -> Dùng Skill `spring-boot-logging-and-tracing`.
- Khi viết Utility hoặc Helper -> Dùng Skill `spring-boot-util-and-helper`.
- Khi cấu hình Đa Ngôn Ngữ (i18n) / Đa Database / Đa Framework -> Dùng Skill `spring-boot-i18n-multidb`.
- Khi tạo/sửa thuộc tính cấu hình application.yml (chống warning IDE) -> Dùng Skill `spring-boot-configuration-props`.
- Khi cấu hình Đa Môi Trường (Profiles local/dev/test/staging/prod) -> Dùng Skill `spring-boot-multi-environment-profiles`.
- Khi thiết kế logic nghiệp vụ cần khả năng tùy biến cao, mô-đun hóa, sẵn sàng tách Microservices (Bounded Contexts, Strategy/Template qua Interface default/Events) -> Dùng Skill `spring-boot-business-customization`.
- Khi Review code / Kiểm tra SonarQube / Coverity -> Dùng Skill `spring-boot-quality-audit`.
- Khi triển khai các chuẩn hệ sinh thái Spring (Spring Security, Spring Validation, Spring AI, Spring RestClient) -> Dùng Skill `spring-boot-spring-ecosystem`.
- Khi viết Unit Test / Chạy kiểm thử / Test & Fix cho từng hàm -> Dùng Skill `spring-boot-unit-testing`.
- Khi thiết kế tính năng Real-time (SSE/WebSocket/STOMP) hoặc tối ưu chịu tải công suất cao (Virtual Threads/Resilience4j) -> Dùng Skill `spring-boot-realtime-and-highload`.

### 3. Check-list tự kiểm tra (Zero-Defect Code Verification)
Trước khi bàn giao code:
- [ ] **Tối ưu SQL Big Data & Luôn ưu tiên Eager-load**: 100% quan hệ cần nạp bằng Eager-load (@EntityGraph/JOIN FETCH), dùng DTO Projection cho danh sách, Keyset pagination cho Big Data, cấm Full Table Scan.
- [ ] **Tài liệu hóa Swagger & OpenAPI 3.0 toàn diện**: 100% Endpoint/DTO có Swagger annotations chi tiết (kèm realistic example, schema từ `OpenApiConstant`), 100% endpoint nội bộ/kỹ thuật không dùng được trên UI đều được đánh dấu `@Hidden`.
- [ ] **Hàm đơn nhiệm, lớp đơn trách nhiệm & tên tự mô tả**: 1 hàm làm đúng 1 việc nguyên tử, 1 lớp mang đúng 1 ý nghĩa duy nhất, tên package + lớp + method tự mô tả 100% bản thân, không dùng tên hàm mơ hồ (`process`, `handle`, `execute`).
- [ ] **Kiến trúc mô-đun & sẵn sàng tách Microservices**: 100% không có SQL JOIN chéo domain, không chia sẻ JPA Entity trực tiếp giữa các Bounded Contexts, giao tiếp qua Domain Events hoặc Public Contract DTOs, vùng tác động cô lập hoàn toàn (Zero Blast Radius).
- [ ] **Service Implementation chỉ chứa phương thức Override**: 100% phương thức khai báo trong `*ServiceImpl` là `@Override` từ Service Interface, cấm khai báo phương thức phụ trợ, chuyển 100% logic phụ sang các lớp `Helper` (`final class`, `@Component`, tiêm qua DI).
- [ ] **Ưu tiên tuyệt đối Builder Pattern thay vì Setter**: Khởi tạo và cập nhật đối tượng (Entity, DTO, Response, Request) qua `.builder()...build()` hoặc `toBuilder()`, triệt tiêu việc gọi các hàm `setX()`, `setY()` rời rạc.
- [ ] **Triệt tiêu 100% Magic Number & Magic String & Hard-code (Zero Hard-code)**: 100% chuỗi và con số (prefix role `"B1-"`, `"Bearer "`, default status `"ACTIVE"`, `"GRANTED"`, default UUID `"00000000-0000-7000-8000-000000000000"`, TTL `3600L`, limits, audit reasons, condition literals) đều trích xuất từ các file `*Constant` tương ứng kèm Javadoc đầy đủ.
- [ ] **Sẵn sàng Real-time & Chịu tải công suất cao**: Kích hoạt Virtual Threads Java 21, đăng ký callback dọn dẹp cho SSE/WebSocket, cấu hình timeout và bảo vệ tải với Resilience4j.
- [ ] **100% Hàm có Unit Test tương ứng & 100% Pass**: Mỗi phương thức viết ra đều có Unit Test (JUnit 5, Mockito, AssertJ), chạy kiểm thử thành công, 0 failure, 0 skipped, không dùng `@Disabled`.
- [ ] **100% Custom Exception nghiệp vụ**: Tuyệt đối không ném `IllegalArgumentException`, `NoSuchElementException`, `RuntimeException`. Mọi lỗi đều có class Custom Exception chuyên biệt.
- [ ] **Kiến trúc đa môi trường qua Spring Profiles**: Cấu hình phân tách rõ ràng qua `application-{profile}.yml`, dùng `ProfileConstant`, không lưu mật khẩu thô trong git.
- [ ] **Đã phân tích đánh giá Cache**: Cân nhắc tỷ lệ Read/Write và cấu hình `@Cacheable` / `@CacheEvict` nếu phù hợp.
- [ ] **Tối ưu hóa hiệu năng**: Không có N+1 query (`@EntityGraph`), có phân trang `Pageable`, dùng MapStruct thay cho reflection.
- [ ] **Ưu tiên thư viện chuẩn đã kiểm chứng**: Không tự viết lại mã hóa, mapper, uuid, cache engine.
- [ ] **Bảo vệ toàn vẹn dữ liệu bằng Transaction**: Đánh dấu `@Transactional(rollbackFor = Exception.class)` cho mọi hàm ghi.
- [ ] **Tuyệt đối KHÔNG có `abstract class`**: 100% sử dụng `interface` kết hợp `default` methods (hoặc concrete class cho Exception/MappedSuperclass).
- [ ] **Luôn sử dụng UUIDv7**: Toàn bộ Entity ID, Trace ID được sinh bằng UUIDv7. Không dùng `UUID.randomUUID()`.
- [ ] **Controller chỉ là điều phối viên**: Không chứa business logic, không gọi Repository/Entity, không rẽ nhánh nghiệp vụ.
- [ ] **Mỗi layer chỉ có đúng 1 vai trò duy nhất (Layer SRP)**.
- [ ] **Ghi log đầy đủ đầu và cuối hàm bằng Hằng số**: Mọi function đều có log bắt đầu và kết thúc sử dụng `LogConstant` / `*LogConstant`.
- [ ] **Cơ chế Trace Request ID**: Tích hợp `TraceIdFilter`, nạp MDC UUIDv7, đính kèm `X-Request-ID` trong Response Header và `ApiResponse`.
- [ ] **Tuyệt đối KHÔNG có `private function`**: 100% phương thức là `public`.
- [ ] **Tuyệt đối KHÔNG có `class`, `interface`, `enum`, `record` hoặc anonymous class bên trong 1 class cha**: Mỗi file `.java` (cả `main` và `test`) chỉ chứa duy nhất 1 top-level class/interface độc lập.
- [ ] **Cấu trúc file khớp 100% giữa hậu tố tên file (Suffix) và thư mục (Folder)**: `*Util.java` trong `util/`, `*Helper.java` trong `helper/`, `*Constant.java` trong `constant/`, `*Config.java` trong `config/`, `*Controller.java` trong `controller/`, `*Service.java` trong `service/`, `*ServiceImpl.java` trong `service/impl/`, `*Dto.java` trong `dto/`, `*Exception.java` trong `exception/`, `*Filter.java` trong `filter/`, `*Aspect.java` trong `aspect/`/`aop/`, `*Handler.java` trong `handler/`, `*Listener.java` trong `listener/`, `*Provider.java` trong `provider/`, `*Resolver.java` trong `resolver/`, `*Validator.java` trong `validator/`, `*Customizer.java` trong `customizer/`, `*Bridge.java` trong `bridge/`.
- [ ] **Không có toán tử 3 ngôi (`? :`)** trong code.
- [ ] **Không có nested if (if lồng nhau)**. Mọi điều kiện biên đều là Flat Guard Clauses.
- [ ] Mọi biểu thức `if` chỉ có tối đa 1 điều kiện (không có `&&` hoặc `||` nối nhiều điều kiện).
- [ ] Không tồn tại `== null` hoặc `!= null`. Mọi thao tác đều qua `java.util.Objects`.
- [ ] Không xuất hiện kiểu `Object`, `var`, hoặc `Map<String, Object>`.
- [ ] **Lớp `Util` (`*Util.java` trong `util/`)**: Là `public final class`, chỉ chứa `public static` function và 1 `private` constructor, tuyệt đối không có instance method.
- [ ] **Lớp `Helper` (`*Helper.java` trong `helper/`)**: Là `public final class`, đánh dấu `@Component` / `@AutoComponent`, không chứa bất kỳ `static` method hay `static` field nào, và không có `private` function.
- [ ] **Kiểm chứng triển khai JitPack End-to-End**: Sau khi push lên GitHub, kiểm chứng build trên JitPack và cấu hình dependency JitPack vào project implementation để xác nhận khả năng tích hợp và vượt qua 100% test từ đầu.
- [ ] Lớp `Service` có đầy đủ `Interface` và `Impl` được tiêm qua DI (`@RequiredArgsConstructor` với `private final`).
- [ ] Không có `public/private static final` ngoài các file `*Constant`.
- [ ] Tuyệt đối không dùng `@Data` trên JPA Entity.
- [ ] Mọi Custom Exception đều có thuộc tính `HttpStatus` và GlobalExceptionHandler trả đúng HTTP Status Code đó.
- [ ] Mọi chuyển đổi giữa Request, DTO, Model, Entity, Response đều có hàm `toXXX` và `fromXXX` sử dụng Builder Pattern (`.builder()...build()`).
- [ ] Mọi thuộc tính cấu hình trong `application.yml` đều được khai báo trong `@ConfigurationProperties` có Javadoc và metadata (Không bị warning trên IDE).
- [ ] Toàn bộ thông điệp người dùng được hỗ trợ đa ngôn ngữ (i18n) qua `MessageHelper` / `messages.properties`.
- [ ] 100% method/class có Java Google Javadoc đầy đủ (`@param`, `@return`, `@throws`).
- [ ] **Độ dài & độ phức tạp SonarQube**: Phương thức <= 30-40 dòng, Lớp <= 200-300 dòng, Tham số <= 3, Cognitive Complexity <= 8, Cyclomatic <= 8.
- [ ] **Khắc phục 100% SonarQube dù ở mức thấp nhất**: 0 Blocker, 0 Critical, 0 Major, 0 Minor, 0 Info (Zero Code Smells, Zero Technical Debt).
- [ ] **An toàn Coverity**: Try-with-resources cho mọi tài nguyên, không nuốt ngoại lệ, không Reverse Null Dereference.
- [ ] **Chuẩn hệ sinh thái Spring & Tối ưu Validation i18n**: Tuân thủ chuẩn Spring Security 6 (SecurityFilterChain stateless); Spring Validation tối ưu hóa đa ngôn ngữ (i18n) qua `ValidationConfig` (`LocalValidatorFactoryBean` + `MessageSource`) và `WebMvcConfigurer.getValidator()`; 100% annotation `message` dùng `{validation...}` từ `ValidationConstant`, triệt tiêu 100% Magic String; Custom Validator độc lập 2 file (không `private function`, không `== null`); Spring AI (ChatClient, VectorStore, BeanOutputConverter), Spring RestClient thay thế RestTemplate.
- [ ] **Bao phủ 100% lỗi Tomcat / Servlet Container**: Tắt Whitelabel page, có `ServletFilterExceptionHandler` bẫy lỗi Filter, có `CustomContainerErrorController` chuẩn hóa lỗi 400/404/405/413/500 thành `ApiResponse` kèm `traceId`.
- [ ] **Ưu tiên Global Config trước khi tạo Util**: Đã kiểm tra và thiết lập cấu hình tập trung ở tầng Spring Framework (`JacksonConfig` ISO-8601 UTC, Bean `ObjectMapper` DI, `WebMvcConfigurer`, `AsyncConfig`) thay vì tạo các class Util tĩnh tùy tiện.
- [ ] **100% Vượt qua kiểm thử hiệu năng Apache JMeter**: Đã thực thi `mvn jmeter:jmeter jmeter:results`, đạt **0.0% Error Rate** (Zero Failures), đáp ứng SLA tải đồng thời cho toàn bộ các endpoint trọng yếu và đã sinh báo cáo HTML trực quan trong `target/jmeter/reports/*/index.html`.
- [ ] **Đồng bộ hóa tài liệu khi cập nhật Framework**: Đã rà soát và cập nhật toàn bộ tài liệu kỹ thuật (`README.md`, `docs/index.html`, `docs/GUIDE_*.md`, `audit_and_acceptance_report.md`) nếu có thay đổi hoặc ảnh hưởng từ việc cập nhật Framework; đảm bảo 100% tài liệu phản ánh chính xác cấu trúc API, annotations, tính năng và phiên bản thực tế.
- [ ] **Đã gọi Stitch MCP khi thiết kế giao diện**: Mọi tác vụ tạo mới, nâng cấp hoặc thiết kế lại UI/UX (màn hình, theme, token màu, bố cục, component) đều đã gọi Stitch MCP để sinh/cập nhật Design System & Screen tham chiếu trước khi triển khai mã nguồn.


