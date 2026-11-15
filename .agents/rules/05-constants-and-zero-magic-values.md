# Rule 05: Quản Lý Hằng Số (Constants) & Triệt Tiêu 100% Magic Number / Magic String

Quy chuẩn này quy định tuyệt đối về việc quản lý tập trung toàn bộ giá trị kiểu `String` và `Number` trong hệ thống, triệt tiêu 100% Magic String và Magic Number (kể cả trong các câu lệnh log).

---

## 1. NGUYÊN TẮC TIÊN QUYẾT: ZERO MAGIC NUMBER & ZERO MAGIC STRING

> **NGUYÊN TẮC TUYỆT ĐỐI**:
> 1. **CẤM TUYỆT ĐỐI sinh ra Magic Number hoặc Magic String** ở bất kỳ dòng mã nào trong hệ thống.
> 2. Mọi giá trị kiểu `String` (chuỗi ký tự, ký hiệu phân cách, định dạng ngày tháng, header, token prefix, regex, message, status, role code, scope code, default UUID) và kiểu `Number` (int, long, double, float, BigDecimal - ví dụ: 0, 1, 10, 20, 100, TTL seconds, timeout, retry count, page size, status code) **BẮT BUỘC 100% PHẢI ĐƯỢC KHAI BÁO THÀNH HẰNG SỐ TRONG LỚP CONSTANT TƯƠNG ỨNG**.
> 3. **ÁP DỤNG NGHIÊM NGẶT CHO CẢ THÔNG ĐIỆP LOG**: Tuyệt đối không viết String literal trực tiếp trong các câu lệnh `log.info(...)`, `log.warn(...)`, `log.error(...)`, `log.debug(...)`. Mọi mẫu chuỗi log (log template) bắt buộc phải trích xuất vào lớp `LogConstant` (dùng chung) hoặc `*LogConstant` (theo từng domain/module).
> 4. **CẤM TUYỆT ĐỐI**: Khai báo `public/private static final` ở bất kỳ đâu ngoài các lớp Constant (ngoại lệ duy nhất: Logger do `@Slf4j` tự động sinh mã bytecode và `serialVersionUID` nếu implement `Serializable`).
> 5. **BẮT BUỘC 100% PHẢI CÓ JAVADOC TRÊN TỪNG HẰNG SỐ**: Mọi constant (`public static final`) bắt buộc phải có JavaDoc (`/** ... */`) mô tả rõ ràng ý nghĩa nghiệp vụ, cấu trúc định dạng (đặc biệt là Regex patterns), ví dụ giá trị hợp lệ và mục đích sử dụng để người đọc hiểu ngay bản chất hằng số.
> 6. **CHÍNH SÁCH ZERO HARD-CODE CHI TIẾT (ZERO HARD-CODE POLICY)**:
>    - **Tiền tố / Hậu tố vai trò (Prefix / Suffix)**: CẤM `role.startsWith("B1-")` -> Bắt buộc `role.startsWith(RoleConstant.PREFIX_ROLE_B1)`. CẤM `"Bearer "` -> Bắt buộc `HttpHeaderConstant.BEARER_PREFIX`. CẤM `"+84"` -> Bắt buộc `CountryCodeConstant.DEFAULT_COUNTRY_CODE`.
>    - **Trạng thái & Mã loại (Status & Types)**: CẤM `"ACTIVE"`, `"GRANTED"`, `"STANDARD"`, `"DENIED_*"` -> Bắt buộc trích xuất vào `CommonConstant` hoặc `*StatusConstant`.
>    - **Chuỗi UUID Mặc định**: CẤM `"00000000-0000-7000-8000-000000000000"` -> Bắt buộc `CommonConstant.DEFAULT_SYSTEM_UUID`.
>    - **Thời gian TTL & Số lượng hạn mức**: CẤM `3600L`, `1000L`, `86400L`, `20`, `100` -> Bắt buộc trích xuất vào `DateTimeConstant` hoặc `CommonConstant`.
>    - **Lý do Audit & Thông điệp Thẩm định**: CẤM `"User logout"`, `"Thẩm định thành công..."` -> Bắt buộc khai báo trong `AuditConstant` hoặc `CommonConstant`.

---

## 2. CẤU TRÚC LỚP CONSTANT CHUẨN MỰC

