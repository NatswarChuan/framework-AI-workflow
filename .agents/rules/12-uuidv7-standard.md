# Rule 12: Chuẩn Định Danh Tuần Tự UUIDv7 (RFC 9562)

Mọi mã định danh duy nhất (Primary Key của Entity, Trace Request ID, Transaction Reference, Mã giao dịch) trong hệ thống **BẮT BUỘC PHẢI SỬ DỤNG UUIDv7**.

---

## 1. TẠI SAO BẮT BUỘC DÙNG UUIDv7 VÀ CẤM UUIDv4 (`UUID.randomUUID()`)?

| Tiêu chí | UUIDv4 (`UUID.randomUUID()`) - **BỊ CẤM** | UUIDv7 (RFC 9562) - **BẮT BUỘC** |
| :--- | :--- | :--- |
| **Tính sắp xếp (Ordering)** | Hoàn toàn ngẫu nhiên (Non-sequential). | **Sắp xếp tự nhiên theo thời gian (Time-ordered, K-sortable)**. |
| **Hiệu năng B-Tree Index (DB)** | **RẤT KÉM**: Gây phân mảnh chỉ mục (Index Fragmentation) và page-splits liên tục, làm chậm 40-70% tốc độ ghi khi bảng lớn. | **TỐI ƯU TUYỆT ĐỐI**: Chèn tuần tự vào cuối B-Tree tương tự như Auto-Increment ID, duy trì kích thước index gọn gàng. |
| **Truy vết (Tracing/Logging)** | Không biết được log nào sinh ra trước nếu không đọc thêm timestamp. | **Tự mang timestamp (Milisecond precision)** ở 48-bit đầu, sắp xếp log tự nhiên theo thứ tự phát sinh. |
| **Bảo mật & Phân tán** | Tốt. | Tốt, chống tấn công dự đoán tuần tự (Enumeration Attacks) và an toàn trên môi trường phân tán. |

---

## 2. QUY CHUẨN LỚP TIỆN ÍCH `UuidUtil` (CHUẨN UTIL DOANH NGHIỆP)

Tuân thủ nghiêm ngặt quy tắc lớp Util: `public final class`, private constructor, 100% `public static` methods, không trạng thái và phòng chống hoàn toàn xung đột số ngẫu nhiên.

```java
package com.enterprise.app.common.util;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/**
 * Tiện ích khởi tạo mã định danh duy nhất theo chuẩn UUIDv7 (RFC 9562).
 *
 * <p>UUIDv7 kết hợp 48-bit Unix timestamp tính theo mili-giây với 74-bit số ngẫu nhiên
 * an toàn mật mã, đảm bảo tính sắp xếp tự nhiên theo thời gian và tương thích B-Tree.
 */
public final class UuidUtil {

  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  /**
   * Private constructor ngăn việc tạo thể hiện của lớp tiện ích.
   */
  private UuidUtil() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  /**
   * Khởi tạo đối tượng {@link UUID} phiên bản 7 (UUIDv7) tại thời điểm hiện tại.
   *
   * @return {@link UUID} phiên bản 7 có thứ tự thời gian
   */
  public static UUID generateUuidV7() {
    return generateUuidV7(Instant.now().toEpochMilli());
  }

  /**
   * Khởi tạo chuỗi UUIDv7 định dạng chuẩn 36 ký tự.
   *
   * @return chuỗi biểu diễn UUIDv7
   */
  public static String generateUuidV7String() {
    return generateUuidV7().toString();
  }

  /**
   * Khởi tạo UUIDv7 dựa trên một mốc thời gian Unix timestamp (mili-giây) cụ thể.
   *
   * @param epochMillis mốc thời gian Unix tính bằng mili-giây
   * @return đối tượng {@link UUID} phiên bản 7
   */
  public static UUID generateUuidV7(final long epochMillis) {
    final byte[] value = new byte[16];
    SECURE_RANDOM.nextBytes(value);

    // 48-bit timestamp
    value[0] = (byte) ((epochMillis >>> 40) & 0xFF);
    value[1] = (byte) ((epochMillis >>> 32) & 0xFF);
    value[2] = (byte) ((epochMillis >>> 24) & 0xFF);
    value[3] = (byte) ((epochMillis >>> 16) & 0xFF);
    value[4] = (byte) ((epochMillis >>> 8) & 0xFF);
    value[5] = (byte) (epochMillis & 0xFF);

    // Version 7: 0111 vào 4-bit đầu của byte 6
    value[6] = (byte) ((value[6] & 0x0F) | 0x70);

    // Variant RFC 4122/9562: 10 vào 2-bit đầu của byte 8
    value[8] = (byte) ((value[8] & 0x3F) | 0x80);

    long msb = 0;
    long lsb = 0;
    for (int i = 0; i < 8; i++) {
      msb = (msb << 8) | (value[i] & 0xFF);
    }
    for (int i = 8; i < 16; i++) {
      lsb = (lsb << 8) | (value[i] & 0xFF);
    }

    return new UUID(msb, lsb);
  }
}
```

---

## 3. KHUYẾN NGHỊ THƯ VIỆN BỔ TRỢ CHUẨN

Ngoài việc sử dụng `UuidUtil` tự sinh, dự án có thể khai báo thư viện chuẩn công nghiệp được tối ưu SIMD:
```xml
<!-- Maven -->
<dependency>
  <groupId>com.github.f4b6a3</groupId>
  <artifactId>uuid-creator</artifactId>
  <version>6.0.0</version>
</dependency>
```
Sử dụng:
`UuidCreator.getTimeOrderedEpoch()` (sinh UUIDv7).

---

## 4. CÁC ĐỊA ĐIỂM BẮT BUỘC DÙNG UUIDv7

1. **Khởi tạo Trace Request ID trong `TraceIdFilter`**:
   ```java
   String traceId = UuidUtil.generateUuidV7String();
   ```
2. **Khởi tạo Khóa Chính (Primary Key) Entity**:
   ```java
   @PrePersist
   public void prePersist() {
     if (Objects.isNull(this.id)) {
       this.id = UuidUtil.generateUuidV7();
     }
   }
   ```
3. **Mã giao dịch / Mã hóa đơn / Token JTI**: Luôn dùng UUIDv7 để có thể sắp xếp và đối soát nhanh theo thời gian phát sinh.
