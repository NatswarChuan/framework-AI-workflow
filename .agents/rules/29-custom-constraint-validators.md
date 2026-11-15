# Rule 29: Chuẩn Thiết Kế Custom Constraint Validator Độc Lập

## 1. Ràng Buộc Bắt Buộc
- **Gom nhóm theo thư mục tính năng**: Mỗi cặp ràng buộc validation (annotation interface và validator class thực thi) bắt buộc phải được đặt chung trong 1 thư mục/package con tương ứng (ví dụ: `validation.action/` chứa `ValidActionCode` và `ValidActionCodeValidator`) để tối ưu hóa bảo trì và cây thư mục mã nguồn.
- **Tách 2 file độc lập**: Annotation interface (`@interface`) và Validator class (`implements ConstraintValidator`) phải nằm trong 2 tệp `.java` riêng biệt. CẤM inner static class, CẤM enum, CẤM record.
- **Phương thức 100% public**: CẤM private function trong Validator class.
- **Tuân thủ cú pháp nghiêm ngặt**: CẤM toán tử 3 ngôi (`? :`), CẤM nested if, CẤM so sánh null trực tiếp (`== null`, `!= null` -> dùng `Objects.isNull()` / `Objects.nonNull()`).
- **Triệt tiêu Magic String**: Thuộc tính `message()` trong Annotation interface bắt buộc lấy giá trị mặc định từ hằng số `ValidationConstant.MSG_...`.
- **Nguyên tắc đơn nhiệm**: Validator chỉ kiểm tra định dạng/nghiệp vụ đặc thù; cho phép giá trị null trả về `true` để nhường quyền kiểm tra rỗng cho `@NotNull` / `@NotBlank`.