- Đặt trong package `common.constant` (hoặc module-specific `constant` cho các hằng số nghiệp vụ cục bộ).
- Khai báo là **`public final class`**.
- Constructor duy nhất là **`private`** và ném ngoại lệ `UnsupportedOperationException("This is a constant class and cannot be instantiated");`.
- Tên lớp có hậu tố `Constant` (ví dụ: `CommonConstant`, `LogConstant`, `UserLogConstant`, `DateTimeConstant`, `HttpHeaderConstant`, `ErrorConstant`).
- Toàn bộ trường là **`public static final`** và tuân thủ chuẩn đặt tên **`UPPER_SNAKE_CASE`**.

---

## 3. CÁC PHÂN NHÓM CONSTANT BẮT BUỘC

### 3.1. Hằng Số Dùng Chung & Số Học Cơ Bản (`CommonConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp các hằng số dùng chung và số học cơ bản toàn hệ thống.
 */
public final class CommonConstant {

  private CommonConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  // Chuỗi & Ký Tự Cơ Bản
  public static final String EMPTY_STRING = "";
  public static final String SPACE = " ";
  public static final String COMMA = ",";
  public static final String DOT = ".";
  public static final String SLASH = "/";
  public static final String HYPHEN = "-";
  public static final String UNDERSCORE = "_";
  public static final String COLON = ":";
  public static final String SEMICOLON = ";";
  public static final String SYSTEM_USER = "SYSTEM";
  public static final String KEY_TRACE_ID = "traceId";

  // Số Học Cơ Bản & Phân Trang (Triệt Tiêu Magic Number)
  public static final int ZERO = 0;
  public static final int ONE = 1;
  public static final int MINUS_ONE = -1;
  public static final int DEFAULT_PAGE_NUMBER = 0;
  public static final int DEFAULT_PAGE_SIZE = 20;
  public static final int MAX_PAGE_SIZE = 100;
  public static final int PERCENT_DIVISOR = 100;
}
```

### 3.2. Hằng Số Thông Điệp Log Chung (`LogConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp các mẫu chuỗi ghi nhật ký (Log Templates) dùng chung toàn hệ thống.
 */
public final class LogConstant {

  private LogConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  // Mẫu log bắt đầu và kết thúc hàm
  public static final String LOG_START_METHOD = "Starting method: {}";
  public static final String LOG_START_WITH_PARAM = "Starting {} with param: {}";
  public static final String LOG_START_WITH_TWO_PARAMS = "Starting {} with param1: {}, param2: {}";
  public static final String LOG_FINISH_METHOD = "Finished method: {}";
  public static final String LOG_FINISH_WITH_RESULT = "Finished {} with result: {}";

  // Mẫu log cảnh báo và ngoại lệ
  public static final String LOG_WARN_BUSINESS = "Business warning: code={}, message={}";
  public static final String LOG_ERROR_OCCURRED = "Error occurred in method: {}";
  public static final String LOG_ERROR_WITH_DETAIL = "Error occurred: message={}, cause={}";
  public static final String LOG_ERROR_WITH_EXCEPTION = "Error in {}: message={}, exception={}";
  public static final String LOG_UNEXPECTED_EXCEPTION = "Unexpected system exception caught";
  public static final String LOG_VALIDATION_ERROR = "Validation error occurred: {}";

  // Mẫu log hiệu năng & cache
  public static final String LOG_CACHE_HIT = "Cache hit for key: {}";
  public static final String LOG_CACHE_MISS = "Cache miss for key: {}, querying database";
  public static final String LOG_CACHE_EVICT = "Cache evicted for key: {}";
}
```

### 3.3. Hằng Số HTTP Header & Giao Thức (`HttpHeaderConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp các hằng số HTTP Headers và giao thức truyền tải.
 */
public final class HttpHeaderConstant {

  private HttpHeaderConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String HEADER_X_REQUEST_ID = "X-Request-ID";
  public static final String HEADER_AUTHORIZATION = "Authorization";
  public static final String HEADER_ACCEPT = "Accept";
  public static final String HEADER_TRACE_ID = "X-Trace-ID";
  public static final String BEARER_PREFIX = "Bearer ";
}
```

### 3.4. Hằng Số Thời Gian (`DateTimeConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp các định dạng chuẩn thời gian và múi giờ.
 */
public final class DateTimeConstant {

  private DateTimeConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String PATTERN_ISO_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
  public static final String PATTERN_DATE = "yyyy-MM-dd";
  public static final String PATTERN_TIME = "HH:mm:ss";
  public static final String TIMEZONE_UTC = "UTC";
  public static final long MILLIS_PER_SECOND = 1000L;
  public static final int SECONDS_PER_MINUTE = 60;
}
```
