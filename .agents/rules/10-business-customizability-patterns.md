# Rule 10: Mẫu Thiết Kế Tùy Biến Nghiệp Vụ Linh Hoạt (High Business Customizability)

Một hệ thống phần mềm doanh nghiệp chất lượng cao phải đảm bảo nguyên lý **Open-Closed Principle (Mở rộng đóng sửa đổi)**: Dễ dàng mở rộng, thay đổi hoặc tùy biến logic nghiệp vụ theo từng khách hàng, từng phân hệ hoặc từng quốc gia mà không cần can thiệp chỉnh sửa mã nguồn cốt lõi (Core Logic).

---

## 1. CÁC MẪU THIẾT KẾ BẮT BUỘC ĐỂ TÙY BIẾN NGHIỆP VỤ

### 1.1. Mẫu Chiến Lược (Strategy Pattern) kết hợp Spring Component Map
Khi nghiệp vụ có nhiều biến thể xử lý (ví dụ: Tính phí vận chuyển, Xử lý thanh toán, Chiết khấu khách hàng):
- **Quy tắc**: Tuyệt đối không dùng `switch-case` hoặc chuỗi `if-else` dài ngoằng để phân nhánh loại xử lý.
- **Giải pháp**:
  1. Định nghĩa Interface chiến lược (ví dụ: `PaymentStrategy`).
  2. Mỗi biến thể là một Bean độc lập có `@Component("LOAI_CHIEN_LUOC")`.
  3. Tiêm danh sách hoặc Map các chiến lược vào Service qua Spring DI: `Map<String, PaymentStrategy>`.
  4. Khi cần thêm phương thức mới, chỉ cần tạo thêm class mới mà không chạm vào Service cũ.

```java
public interface PaymentStrategy {
  boolean supports(String paymentMethod);
  PaymentResult process(PaymentContext context);
}
```

---

### 1.2. Mẫu Phương Thức Mẫu (Template Method Pattern Qua Interface Default)
Khi một quy trình nghiệp vụ có các bước chuẩn (Workflow) nhưng các bước con có thể được tinh chỉnh theo từng ngữ cảnh:
- **Tuyệt đối không dùng abstract class**. Bắt buộc định nghĩa **`public interface OrderProcessor`** quy định thứ tự các bước bằng **phương thức `default`**:
  ```java
  public interface OrderProcessor {
    default void processOrder(final OrderContext context) {
      validateOrder(context);
      checkInventory(context);
      calculatePrice(context);
      createInvoice(context);
    }

    default void calculatePrice(final OrderContext context) {
      // Logic tính giá mặc định
    }

    void validateOrder(OrderContext context);
    void checkInventory(OrderContext context);
    void createInvoice(OrderContext context);
  }
  ```
- Các module nghiệp vụ tùy chỉnh chỉ cần `implements OrderProcessor` và override đúng phương thức cần can thiệp.

---

### 1.3. Cơ chế Thay Thế Bean Mặc Định (`@ConditionalOnMissingBean`)
Đối với các dự án xây dựng khung nền tảng (Platform / Core SDK) cho nhiều dự án con dùng chung:
- Khai báo Bean logic mặc định với annotation `@ConditionalOnMissingBean`.
- Khi một dự án con hoặc tenant cần logic tùy biến riêng biệt, họ chỉ việc khai báo một Bean của riêng họ cùng interface, Spring sẽ tự động dùng Bean tùy biến đó và bỏ qua Bean mặc định.

```java
@Configuration
public class PricingAutoConfiguration {

  @Bean
  @ConditionalOnMissingBean(PricingService.class)
  public PricingService defaultPricingService() {
    return new DefaultPricingServiceImpl();
  }
}
```

---

### 1.4. Phân Tách Nghiệp Vụ Qua Sự Kiện (Spring Domain Events)
- Khi một nghiệp vụ chính kết thúc (ví dụ: Đơn hàng thanh toán thành công), Service chính **CHỈ ĐƯỢC PHÉP** phát ra sự kiện (`OrderPaidEvent`).
- Các nghiệp vụ phái sinh (Tích điểm, Gửi email thông báo, Đồng bộ ERP, Gửi tin nhắn SMS) được tách thành các `@EventListener` hoặc `@TransactionalEventListener` độc lập.
- Điều này giúp:
  - Tách rời hoàn toàn các nghiệp vụ phụ trợ ra khỏi giao dịch chính.
  - Khi cần bổ sung nghiệp vụ mới (ví dụ: tặng mã giảm giá cho đơn hàng đầu tiên), chỉ cần viết thêm một Listener mới mà không làm thay đổi hay tăng rủi ro cho Service chính.
