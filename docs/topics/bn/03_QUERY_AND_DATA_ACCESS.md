# 03. ১৩টি ডায়নামিক ফিল্টার অপারেটর, Query Guardrails, Keyset O(1) ও GraphQL SDL (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল (EN)](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#query-operators)

---

## 1. ১৩টি ডায়নামিক ফিল্টার অপারেটর (`FilterOperatorConstant`)

সকল ফিল্টার কোয়েরি প্যারামিটার `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) দ্বারা যাচাই হয়ে প্যারামিটারাইজড JPA Criteria কোয়েরিতে রূপান্তরিত হয়:

| অপারেটর | URL সিনট্যাক্স | SQL অর্থ | বিবরণ |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | সঠিক সমতা তুলনা (সাফিক্স বাদ দিলে ডিফল্ট অপারেটর, যেমন status=ACTIVE)। |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | অসমান বর্জন ফিল্টার যা ভিন্ন মানের রেকর্ড খুঁজে বের করে। |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | কেস-ইনসেন্সিটিভ সাবস্ট্রিং ম্যাচিং (SQL % ওয়াইল্ডকার্ড সহ)। |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | প্রিফিক্স ম্যাচিং যা B-Tree ইনডেক্স স্ক্যান ব্যবহার করে। |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | স্ট্রিংয়ের শেষ অংশের সাথে সাফিক্স ম্যাচিং। |
| `gt` | `price.gt=100` | `> 100` | সংখ্যা বা ISO-8601 সময়ের চেয়ে বড় তুলনা। |
| `gte` | `price.gte=100` | `>= 100` | সর্বনিম্ন সীমার চেয়ে বড় বা সমান তুলনা। |
| `lt` | `stock.lt=50` | `< 50` | সর্বোচ্চ সীমার চেয়ে কম তুলনা। |
| `lte` | `stock.lte=50` | `<= 50` | সর্বোচ্চ সীমার চেয়ে কম বা সমান তুলনা। |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | কমা দ্বারা পৃথক করা তালিকার যেকোনো মানের সাথে মেলে। |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | কমা দ্বারা পৃথক করা তালিকার যেকোনো মান বাদ দেয়। |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | কমা দ্বারা পৃথক করা সর্বনিম্ন ও সর্বোচ্চ সীমার মধ্যে রেঞ্জ তুলনা। |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true হলে SQL IS NULL এবং false হলে IS NOT NULL যাচাই করে। |

### কোয়েরি DoS সুরক্ষা সীমা (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` JPA চালানোর আগেই আগত ফিল্টার ও সর্ট পাথ যাচাই করে:

- `max-join-depth` (ডিফল্ট `3`): ডট-বিভক্ত অ্যাসোসিয়েশন জয়েনের সর্বোচ্চ গভীরতা সীমিত করে।
- `max-filter-criteria` (ডিফল্ট `25`): প্রতি রিকোয়েস্টে সর্বোচ্চ ফিল্টার শর্ত সীমিত করে।
- `max-page-size` (ডিফল্ট `200`): প্রতি পেজে সর্বোচ্চ রেকর্ড সংখ্যা সীমিত করে।
- `max-unpaged-fetch-limit` (ডিফল্ট `5000`): পেজিনেশনবিহীন `GET /all`-এ OOM প্রতিরোধক সর্বোচ্চ সীমা।
- `eager-fetch-singular-relations` (ডিফল্ট `true`): `?expand=` না থাকলে একক সম্পর্ক `LEFT JOIN FETCH` করে।
- `allowed-filter-fields` ও `allowed-sort-fields`: ফিল্টার ও সর্টযোগ্য ফিল্ড সীমাবদ্ধ করার ঐচ্ছিক অনুমোদন তালিকা।

---

## 2. O(1) কার্সার Keyset পেজিনেশন (`GET /keyset`)

প্রাইমারি কী সময়ক্রমিক **UUIDv7** ব্যবহার করায় `/keyset` উভয় দিকে (`dir=asc`, `dir=desc`) `size + 1` প্রোব দিয়ে `O(1)` সময়ে সরাসরি কার্সার সীমানায় পৌঁছায়:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. স্টেটলেস JPA পারসিস্টেন্স, `@Version` এবং অপরিবর্তনীয় স্পার্স ফিল্ডসেট

- **`spring.jpa.open-in-view=false`, `?expand=` এবং অপটিমিস্টিক লকিং**: OSIV বন্ধ রাখে, নির্বাচনী `?expand=rel1,rel2` সমর্থন করে, `BaseAuditEntity`-এ `@Version` (`409 Conflict`) প্রয়োগ করে এবং `JpaAssociationReferenceUtil` দিয়ে ডিট্যাচড FK স্টাব সমাধান করে।
- **`fields=id,skuCode,productName,retailPrice`**: `DynamicSchemaProjectionHelper`-এ `EntityCloneSnapshotHelper` ব্যবহার করে যাতে REST ও GraphQL প্রোজেকশন কখনো L1 ক্যাশ বা Hibernate পরিচালিত এনটিটি পরিবর্তন না করে।

---

## 4. ডায়নামিক GraphQL ইঞ্জিন (`GraphQLDynamicApiController`)

| এন্ডপয়েন্ট | HTTP | কাজ |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | স্বয়ংক্রিয় তৈরি GraphQL SDL (`list<Entity>s`, Object ও Input টাইপ) এক্সপোর্ট করে |
| `/api/v1/graphql` | `POST` | কোয়েরি ও মিউটেশন চালানোর একীভূত এন্ডপয়েন্ট |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | ইন্টারঅ্যাক্টিভ GraphiQL প্লেগ্রাউন্ড |
