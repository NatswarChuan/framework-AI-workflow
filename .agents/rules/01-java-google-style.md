# Rule 01: Quy chuẩn Java Google Style Guide & Javadoc

Tất cả mã nguồn Java trong dự án phải tuân thủ nghiêm ngặt theo **[Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)**.

---

## 1. ĐỊNH DẠNG MÃ NGUỒN (SOURCE FILE BASICS)

### 1.1. Bảng mã và ký tự
- Bảng mã tệp tin: **UTF-8**.
- Ký tự ngắt dòng: **LF** (`\n`), tránh `CRLF`.
- Khoảng trắng: Ký tự ASCII space (0x20). Không dùng ký tự tab (ASCII 0x09) để thụt dòng.

### 1.2. Thụt dòng (Indentation)
- Mỗi lần mở một khối lệnh (`{}`), tăng mức thụt dòng lên đúng **2 khoảng trắng** (2 spaces).
- Khi ngắt dòng cho câu lệnh dài (Line wrapping), thụt lề thụt vào thêm **4 khoảng trắng** (+4 spaces) so với dòng bắt đầu.

### 1.3. Giới hạn độ dài dòng (Column Limit)
- Giới hạn tối đa: **100 ký tự** trên một dòng.
- Ngoại lệ: URL dài, lệnh import, chuỗi dài không thể ngắt.

---

## 2. QUY TẮC ĐẶT TÊN (NAMING CONVENTIONS)

| Đối tượng | Quy cách đặt tên | Ví dụ |
| :--- | :--- | :--- |
| **Package** | Tất cả chữ thường, viết liền không dấu gạch | `com.enterprise.app.common.util` |
| **Class, Interface** | **PascalCase** (UpperCamelCase), danh từ | `UserAuthenticationService`, `OrderStatusConstant` |
| **Method** | **camelCase** (lowerCamelCase), động từ | `findUserById`, `calculateTotalAmount` |
| **Biến nội bộ, Tham số** | **camelCase**, có ý nghĩa rõ ràng, không viết tắt vô nghĩa | `orderId`, `userProfileRequest` |
| **Constant (Hằng số)** | **UPPER_SNAKE_CASE** (chỉ khai báo trong file Constant) | `MAX_RETRY_ATTEMPTS`, `DEFAULT_PAGE_SIZE` |
| **Generic Type Parameter** | Chữ cái in hoa đơn hoặc PascalCase kèm `T` | `T`, `ID`, `REQ`, `RES` |

---

## 3. CẤU TRÚC LỆNH VÀ KHỐI MÃ (BLOCKS & BRACES)

### 3.1. Dấu ngoặc nhọn `{}` là bắt buộc
Dấu ngoặc nhọn `{}` **luôn luôn bắt buộc** cho mọi cấu trúc điều khiển (`if`, `else`, `for`, `do`, `while`), kể cả khi thân hàm chỉ có đúng 1 dòng lệnh.

```java
// ĐÚNG:
if (Objects.isNull(user)) {
  return Optional.empty();
}

// SAI (CẤM):
if (Objects.isNull(user)) return Optional.empty();
```

### 3.2. Phong cách K&R (Kernighan & Ritchie)
- Dấu mở ngoặc `{` nằm ở cuối dòng của câu lệnh khai báo.
- Dấu đóng ngoặc `}` nằm trên dòng riêng biệt, thụt lề bằng với câu lệnh mở khối.
- `else`, `catch`, `finally` nằm trên cùng dòng với dấu đóng ngoặc `}` trước đó.

```java
try {
  processOrder(order);
} catch (PaymentException ex) {
  logPaymentFailure(ex);
} finally {
  cleanupResources();
}
```

---

## 4. QUY TẮC IMPORT

- Tuyệt đối **KHÔNG SỬ DỤNG WILDCARD IMPORT** (`import java.util.*;` bị CẤM).
- Mọi import phải được chỉ định tường minh từng lớp cụ thể.
- Thứ tự import chuẩn:
  1. `static` imports (nếu có).
  2. Các package tiêu chuẩn của Java (`java.*`, `javax.*`, `jakarta.*`).
  3. Các thư viện bên thứ ba (Spring, Lombok, Jackson,...).
  4. Các package nội bộ của dự án.
- Giữa các nhóm import nên có 1 dòng trống.

---

## 5. TIÊU CHUẨN GOOGLE JAVADOC

### 5.1. Bắt buộc cho mọi phần tử công khai
Mọi `public` / `protected` Class, Interface, Method và Constructor đều phải có Javadoc đầy đủ (Lưu ý: Enum và Record bị cấm hoàn toàn).

### 5.2. Cấu trúc Javadoc chuẩn
```java
/**
 * Thực hiện xác thực thông tin đăng nhập của người dùng.
 *
 * <p>Phương thức này sẽ kiểm tra thông tin người dùng trong cơ sở dữ liệu,
 * đối soát mật khẩu đã mã hóa và tạo chuỗi JWT token nếu hợp lệ.
 *
 * @param loginRequest thông tin yêu cầu đăng nhập chứa username và password không null
 * @return đối tượng {@link LoginResponse} chứa thông tin phiên và token truy cập
 * @throws AuthenticationException nếu thông tin đăng nhập không chính xác
 * @throws AccountLockedException nếu tài khoản đang trong trạng thái bị khóa
 */
public LoginResponse authenticate(final LoginRequest loginRequest) {
  // Logic
}
```

### 5.3. Quy tắc viết mô tả
- Dòng đầu tiên là một câu tóm tắt ngắn gọn kết thúc bằng dấu chấm (`.`).
- Dùng thẻ `<p>` để tách các đoạn văn giải thích bổ sung.
- Bắt buộc khai báo đầy đủ `@param`, `@return`, `@throws` (nếu method ném ngoại lệ).
