# 03. 13 डायनामिक फ़िल्टर ऑपरेटर, Query Guardrails, Keyset O(1) और GraphQL SDL (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#query-operators)

---

## 1. 13 डायनामिक फ़िल्टर ऑपरेटर (`FilterOperatorConstant`)

सभी फ़िल्टर क्वेरी पैरामीटर `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) द्वारा सत्यापित होकर पैरामीटराइज्ड JPA Criteria क्वेरी में संकलित होते हैं:

| ऑपरेटर | URL सिंटैक्स | SQL अर्थ | विवरण |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | सटीक समानता तुलना (प्रत्यय छोड़ने पर डिफ़ॉल्ट ऑपरेटर, जैसे status=ACTIVE)। |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | असमानता फ़िल्टर जो भिन्न मान वाले रिकॉर्ड लौटाता है। |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | केस-इनसेंसिटिव सबस्ट्रिंग मिलान (% वाइल्डकार्ड के साथ)। |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | प्रिफ़िक्स मिलान जो B-Tree इंडेक्स स्कैन का लाभ उठाता है। |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | स्ट्रिंग के अंतिम अक्षरों से सफ़िक्स मिलान। |
| `gt` | `price.gt=100` | `> 100` | संख्यात्मक या ISO-8601 समय से सख्ती से बड़ा मिलान। |
| `gte` | `price.gte=100` | `>= 100` | से बड़ा या बराबर समावेशी सीमा तुलना। |
| `lt` | `stock.lt=50` | `< 50` | सख्ती से कम सीमा तुलना। |
| `lte` | `stock.lte=50` | `<= 50` | से कम या बराबर अधिकतम सीमा तुलना। |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | अल्पविराम से अलग सूची के किसी भी मान से मिलान करता है। |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | अल्पविराम से अलग बहिष्करण सूची के मानों वाले रिकॉर्ड हटाता है। |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | अल्पविराम से अलग निचली और ऊपरी सीमा के भीतर समावेशी रेंज तुलना। |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true होने पर SQL IS NULL, और false होने पर IS NOT NULL जांचता है। |

### क्वेरी DoS सुरक्षा सीमाएँ (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` JPA निष्पादन से पहले आने वाले फ़िल्टर और सॉर्ट पथों की जाँच करता है:

- `max-join-depth` (डिफ़ॉल्ट `3`): डॉट-विभाजित एसोसिएशन जॉइन की अधिकतम गहराई सीमित करता है।
- `max-filter-criteria` (डिफ़ॉल्ट `25`): प्रति अनुरोध अधिकतम फ़िल्टर शर्तों की सीमा तय करता है।
- `max-page-size` (डिफ़ॉल्ट `200`): प्रति पृष्ठ अधिकतम रिकॉर्ड सीमा तय करता है।
- `max-unpaged-fetch-limit` (डिफ़ॉल्ट `5000`): बिना पेजिंग वाले `GET /all` के लिए OOM सुरक्षा सीमा।
- `eager-fetch-singular-relations` (डिफ़ॉल्ट `true`): `?expand=` न होने पर एकल संबंधों को `LEFT JOIN FETCH` से लोड करता है।
- `allowed-filter-fields` और `allowed-sort-fields`: फ़िल्टर व सॉर्ट योग्य फ़ील्ड सीमित करने हेतु वैकल्पिक अनुमति सूचियाँ।

---

## 2. O(1) कर्सर Keyset पेजिनेशन (`GET /keyset`)

चूँकि प्राइमरी की समय-क्रमित **UUIDv7** का उपयोग करती हैं, `/keyset` `dir=asc` और `dir=desc` दोनों दिशाओं में `size + 1` जांच के साथ `O(1)` समय में सीधे कर्सर सीमा पर पहुँचता है:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. स्टेटलेस JPA पर्सिस्टेंस, `@Version` और नॉन-म्यूटेटिंग स्पार्स फ़ील्डसेट

- **`spring.jpa.open-in-view=false`, `?expand=` और ऑप्टिमिस्टिक लॉकिंग**: OSIV अक्षम रखता है, चयनात्मक `?expand=rel1,rel2` का समर्थन करता है, `BaseAuditEntity` में `@Version` (`409 Conflict`) लागू करता है और `JpaAssociationReferenceUtil` से डिटैच्ड FK स्टब हल करता है।
- **`fields=id,skuCode,productName,retailPrice`**: `DynamicSchemaProjectionHelper` के भीतर `EntityCloneSnapshotHelper` का उपयोग करता है ताकि REST और GraphQL प्रोजेक्शन कभी भी L1 कैश या Hibernate प्रबंधित एंटिटी को न बदलें।

---

## 4. डायनामिक GraphQL इंजन (`GraphQLDynamicApiController`)

| एंडपॉइंट | HTTP | कार्य |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | स्वचालित निर्मित GraphQL SDL (`list<Entity>s`, Object और Input प्रकार) निर्यात करता है |
| `/api/v1/graphql` | `POST` | क्वेरी और म्यूटेशन निष्पादन का एकीकृत एंडपॉइंट |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | इंटरैक्टिव GraphiQL प्लेग्राउंड |
