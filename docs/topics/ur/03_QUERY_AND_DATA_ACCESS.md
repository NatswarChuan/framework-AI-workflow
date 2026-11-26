# 03. 13 ڈائنامک فلٹر آپریٹرز، Query Guardrails، Keyset O(1) اور GraphQL SDL (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ (EN)](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#query-operators)

---

## 1. 13 ڈائنامک فلٹر آپریٹرز (`FilterOperatorConstant`)

تمام فلٹر پیرامیٹرز `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`، `PATTERN_XSS`، `PATTERN_SAFE_FIELD_PATH`) سے تصدیق ہو کر پیرامیٹرائزڈ JPA Criteria کوئریز میں تبدیل ہوتے ہیں:

| آپریٹر | URL نحو | SQL مفہوم | تفصیل |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | عین مساوات کا موازنہ (لاحقہ نہ ہونے پر ڈیفالٹ آپریٹر)۔ |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | عدم مساوات فلٹر جو مختلف قدروں والے ریکارڈ نکالتا ہے۔ |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | کیس ان سینسیٹو ذیلی اسٹرنگ میچنگ (SQL % وائلڈ کارڈز کے ساتھ)۔ |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | پریفکس میچنگ جو B-Tree انڈیکس کا فائدہ اٹھاتی ہے۔ |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | اسٹرنگ کے اختتام پر لاحقہ کی جانچ۔ |
| `gt` | `price.gt=100` | `> 100` | اعداد یا ISO-8601 وقت کے لیے سختی سے بڑا موازنہ۔ |
| `gte` | `price.gte=100` | `>= 100` | حد سے بڑا یا برابر موازنہ۔ |
| `lt` | `stock.lt=50` | `< 50` | حد سے سختی سے کم موازنہ۔ |
| `lte` | `stock.lte=50` | `<= 50` | حد سے کم یا برابر موازنہ۔ |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | کاما سے جدا فہرست کی کسی بھی قدر سے مطابقت۔ |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | فہرست میں شامل قدروں والے ریکارڈ خارج کرتا ہے۔ |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | کاما سے جدا نچلی اور اوپری حد کے درمیان رینج کا موازنہ۔ |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true پر SQL IS NULL اور false پر IS NOT NULL چیک کرتا ہے۔ |

### کوئری DoS حفاظتی حدود (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` JPA عمل سے پہلے فلٹر اور ترتیب کے راستوں کی جانچ کرتا ہے:

- `max-join-depth` (ڈیفالٹ `3`): نقطوں سے جدا تعلقات کے جوائن کی زیادہ سے زیادہ گہرائی محدود کرتا ہے۔
- `max-filter-criteria` (ڈیفالٹ `25`): فی درخواست زیادہ سے زیادہ فلٹر شرائط محدود کرتا ہے۔
- `max-page-size` (ڈیفالٹ `200`): فی صفحہ ریکارڈز کی حد مقرر کرتا ہے۔
- `max-unpaged-fetch-limit` (ڈیفالٹ `5000`): بغیر پیجینیشن `GET /all` کے لیے OOM حفاظتی حد۔
- `eager-fetch-singular-relations` (ڈیفالٹ `true`): `?expand=` نہ ہونے پر واحد روابط کو `LEFT JOIN FETCH` کرتا ہے۔
- `allowed-filter-fields` اور `allowed-sort-fields`: فلٹر اور ترتیب کے قابل فیلڈز کی اختیاری اجازت فہرست۔

---

## 2. O(1) کرسر Keyset پیجینیشن (`GET /keyset`)

چونکہ پرائمری کیز وقت کے مطابق مرتب **UUIDv7** استعمال کرتی ہیں، `/keyset` دونوں سمتوں (`dir=asc` اور `dir=desc`) میں `size + 1` پروب کے ساتھ `O(1)` وقت میں سیدھا کرسر حد تک پہنچتا ہے:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. اسٹیٹ لیس JPA، `@Version` اور غیر متغیر اسپارس فیلڈ سلیکشن

- **`spring.jpa.open-in-view=false`، `?expand=` اور آپٹیمسٹک لاکنگ**: OSIV بند رکھتا ہے، منتخب `?expand=rel1,rel2` سپورٹ کرتا ہے، `BaseAuditEntity` میں `@Version` (`409 Conflict`) نافذ کرتا ہے اور `JpaAssociationReferenceUtil` سے منقطع FK اسٹبس حل کرتا ہے۔
- **`fields=id,skuCode,productName,retailPrice`**: `DynamicSchemaProjectionHelper` میں `EntityCloneSnapshotHelper` استعمال کرتا ہے تاکہ REST اور GraphQL پروجیکشن کبھی L1 کیش یا Hibernate اینٹیٹیز کو تبدیل نہ کریں۔

---

## 4. ڈائنامک GraphQL انجن (`GraphQLDynamicApiController`)

| اینڈپوائنٹ | HTTP | فنکشن |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | خودکار تیار کردہ GraphQL SDL (`list<Entity>s`، Object اور Input اقسام) برآمد کرتا ہے |
| `/api/v1/graphql` | `POST` | کوئریز اور میوٹیشنز چلانے کا متحد اینڈپوائنٹ |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | انٹرایکٹو GraphiQL پلے گراؤنڈ |
