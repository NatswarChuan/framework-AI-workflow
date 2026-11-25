# 03. 13 عامل تصفية ديناميكي، ضوابط الاستعلام، Keyset O(1) ومخطط GraphQL SDL (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#query-dsl)

---

## 1. 13 عامل تصفية ديناميكي (`FilterOperatorConstant`)

تُترجم جميع معاملات التصفية إلى استعلامات JPA Criteria مُعاملَة بعد التحقق منها عبر `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`، `PATTERN_XSS`، `PATTERN_SAFE_FIELD_PATH`):

| العامل | صيغة URL | دلالة SQL | الوصف |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | مقارنة المساواة الدقيقة (العامل الافتراضي عند حذف اللاحقة مثل status=ACTIVE). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | مرشح الاستبعاد لا يساوي للسجلات ذات القيم المختلفة. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | مطابقة جزئية غير حساسة لحالة الأحرف باستخدام رمز % في SQL. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | مطابقة البادئة مع الاستفادة من فهرس B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | مطابقة اللاحقة مع نهاية النص. |
| `gt` | `price.gt=100` | `> 100` | مقارنة أكبر تماماً للأرقام أو الطوابع الزمنية ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | مقارنة أكبر من أو يساوي الحد الأدنى الشامل. |
| `lt` | `stock.lt=50` | `< 50` | مقارنة أصغر تماماً من الحد المحدد. |
| `lte` | `stock.lte=50` | `<= 50` | مقارنة أصغر من أو يساوي الحد الأقصى. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | يطابق أي عنصر ضمن القائمة المفصولة بفواصل. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | يستبعد السجلات المطابقة لأي عنصر في قائمة الاستبعاد. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | مقارنة نطاق مغلق شامل لحدين مفصولين بفاصلة. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | يفحص SQL IS NULL عند true أو IS NOT NULL عند false. |

### ضوابط الحماية من هجمات DoS للاستعلامات (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

يتحقق `QueryGuardrailEnforcerUtil` من معايير التصفية ومسارات الفرز قبل تنفيذ JPA:

- `max-join-depth` (الافتراضي `3`): يحدّ من عمق ربط العلاقات المفصولة بنقاط.
- `max-filter-criteria` (الافتراضي `25`): يحدّ من إجمالي شروط التصفية في الطلب الواحد.
- `max-page-size` (الافتراضي `200`): يحدّ من الحد الأقصى للسجلات في الصفحة.
- `max-unpaged-fetch-limit` (الافتراضي `5000`): سقف حماية من نفاد الذاكرة OOM لاستدعاءات `GET /all` غير المرقمة.
- `eager-fetch-singular-relations` (الافتراضي `true`): يجلب العلاقات المفردة مسبقًا بـ `LEFT JOIN FETCH` ما لم يُحدد `?expand=`.
- `allowed-filter-fields` و`allowed-sort-fields`: قوائم بيضاء اختيارية لتقييد الحقول المسموح تصفيتها أو فرزها.

---

## 2. ترقيم الصفحات بالمؤشر Keyset O(1) (`GET /keyset`)

لأن المفاتيح الأساسية تستخدم **UUIDv7** المرتبة زمنيًا، يقفز `/keyset` مباشرة إلى حدود المؤشر في الاتجاهين `dir=asc` و`dir=desc` بفحص `size + 1` بزمن $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. حفظ JPA عديم الحالة، `@Version` واختيار الحقول دون تعديل الكيان

- **`spring.jpa.open-in-view=false` و`?expand=` والقفل التفاؤلي**: يبقي OSIV معطلًا، ويدعم `?expand=rel1,rel2` ويفرض `@Version` (`409 Conflict` عند التضارب) في `BaseAuditEntity` ويحل مراجع المفاتيح الأجنبية عبر `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: يستخدم `EntityCloneSnapshotHelper` داخل `DynamicSchemaProjectionHelper` لضمان عدم تعديل ذاكرة التخزين المؤقت L1 أو كيانات Hibernate المدارة.

---

## 4. محرك GraphQL الديناميكي (`GraphQLDynamicApiController`)

| نقطة النهاية | HTTP | الوظيفة |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | تصدير مخطط GraphQL SDL المولد (`list<Entity>s` وأنواع Object وInput) |
| `/api/v1/graphql` | `POST` | نقطة نهاية موحدة لتنفيذ الاستعلامات والتعديلات |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | واجهة GraphiQL التفاعلية للتجربة |
