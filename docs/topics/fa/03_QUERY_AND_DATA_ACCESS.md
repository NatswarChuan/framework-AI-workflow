# 03. ۱۳ عملگر فیلتر پویا، محافظ‌های پرس‌وجو، Keyset O(1) و GraphQL SDL (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل (EN)](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#query-operators)

---

## 1. ۱۳ عملگر فیلتر پویا (`FilterOperatorConstant`)

تمامی پارامترهای فیلتر پس از اعتبارسنجی توسط `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`، `PATTERN_XSS`، `PATTERN_SAFE_FIELD_PATH`) به پرس‌وجوهای پارامتری JPA Criteria ترجمه می‌شوند:

| عملگر | نحو URL | معادل SQL | توضیحات |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | مقایسه برابری دقیق (عملگر پیش‌فرض هنگام حذف پسوند مانند status=ACTIVE). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | فیلتر نابرابری برای یافتن رکوردهایی با مقدار متفاوت. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | تطبیق زیررشته بدون حساسیت به بزرگی و کوچکی حروف با % SQL. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | تطبیق پیشوند با بهره‌گیری از اسکن ایندکس B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | تطبیق پسوند در انتهای رشته متنی. |
| `gt` | `price.gt=100` | `> 100` | مقایسه اکیداً بزرگ‌تر برای اعداد یا زمان ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | مقایسه بزرگ‌تر یا مساوی آستانه مشخص‌شده. |
| `lt` | `stock.lt=50` | `< 50` | مقایسه اکیداً کوچک‌تر از آستانه. |
| `lte` | `stock.lte=50` | `<= 50` | مقایسه کوچک‌تر یا مساوی حد بالا. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | مطابقت با هر یک از مقادیر فهرست جداشده با ویرگول. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | حذف رکوردهایی که با فهرست استثنا مطابقت دارند. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | مقایسه بازه بسته شامل کران پایین و بالا (جداشده با ویرگول). |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | هنگام true عبارت IS NULL و هنگام false عبارت IS NOT NULL را بررسی می‌کند. |

### محافظ‌های ضد DoS پرس‌وجو (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` معیارهای فیلتر و مسیرهای مرتب‌سازی را پیش از اجرای JPA بررسی می‌کند:

- `max-join-depth` (پیش‌فرض `3`): محدودیت حداکثر عمق پیوند روابط نقطه‌ای.
- `max-filter-criteria` (پیش‌فرض `25`): محدودیت تعداد کل شرط‌های فیلتر در هر درخواست.
- `max-page-size` (پیش‌فرض `200`): محدودیت حداکثر رکورد در هر صفحه.
- `max-unpaged-fetch-limit` (پیش‌فرض `5000`): سقف ایمنی ضد OOM در فراخوانی‌های بدون صفحه‌بندی `GET /all`.
- `eager-fetch-singular-relations` (پیش‌فرض `true`): بارگذاری پیش‌دستانه روابط مفرد با `LEFT JOIN FETCH` مگر با `?expand=`.
- `allowed-filter-fields` و `allowed-sort-fields`: فهرست‌های مجاز اختیاری برای محدود کردن فیلدهای قابل فیلتر و مرتب‌سازی.

---

## 2. صفحه‌بندی مکان‌نما Keyset O(1) (`GET /keyset`)

از آنجا که کلیدهای اصلی **UUIDv7** مرتب‌شده بر اساس زمان هستند، `/keyset` در هر دو جهت `dir=asc` و `dir=desc` با روش `size + 1` در زمان `O(1)` مستقیماً به مرز مکان‌نما می‌پرد:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. ماندگاری بدون وضعیت JPA، `@Version` و انتخاب فیلدهای پراکنده غیرمخرب

- **`spring.jpa.open-in-view=false`، `?expand=` و قفل خوش‌بینانه**: OSIV را غیرفعال نگه می‌دارد، از `?expand=rel1,rel2` پشتیبانی می‌کند، `@Version` (`409 Conflict`) را در `BaseAuditEntity` اعمال می‌کند و ارجاعات کلید خارجی را با `JpaAssociationReferenceUtil` حل می‌کند.
- **`fields=id,skuCode,productName,retailPrice`**: از `EntityCloneSnapshotHelper` در `DynamicSchemaProjectionHelper` بهره می‌برد تا انتخاب فیلد در REST و GraphQL هرگز کش L1 یا موجودیت‌های Hibernate را تغییر ندهد.

---

## 4. موتور پویای GraphQL (`GraphQLDynamicApiController`)

| مسیر | HTTP | عملکرد |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | خروجی گرفتن از طرحواره خودکار GraphQL SDL (`list<Entity>s`، انواع Object و Input) |
| `/api/v1/graphql` | `POST` | نقطه پایانی یکپارچه برای اجرای Queryها و Mutationها |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | محیط آزمایش تعاملی GraphiQL |
