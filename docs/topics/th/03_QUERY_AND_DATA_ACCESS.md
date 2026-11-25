# 03. 13 ตัวดำเนินการกรองไดนามิก, Query Guardrails, Keyset O(1) และ GraphQL SDL (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#query-dsl)

---

## 1. 13 ตัวดำเนินการกรองไดนามิก (`FilterOperatorConstant`)

พารามิเตอร์การกรองทั้งหมดจะถูกตรวจผ่าน `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) และคอมไพล์เป็น JPA Criteria แบบมีพารามิเตอร์อย่างปลอดภัย:

| ตัวดำเนินการ | รูปแบบ URL | ความหมาย SQL | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | เปรียบเทียบเท่ากับแบบตรงตัว (ค่าเริ่มต้นเมื่อละตัวต่อท้าย เช่น status=ACTIVE) |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | ตัวกรองแบบไม่เท่ากับเพื่อคัดระเบียนที่มีค่าต่างออกไป |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | ค้นหาสตริงย่อยแบบไม่สนตัวพิมพ์เล็ก-ใหญ่ด้วย % ของ SQL |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | ค้นหาคำขึ้นต้นที่ใช้ประโยชน์จาก B-Tree index ได้ดี |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | ค้นหาคำลงท้ายที่ส่วนท้ายของข้อความ |
| `gt` | `price.gt=100` | `> 100` | มากกว่าแบบเข้มงวดสำหรับตัวเลขหรือเวลา ISO-8601 |
| `gte` | `price.gte=100` | `>= 100` | มากกว่าหรือเท่ากับค่าเกณฑ์ที่กำหนด |
| `lt` | `stock.lt=50` | `< 50` | น้อยกว่าค่าที่กำหนดแบบเข้มงวด |
| `lte` | `stock.lte=50` | `<= 50` | น้อยกว่าหรือเท่ากับค่าสูงสุดที่กำหนด |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | ตรงกับค่าใดค่าหนึ่งในรายการที่คั่นด้วยเครื่องหมายจุลภาค |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | คัดระเบียนที่มีค่าตรงกับรายการยกเว้นออก |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | เปรียบเทียบช่วงปิดรวมขอบเขตล่างและบนที่คั่นด้วยจุลภาค |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | ตรวจสอบ SQL IS NULL เมื่อเป็น true หรือ IS NOT NULL เมื่อเป็น false |

### แนวป้องกัน Query DoS (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` ตรวจสอบเงื่อนไขการกรองและเส้นทางการเรียงลำดับก่อนเรียก JPA:

- `max-join-depth` (ค่าเริ่มต้น `3`): จำกัดความลึกสูงสุดของการเชื่อมความสัมพันธ์ด้วยจุด
- `max-filter-criteria` (ค่าเริ่มต้น `25`): จำกัดจำนวนเงื่อนไขกรองสูงสุดต่อคำขอ
- `max-page-size` (ค่าเริ่มต้น `200`): จำกัดจำนวนเรคอร์ดสูงสุดต่อหน้า
- `max-unpaged-fetch-limit` (ค่าเริ่มต้น `5000`): เพดานกัน OOM สำหรับ `GET /all` แบบไม่แบ่งหน้า
- `eager-fetch-singular-relations` (ค่าเริ่มต้น `true`): ดึงความสัมพันธ์เดี่ยวด้วย `LEFT JOIN FETCH` อัตโนมัติเว้นแต่ระบุ `?expand=`
- `allowed-filter-fields` และ `allowed-sort-fields`: รายชื่อฟิลด์ที่อนุญาตให้กรอง/เรียงลำดับ (ทางเลือก)

---

## 2. การแบ่งหน้าแบบเคอร์เซอร์ Keyset O(1) (`GET /keyset`)

เนื่องจากคีย์หลักเป็น **UUIDv7** ที่เรียงลำดับตามเวลา `/keyset` จึงกระโดดไปยังขอบเขตเคอร์เซอร์ได้ทันทีทั้งทิศทาง `dir=asc` และ `dir=desc` ด้วยเทคนิค `size + 1` ในเวลา $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. JPA แบบ Stateless, `@Version` และการเลือกเฉพาะฟิลด์โดยไม่แก้ Entity ต้นฉบับ

- **`spring.jpa.open-in-view=false`, `?expand=` และ Optimistic Locking**: ปิด OSIV ตลอดเวลา รองรับ `?expand=rel1,rel2` บังคับ `@Version` (`409 Conflict` เมื่อเขียนชนกัน) ใน `BaseAuditEntity` และแปลง FK stub ผ่าน `JpaAssociationReferenceUtil`
- **`fields=id,skuCode,productName,retailPrice`**: ใช้ `EntityCloneSnapshotHelper` ภายใน `DynamicSchemaProjectionHelper` เพื่อให้การเลือกฟิลด์ของ REST และ GraphQL ไม่กระทบ L1 cache หรือ Entity ของ Hibernate

---

## 4. เอ็นจิน GraphQL แบบไดนามิก (`GraphQLDynamicApiController`)

| Endpoint | HTTP | หน้าที่ |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | ส่งออกสคีมา GraphQL SDL ที่สังเคราะห์อัตโนมัติ (`list<Entity>s`, ประเภท Object และ Input) |
| `/api/v1/graphql` | `POST` | Endpoint กลางสำหรับรัน Query และ Mutation |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | หน้าจอทดลอง GraphiQL แบบโต้ตอบ |
