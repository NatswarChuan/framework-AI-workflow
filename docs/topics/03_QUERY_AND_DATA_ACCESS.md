# 03. Động Cơ Truy Vấn Động, Keyset O(1) & GraphQL SDL

> **Ngôn ngữ**: Tiếng Việt | [English](en/03_QUERY_AND_DATA_ACCESS.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. 13 Toán Tử Lọc Động (`FilterOperatorConstant`)

Mọi yêu cầu lọc đều biên dịch qua JPA Criteria API có tham số hóa (Parameterized Predicates) thông qua `QueryFilterParameterUtil`, chặn hoàn toàn tiêm nhiễm SQL.

| Toán Tử | Cú Pháp URL | Phép So Sánh SQL |
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

**Ràng buộc chống cạn tài nguyên (`QueryFilterParameterUtil`)**:
- Tối đa `30` điều kiện lọc mỗi truy vấn (`MAX_DYNAMIC_FILTERS=30`).
- Độ sâu sắp xếp qua quan hệ lồng nhau tối đa `4` cấp (`MAX_SORT_RELATION_DEPTH=4`).
- Từ khóa SQLi / thẻ XSS trong chuỗi truy vấn bị chặn ngay với mã lỗi `error.security.malicious.query` (`HTTP 400`).

---

## 2. Phân Trang Keyset Con Trỏ $O(1)$ (`GET /keyset`)

Với bảng hàng triệu dòng, truy vấn `OFFSET` truyền thống tăng độ phức tạp tuyến tính $O(N)$ do DB phải quét và loại bỏ bản ghi cũ. Endpoint `/keyset` sử dụng khóa chính **UUIDv7** tăng đơn điệu theo thời gian để nhảy trực tiếp trên chỉ mục B-Tree với chi phí $O(1)$:

```bash
curl "http://localhost:8080/api/v1/commercial-products/keyset?afterId=019a0b12-3456-7000-8000-000000000001&size=20&fields=id,name,price" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Tối Ưu Eager Loading, Batch Fetch & Sparse Fieldsets

- **`include=...` & `eager-fetch-singular-relations: true`**: Chủ động tạo `JOIN FETCH` trên quan hệ `@ManyToOne` / `@OneToOne` để nạp toàn bộ dữ liệu trong một truy vấn SQL duy nhất khi `spring.jpa.open-in-view=false`.
- **`fields=id,name,price`**: Sparse Fieldsets trả về tập trường tối thiểu nhằm giảm băng thông JSON và chi phí serialize.

---

## 4. Động Cơ GraphQL Tự Động (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Chức Năng |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Xuất toàn bộ định nghĩa Schema SDL (`get<Entity>`, `list<Entity>`, `count<Entity>`) |
| `/api/v1/graphql` | `POST` | Thực thi truy vấn và đột biến GraphQL thống nhất |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Giao diện GraphiQL tương tác trong trình duyệt |
