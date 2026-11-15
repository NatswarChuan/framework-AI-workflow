# Rule 19: Chuẩn Kiểm Tra Dữ Liệu Đầu Vào & Đa Ngôn Ngữ (Spring Validation)

## 1. Ràng Buộc Bắt Buộc
- **ValidationConfig**: Khởi tạo Bean `LocalValidatorFactoryBean` tích hợp `MessageSource` qua `setValidationMessageSource(messageSource)`.
- **WebMvcConfig**: Ghi đè `WebMvcConfigurer.getValidator()` trả về `LocalValidatorFactoryBean` để tự động nội suy i18n theo Locale của request.
- **Annotation phụ điền tham số đa ngôn ngữ (@ValidationArgs)**: Mọi field được validate bắt buộc phải có annotation phụ `@ValidationArgs({ValidationConstant.LABEL_...})` để cung cấp tham số cho `{0}`, `{1}`, `{2}...` trong thông điệp đa ngôn ngữ.
- **Triệt tiêu 100% Magic String**: Thuộc tính `message` trong các annotation validation (`@NotBlank`, `@NotNull`,...) bắt buộc dùng hằng số dạng `{validation...}` từ `ValidationConstant.java`. Tuyệt đối không hardcode chuỗi thông điệp.
- **Đồng bộ đa ngôn ngữ**: 100% template key và nhãn trường phải có định nghĩa tương ứng trong `messages.properties`, `messages_vi.properties`, và `messages_en.properties`.
- **GlobalExceptionHandler**: Bắt buộc bẫy `MethodArgumentNotValidException`, sử dụng `ValidationArgsHelper` trích xuất thông điệp đã điền đủ tham số và trả về `ApiResponse` kèm `traceId` và `HttpStatus.BAD_REQUEST`.
