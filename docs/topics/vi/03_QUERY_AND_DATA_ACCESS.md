# 03. Truy Vấn Động 13 Toán Tử, Query Guardrails, Keyset `O(1)` & GraphQL SDL (`0.1.0`)

> **Ngôn ngữ**: [English](../en/03_QUERY_AND_DATA_ACCESS.md) | **Tiếng Việt** | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Đủ 20 Ngôn Ngữ](../README.md) | [Cẩm Nang Đầy Đủ](../../GUIDE_VI.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](../../index.html#query-operators)

---

## 1. 13 Toán Tử Lọc Động (`FilterOperatorConstant`)

Mọi tham số lọc HTTP được biên dịch sang JPA Criteria có tham số hóa qua `QueryFilterParameterUtil` (chặn từ khóa SQLi qua `PATTERN_MALICIOUS_SQL` và XSS qua `PATTERN_XSS`):

| Toán Tử | Cú Pháp URL | Ngữ Nghĩa SQL |
| :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` |
| `startsWith` | `productCode.startsWith=PRD-` | `LIKE 'PRD-%'` |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` |
| `gt` | `price.gt=100` | `> 100` |
| `gte` | `price.gte=100` | `>= 100` |
| `lt` | `stock.lt=50` | `< 50` |
| `lte` | `stock.lte=50` | `<= 50` |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN (...)` |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` |
| `null` | `deletedAt.null=true` | `IS NULL` (hoặc `IS NOT NULL` với `false`) |

### Kiểm Soát Tải Truy Vấn (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` thực thi các ngưỡng bảo vệ trước khi sinh câu lệnh JPA Criteria:

- `max-join-depth` (mặc định `3`): Giới hạn số cấp lồng quan hệ dấu chấm khi lọc hoặc sắp xếp.
- `max-filter-criteria` (mặc định `25`): Giới hạn tổng số điều kiện lọc động trong một truy vấn.
- `max-page-size` (mặc định `200`): Giới hạn kích thước trang tối đa chống cạn kiệt bộ nhớ.
- `max-unpaged-fetch-limit` (mặc định `5000`): Trần số bản ghi an toàn chống OOM cho `GET /all`.
- `eager-fetch-singular-relations` (mặc định `true`): Tự động eager `LEFT JOIN FETCH` các quan hệ đơn lẻ trừ khi dùng `?expand=...`.
- `allowed-filter-fields` & `allowed-sort-fields`: Danh sách trắng các trường được phép lọc/sắp xếp theo cấu hình.

---

## 2. Phân Trang Con Trỏ Keyset `O(1)` (`GET /keyset`)

Phân trang `OFFSET` truyền thống có chi phí quét tuyến tính `O(N)` khi đi sâu vào các trang cuối. Vì khóa chính của thực thể dùng **UUIDv7 (RFC 9562)** tăng dần đơn điệu theo dấu thời gian 48-bit, endpoint `/keyset` truy cập trực tiếp qua chỉ mục B-Tree hỗ trợ cả `dir=asc` và `dir=desc` kèm thăm dò `size + 1` độ phức tạp `O(1)`:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Tối Ưu Truy Vấn JPA, `@Version` & Sparse Fieldsets Không Đột Biến

- **`spring.jpa.open-in-view=false`, `?expand=` & `EntityCloneSnapshotHelper`**: Tắt Open-Session-in-View ở production; hỗ trợ `?expand=rel1,rel2` có chọn lọc, `@Version` Optimistic Locking trên `BaseAuditEntity` trả `409 Conflict` khi ghi đè cũ, và `JpaAssociationReferenceUtil` giải quyết stub FK lồng nhau.
- **`fields=id,skuCode,productName,retailPrice`**: Sao chép snapshot qua `EntityCloneSnapshotHelper` tại `DynamicSchemaProjectionHelper` để bảo vệ 100% L1 Caffeine Cache và Hibernate managed state.

---

## 4. Động Cơ GraphQL Tự Động (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Chức Năng |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Xuất GraphQL Schema SDL (`list<Entity>s`, Object & Input types) |
| `/api/v1/graphql` | `POST` | Thực thi Query & Mutation theo trường chọn |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Giao diện GraphiQL kiểm thử trực tiếp trên trình duyệt |
