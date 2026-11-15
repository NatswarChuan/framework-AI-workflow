# 03. Truy Vấn Động 13 Toán Tử, Query Guardrails, Keyset $O(1)$ & GraphQL SDL (`1.0.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/03_QUERY_AND_DATA_ACCESS.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

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
- `allowed-filter-fields` & `allowed-sort-fields`: Danh sách trắng các trường được phép lọc/sắp xếp theo cấu hình.

---

## 2. Phân Trang Con Trỏ Keyset $O(1)$ (`GET /keyset`)

Phân trang `OFFSET` truyền thống có chi phí quét tuyến tính $O(N)$ khi đi sâu vào các trang cuối. Vì khóa chính của thực thể dùng **UUIDv7 (RFC 9562)** tăng dần đơn điệu theo dấu thời gian 48-bit, endpoint `/keyset` truy cập trực tiếp qua chỉ mục B-Tree với chi phí seek $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&size=20&fields=id,name,price" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Nạp Chủ Động Eager Loading & Sparse Fieldsets

- **`include=...` & `eager-fetch-singular-relations: true`**: Tự động tạo `JOIN FETCH` trên quan hệ `@ManyToOne` / `@OneToOne` trong duy nhất 1 truy vấn SQL, giữ nguyên `spring.jpa.open-in-view=false`.
- **`fields=id,name,price`**: Lọc thuộc tính đầu ra tại `DynamicSchemaProjectionHelper`.

---

## 4. Động Cơ GraphQL Tự Động (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Chức Năng |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Xuất GraphQL Schema SDL (`get<Entity>`, `list<Entity>`, `count<Entity>`) |
| `/api/v1/graphql` | `POST` | Thực thi Query & Mutation theo trường chọn |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Giao diện GraphiQL kiểm thử trực tiếp trên trình duyệt |
