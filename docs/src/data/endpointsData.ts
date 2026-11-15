import { EndpointSpec } from '../types/docs';

export const ENDPOINTS_DATA: EndpointSpec[] = [
  {
    method: 'GET',
    path: '/api/v1/{entities}',
    summary: {
      en: 'Query paginated list with dynamic filtering & sorting',
      vi: 'Truy vấn danh sách phân trang kết hợp bộ lọc động',
      ja: '動的フィルタリングとソートを備えたページネーション一覧取得',
      zh: '带动态过滤与排序的分页列表查询',
    },
    description: {
      en: 'Retrieves a paged collection supporting 13 filter operators (eq, like, in, gte, lte...), multi-field sorting, and projection.',
      vi: 'Lấy danh sách phân trang hỗ trợ 13 toán tử lọc linh hoạt, sắp xếp đa trường và tùy chọn projection.',
      ja: '13種類のフィルタ演算子（eq、like、in、gteなど）とマルチフィールドソートをサポートするページネーション一覧を取得します。',
      zh: '获取支持13种过滤运算符、多字段排序与字段投影的分页集合。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "content": [
      { "id": "0194e1a0-0000-7000-8000-000000000001", "orderCode": "ORD-2026-001", "grossAmount": 1250.00 }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000001",
  "timestamp": "2026-11-07T12:00:00Z"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/{id}',
    summary: {
      en: 'Find entity by UUIDv7 Primary Key',
      vi: 'Tìm chi tiết thực thể theo khóa chính UUIDv7',
      ja: 'UUIDv7主キーによる個別エンティティ取得',
      zh: '通过UUIDv7主键查询单个实体',
    },
    description: {
      en: 'Introspects and loads a single entity with automated L1 Caffeine cache lookup and declarative field masking.',
      vi: 'Tải 1 bản ghi với bộ nhớ đệm Caffeine L1 và tự động che mờ trường nhạy cảm theo RBAC.',
      ja: 'Caffeine L1キャッシュ自動検索と宣言的データマスキングを備えた単一エンティティの取得。',
      zh: '加载单个实体，自动集成Caffeine L1缓存与基于RBAC的敏感字段脱敏。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": { "id": "0194e1a0-0000-7000-8000-000000000001", "applicantName": "John Doe", "creditScore": "***" },
  "traceId": "0194e1a0-1234-7000-8000-000000000002"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}',
    summary: {
      en: 'Create single entity with auditing & validation',
      vi: 'Tạo mới thực thể đơn lẻ kèm thẩm định dữ liệu & Auditing',
      ja: 'バリデーションと監査証跡を備えた新規作成',
      zh: '创建单个实体（包含审计与数据校验）',
    },
    description: {
      en: 'Validates payload via Jakarta Bean Validation, evaluates @UniqueField collisions, auto-generates codes (@AutoCode), and commits transaction.',
      vi: 'Kiểm tra tính hợp lệ dữ liệu (@Valid), kiểm tra trùng khóa (@UniqueField), tự động sinh mã nghiệp vụ (@AutoCode) và lưu trữ.',
      ja: 'Bean Validation検証、ユニークキー衝突検出、自動コード採番（@AutoCode）を実行して登録します。',
      zh: '执行Jakarta验证、唯一性检测、自动生成业务编码并安全持久化。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "patientName": "Sarah Connor",
  "physicianName": "Dr. Gregory House",
  "scheduledTime": "2026-12-01 09:00-09:30"
}`,
    responseSample: `{
  "code": 201,
  "message": "Resource created successfully",
  "data": { "id": "0194e1a0-0000-7000-8000-000000000003", "appointmentCode": "APT-0194E1A0", "appointmentStatus": "REQUESTED" },
  "traceId": "0194e1a0-1234-7000-8000-000000000003"
}`,
  },
  {
    method: 'PUT',
    path: '/api/v1/{entities}/{id}',
    summary: {
      en: 'Update single entity by ID with CDC audit delta',
      vi: 'Cập nhật thực thể theo ID kèm ghi nhận biến động dữ liệu CDC',
      ja: 'CDC差分監査を伴うID指定エンティティ更新',
      zh: '通过ID更新实体（自动记录CDC变更审计）',
    },
    description: {
      en: 'Updates mutable fields, validates state machine rules, snapshots previous state, and emits change delta.',
      vi: 'Cập nhật các trường cho phép, kiểm tra ràng buộc state machine, chụp snapshot và ghi log CDC delta.',
      ja: '変更可能フィールドを更新し、変更差分（CDC）を監査証跡に記録します。',
      zh: '更新可变字段，校验状态机规则，自动快照前置状态并写入变更日志。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "applicantName": "Sarah Connor Updated",
  "principalAmount": 60000.00
}`,
    responseSample: `{
  "code": 200,
  "data": { "id": "0194e1a0-0000-7000-8000-000000000003", "applicantName": "Sarah Connor Updated" },
  "traceId": "0194e1a0-1234-7000-8000-000000000004"
}`,
  },
  {
    method: 'DELETE',
    path: '/api/v1/{entities}/{id}',
    summary: {
      en: 'Soft-delete entity with non-deletable state safeguard',
      vi: 'Xóa mềm thực thể kèm chốt chặn bảo vệ trạng thái không thể xóa',
      ja: '削除禁止ステート保護付き論理削除',
      zh: '软删除实体（附带不可删除状态安全守卫）',
    },
    description: {
      en: 'Performs safe soft deletion (deleted=true). Throws HTTP 422 if entity is currently in an active non-deletable state.',
      vi: 'Thực hiện xóa mềm an toàn. Ném lỗi 422 Unprocessable nếu thực thể đang ở trạng thái không cho phép xóa (như CONFIRMED, COMPLETED).',
      ja: '安全な論理削除を実行。エンティティが削除不能状態にある場合はHTTP 422エラーを返します。',
      zh: '执行安全软删除。若实体处于禁止删除的状态机节点则抛出HTTP 422。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": 200,
  "message": "Resource deleted successfully",
  "data": null,
  "traceId": "0194e1a0-1234-7000-8000-000000000005"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/batch',
    summary: {
      en: 'Atomic batch insertion with transaction rollback',
      vi: 'Thêm mới hàng loạt nguyên tử với cam kết rollback toàn vẹn',
      ja: 'トランザクションロールバック対応の一括新規登録',
      zh: '原子性批量插入（失败自动整体回滚）',
    },
    description: {
      en: 'Inserts up to 500 records in a single round-trip. Any single row validation failure triggers complete atomic rollback.',
      vi: 'Chèn đồng thời tối đa 500 bản ghi trong 1 phiên. Bất kỳ lỗi ở hàng nào đều kích hoạt rollback 100%.',
      ja: '最大500件を一括インサート。1件でもバリデーションエラーがあれば全体がロールバックされます。',
      zh: '单次最多批量插入500条记录。任意单行校验失败将触发完整原子回滚。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": 201,
  "message": "Batch insertion committed successfully",
  "data": { "insertedCount": 50 },
  "traceId": "0194e1a0-1234-7000-8000-000000000006"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/upsert',
    summary: {
      en: 'Idempotent upsert (insert or update) single entity record',
      vi: 'Tạo mới hoặc cập nhật (Upsert) bản ghi thực thể theo khóa chính / khóa duy nhất',
      ja: '単一エンティティの冪等アップサート（新規作成または更新）',
      zh: '单条实体的幂等 Upsert（不存在则新增，存在则更新）',
    },
    description: {
      en: 'Atomically inserts a new record or updates the matched active record while preserving @AutoCode and @UniqueField integrity.',
      vi: 'Nguyên tử hóa thao tác chèn mới hoặc cập nhật bản ghi khớp khóa duy nhất, giữ nguyên ràng buộc @AutoCode và @UniqueField.',
      ja: '@AutoCode と @UniqueField の整合性を保ちながら、レコードを原子的に登録または更新します。',
      zh: '严格校验 @AutoCode 与 @UniqueField 唯一性后，以原子操作插入或更新实体记录。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": 200,
  "data": { "id": "0194e1a0-0000-7000-8000-000000000007", "upserted": true },
  "traceId": "0194e1a0-1234-7000-8000-000000000007"
}`,
  },
  {
    method: 'PATCH',
    path: '/api/v1/{entities}/batch-update',
    summary: {
      en: 'Dynamic bulk update by filter criteria',
      vi: 'Cập nhật hàng loạt có điều kiện lọc động',
      ja: '動的フィルタ条件による一括バルク更新',
      zh: '基于动态过滤条件的多记录批量更新',
    },
    description: {
      en: 'Updates specific attributes across all matching entities satisfying dynamic filter predicates.',
      vi: 'Cập nhật các thuộc tính chỉ định cho toàn bộ bản ghi thỏa mãn điều kiện lọc.',
      ja: '動的フィルタ条件に合致する全エンティティの指定フィールドを一括更新します。',
      zh: '根据动态过滤谓词，一键批量更新所有命中实体的指定属性。',
    },
    requiredRole: 'ROLE_SUPER_ADMIN',
    responseSample: `{
  "code": 200,
  "data": { "updatedCount": 85 },
  "traceId": "0194e1a0-1234-7000-8000-000000000008"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/{id}/transition',
    summary: {
      en: 'Trigger declarative finite state machine transition',
      vi: 'Kích hoạt bước chuyển đổi trạng thái State Machine',
      ja: '宣言的有限状態遷移（ステートマシン）の実行',
      zh: '触发声明式有限状态机状态跃迁',
    },
    description: {
      en: 'Advances entity lifecycle state according to @StateMachine rules. Rejects invalid transitions with HTTP 422.',
      vi: 'Chuyển đổi trạng thái vòng đời theo định nghĩa @StateMachine. Từ chối bước nhảy không hợp lệ với HTTP 422.',
      ja: '@StateMachine定義に従って状態を安全に遷移させます。不正な遷移はHTTP 422で拒否されます。',
      zh: '严格根据@StateMachine规则推进生命周期。非法状态跳跃将被HTTP 422拦截。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "message": "State transitioned successfully",
  "data": { "id": "0194e1a0-0000-7000-8000-000000000003", "appointmentStatus": "CONFIRMED" },
  "traceId": "0194e1a0-1234-7000-8000-000000000009"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/{id}/clone',
    summary: {
      en: 'Deep-clone existing entity into a new record with fresh UUIDv7',
      vi: 'Nhân bản thực thể hiện có thành bản ghi mới kèm UUIDv7 độc lập',
      ja: '既存エンティティを新しいUUIDv7で複製（クローン）',
      zh: '深拷贝现有实体记录并赋予全新 UUIDv7 主键',
    },
    description: {
      en: 'Duplicates persistent business attributes while resetting identity, audit timestamps, and regenerating @AutoCode / @AutoSlug markers.',
      vi: 'Sao chép thuộc tính nghiệp vụ, đồng thời cấp mới UUIDv7, reset dấu vết audit và tự sinh lại @AutoCode / @AutoSlug.',
      ja: '既存の業務属性をコピーしつつ、UUIDv7・監査タイムスタンプ・自動採番コードを新しく再生成します。',
      zh: '复制核心业务字段并重置 ID、审计时间及 @AutoCode/@AutoSlug，安全生成独立副本。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 201,
  "data": { "id": "0194e1a0-0000-7000-8000-000000000099", "clonedFrom": "0194e1a0-0000-7000-8000-000000000003" },
  "traceId": "0194e1a0-1234-7000-8000-000000000010"
}`,
  },
  {
    method: 'PATCH',
    path: '/api/v1/{entities}/{id}/increment',
    summary: {
      en: 'Atomic numeric increment or decrement (concurrency-safe)',
      vi: 'Tăng / giảm số học nguyên tử an toàn tranh chấp đa luồng',
      ja: '並行安全なアトミック数値増減（在庫・残高操作）',
      zh: '并发安全的原子级数值增减操作（用于库存/积分）',
    },
    description: {
      en: 'Executes atomic field adjustment (e.g. inventory stock, bank balance) eliminating lost update race conditions.',
      vi: 'Thực hiện tăng/giảm trường số học với khóa bảo vệ chống ghi đè dữ liệu (lost updates).',
      ja: '在庫数や口座残高などの数値をアトミックに加減算し、競合による更新損失を防ぎます。',
      zh: '原子性更新数值字段（如库存、钱包余额），从根本杜绝更新丢失与并发超卖。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "fieldName": "availableQuantity",
  "delta": -1
}`,
    responseSample: `{
  "code": 200,
  "data": { "id": "0194e1a0-0000-7000-8000-000000000011", "availableQuantity": 99 },
  "traceId": "0194e1a0-1234-7000-8000-000000000011"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/events',
    summary: {
      en: 'Real-time Server-Sent Events (SSE) live data stream (@Hidden in Swagger UI)',
      vi: 'Luồng dữ liệu thời gian thực Server-Sent Events (SSE) (@Hidden trên Swagger UI)',
      ja: 'リアルタイムServer-Sent Events（SSE）ストリーム配信（Swagger UI 非表示）',
      zh: 'Server-Sent Events (SSE) 实时长连接数据流（OpenAPI 自动隐藏）',
    },
    description: {
      en: 'Establishes continuous SSE channel with automated keep-alive heartbeats and proactive connection cleanup.',
      vi: 'Khởi tạo kênh truyền SSE liên tục với nhịp tim heartbeat và tự động giải phóng tài nguyên khi ngắt kết nối.',
      ja: '定期的なキープアライブハートビートを備えたSSEストリームを確立します。',
      zh: '建立SSE长连接流，支持自动保活心跳与客户端断开自动内存清理。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `event: heartbeat
data: {"timestamp": 1794028000000}

event: entity_update
data: {"entity": "ClinicalAppointment", "id": "...", "status": "CONFIRMED"}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/keyset',
    summary: {
      en: 'Keyset (cursor-based) pagination for Big Data O(1)',
      vi: 'Phân trang Keyset dựa trên con trỏ cho dữ liệu lớn O(1)',
      ja: 'ビッグデータ向けKeyset（カーソル）ページネーション O(1)',
      zh: '面向海量大数据的高性能Keyset游标分页 O(1)',
    },
    description: {
      en: 'Eliminates traditional SQL OFFSET performance degradation, guaranteeing sub-millisecond lookups on millions of rows.',
      vi: 'Triệt tiêu hoàn toàn độ trễ của OFFSET trên hàng triệu bản ghi, đạt tốc độ phản hồi mili-giây.',
      ja: '数百万件以上のデータに対してもOFFSET遅延ゼロで定数時間O(1)の高速検索を実現します。',
      zh: '彻底解决传统OFFSET随着页数深度的性能急剧恶化，在千万级数据下保持O(1)常数级响应。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "content": [...],
    "nextCursor": "0194e1a0-ffff-7000-8000-000000000000",
    "hasMore": true
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000013"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/aggregate',
    summary: {
      en: 'Execute SQL numeric aggregations (SUM, AVG, MIN, MAX, COUNT)',
      vi: 'Thực thi hàm thống kê tổng hợp số học SQL',
      ja: 'SQL数値集計関数の実行（SUM、AVG、MIN、MAX、COUNT）',
      zh: '执行高性能SQL聚合统计函数（求和、均值、极值、计数）',
    },
    description: {
      en: 'Calculates instant aggregate metrics over filtered result sets directly in the database engine.',
      vi: 'Tính toán thống kê trực tiếp trong database engine trên tập kết quả lọc.',
      ja: 'フィルタ条件で絞り込んだデータに対してDBエンジン内で直接集計を実行します。',
      zh: '直接在数据库层针对动态过滤结果集极速计算汇总统计指标。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": { "field": "grossAmount", "function": "SUM", "value": 458900.50 },
  "traceId": "0194e1a0-1234-7000-8000-000000000014"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/metadata',
    summary: {
      en: 'Runtime entity schema introspection & capabilities reflection',
      vi: 'Phản chiếu lược đồ thực thể & tính năng hỗ trợ lúc thực thi',
      ja: 'ランタイムエンティティメタデータと機能の自己診断',
      zh: '运行时实体元数据与能力全息自省',
    },
    description: {
      en: 'Returns declared fields, data types, constraints, active state machine states, and security permissions.',
      vi: 'Trả về danh sách trường, kiểu dữ liệu, ràng buộc, trạng thái state machine và phân quyền bảo mật.',
      ja: '宣言されたフィールド型、制約条件、ステートマシンの全状態、セキュリティ権限を返却します。',
      zh: '全面返回实体字段类型、校验规则、生命周期节点状态与访问控制列表。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "entityName": "ClinicalAppointment",
    "tableName": "tbl_clinical_appointments",
    "stateField": "appointmentStatus",
    "states": ["REQUESTED", "CONFIRMED", "CHECKED_IN", "IN_CONSULTATION", "COMPLETED", "CANCELLED"],
    "fields": [
      { "name": "appointmentCode", "type": "String", "unique": true },
      { "name": "physicianName", "type": "String", "nullable": false }
    ]
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000015"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/ai/context',
    summary: {
      en: 'Generate LLM System Prompt & Function Calling Tool Schema',
      vi: 'Sinh System Prompt LLM & Tool Schema cho AI Agents',
      ja: 'LLM向けシステムプロンプトとTool Schemaの動的生成',
      zh: '为大语言模型自动生成System Prompt与Function Calling Schema',
    },
    description: {
      en: 'Produces structured OpenAPI schema and domain context for direct integration into Spring AI or OpenAI tools.',
      vi: 'Sinh lược đồ cấu trúc OpenAPI và ngữ cảnh domain phục vụ tích hợp trực tiếp vào Spring AI hoặc OpenAI.',
      ja: 'Spring AIやOpenAIのTool Callingにそのまま渡せるOpenAPI形式スキーマを動的生成します。',
      zh: '生成结构化OpenAPI定义与业务上下文，无缝接入Spring AI与各种智能体调度。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "toolName": "queryClinicalAppointments",
    "description": "Searches clinical appointments for doctors and patients with dynamic filters",
    "parameters": {
      "type": "object",
      "properties": {
        "physicianName": { "type": "string" },
        "appointmentStatus": { "type": "string", "enum": ["REQUESTED", "CONFIRMED", "COMPLETED"] }
      }
    }
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000016"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/ai/query',
    summary: {
      en: 'Execute natural language query translated to criteria',
      vi: 'Thực thi truy vấn bằng ngôn ngữ tự nhiên dịch sang tiêu chí SQL',
      ja: '自然言語クエリの条件式変換と実行',
      zh: '执行自然语言查询并自动转译为SQL安全谓词',
    },
    description: {
      en: 'Translates human utterances (e.g. "orders over 500 dollars placed yesterday") into secure parameterized criteria.',
      vi: 'Dịch câu văn tự nhiên thành câu lệnh lọc an toàn không bị SQL injection.',
      ja: '「昨日の500ドル以上の注文」などの自然言語をパラメータ化された安全なクエリに変換して検索します。',
      zh: '将人类自然口语需求安全解析为参数化SQL条件并执行查询。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "interpretedCriteria": "grossAmount > 500 AND orderStatus = 'PAID'",
    "results": [...]
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000017"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/export/csv',
    summary: {
      en: 'Stream high-volume CSV export without memory overhead',
      vi: 'Xuất dữ liệu CSV dung lượng lớn theo luồng O(1) bộ nhớ',
      ja: 'メモリ負荷ゼロの大量CSVストリーミングエクスポート',
      zh: '零内存开销的高性能大数据CSV流式导出',
    },
    description: {
      en: 'Pours hundreds of thousands of rows directly into the HTTP response stream, bypassing memory heap buffering.',
      vi: 'Đẩy trực tiếp dữ liệu ra HTTP response stream, loại bỏ nguy cơ tràn bộ nhớ OutOfMemory.',
      ja: 'ヒープメモリを消費することなく、レスポンスストリームへ直接CSVを出力します。',
      zh: '数据直接流式写入HTTP响应流，在百万行数据下内存占用恒定保持O(1)。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `id,orderCode,grossAmount,orderStatus
0194e1a0-0000-7000-8000-000000000001,ORD-001,150.00,PAID
0194e1a0-0000-7000-8000-000000000002,ORD-002,320.00,CONFIRMED`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/human-policy',
    summary: {
      en: 'Inspect natural-language human business policies',
      vi: 'Tra cứu tóm tắt chính sách nghiệp vụ bằng ngôn ngữ tự nhiên',
      ja: '自然言語ビジネスポリシーの要約照会',
      zh: '查询基于自然语言声明的业务策略全景',
    },
    description: {
      en: 'Reflects lifecycle graphs, RBAC rules, and data masking constraints written in natural English sentences (@HumanPolicy).',
      vi: 'Phản chiếu quy tắc vòng đời, phân quyền và che mờ dữ liệu được viết bằng câu tiếng Anh tự nhiên.',
      ja: '@HumanPolicyで定義された自然言語ポリシー（ライフサイクル、権限、マスキング）を返却します。',
      zh: '展现通过@HumanPolicy自然语言书写的状态流转、权限分配与数据脱敏规则。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "entity": "SubscriptionContract",
    "lifecyclePolicy": "Starts at DRAFT. From DRAFT can transition to ACTIVE or CANCELLED.",
    "securityPolicy": "Allow read for USER, ADMIN. Allow write for OPERATOR, ADMIN.",
    "maskingPolicy": "Mask recurringAmount for USER with asterisks."
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000019"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/healthcare/appointment',
    summary: {
      en: 'Book clinical appointment with atomic double-booking race condition guard',
      vi: 'Đặt lịch khám bệnh với cơ chế triệt tiêu đụng độ tranh chấp đa bệnh nhân',
      ja: '並行ダブルブッキング防止ロック付き臨床診察予約',
      zh: '预约临床就诊（附带高并发同槽位重复预约排他锁）',
    },
    description: {
      en: 'Synchronizes physician slots across concurrent patient requests. Exactly 1 request succeeds; subsequent attempts receive HTTP 409 Conflict.',
      vi: 'Đồng bộ hóa khung giờ khám. Đúng 1 yêu cầu thành công, các yêu cầu còn lại bị chặn với mã lỗi 409 Conflict.',
      ja: '同一医師・時間枠への同時アクセスを排他制御。1件のみ確定し、他は409 Conflictとなります。',
      zh: '针对同一医生同一时间段施加排他互斥锁。保证仅1人预约成功，其余并发立即返回409 Conflict。',
    },
    requiredRole: 'ROLE_USER',
    requestBodySample: `{
  "patientName": "Sarah Connor",
  "physicianName": "Dr. Gregory House",
  "scheduledTime": "2026-12-01 09:00-09:30",
  "departmentName": "Diagnostic Medicine"
}`,
    responseSample: `{
  "code": 201,
  "message": "Resource created successfully",
  "data": { "id": "...", "appointmentCode": "APT-0194E1A0", "appointmentStatus": "CONFIRMED" },
  "traceId": "0194e1a0-1234-7000-8000-000000000020"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/logistics/allocate-stock',
    summary: {
      en: 'Multi-warehouse stock allocation with cascade atomic rollback',
      vi: 'Phân bổ tồn kho đa kho hàng với cơ chế hoàn tác nguyên tử dây chuyền',
      ja: '複数倉庫分散在庫引当とカスケードアトミックロールバック',
      zh: '多中心分布式仓库库存分配（短缺全链路级联原子回滚）',
    },
    description: {
      en: 'Distributes order demand across candidate warehouses. If aggregate stock is insufficient, rolls back all partial reservations immediately.',
      vi: 'Phân bổ số lượng đơn hàng qua nhiều kho. Nếu tổng tồn kho không đủ, hoàn tác 100% phần đã giữ, không để rò rỉ hàng.',
      ja: '指定倉庫群から在庫を引当。合計在庫不足時は一部引当分も即座に全ロールバックされます。',
      zh: '多仓库协同锁定库存。一旦总库存不足或任一节点失败，立即100%回滚之前所有仓位，零残留锁。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "orderReference": "ORD-MULTI-WH-001",
  "productSkuCode": "SKU-LOGISTICS-001",
  "requestedQuantity": 20,
  "preferredWarehouseCodes": ["WH-NORTH", "WH-SOUTH"]
}`,
    responseSample: `{
  "code": 200,
  "data": {
    "orderReference": "ORD-MULTI-WH-001",
    "allocationStatus": "FULLY_ALLOCATED",
    "allocatedQuantity": 20,
    "warehouseAllocations": [
      { "warehouseCode": "WH-NORTH", "allocatedUnits": 12 },
      { "warehouseCode": "WH-SOUTH", "allocatedUnits": 8 }
    ]
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000021"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/lending/disburse',
    summary: {
      en: 'Disburse commercial loan with risk gate & double-disbursement guard',
      vi: 'Giải ngân khoản vay thương mại với chốt chặn rủi ro & chống giải ngân đúp',
      ja: '与信スコアゲートと多重実行防止付き融資実行',
      zh: '商用贷款放款审核（风控门禁与防重复放款并发锁）',
    },
    description: {
      en: 'Evaluates applicant credit score >= 600, enforces APPROVED state, and uses pessimistic locking to eliminate concurrent double disbursement.',
      vi: 'Thẩm định điểm tín dụng >= 600, yêu cầu trạng thái APPROVED, và khóa bi quan chống giải ngân 2 lần cho cùng 1 khoản vay.',
      ja: '信用スコア600以上を自動検証し、同時並行実行による二重送金を悲観的ロックで完全に防ぎます。',
      zh: '自动拦截信用分<600的高危借款，并在状态变更为DISBURSED前施加并发锁，杜绝双重出款。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "loanApplicationId": "0194e1a0-0000-7000-8000-000000000022",
  "disbursementAccount": "ACC-998877",
  "disbursementAmount": 50000.00
}`,
    responseSample: `{
  "code": 200,
  "data": {
    "loanReferenceCode": "LOAN-0194E1A0",
    "disbursementReference": "DISB-1794028000000",
    "disbursedAmount": 50000.00,
    "disbursementStatus": "DISBURSED"
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000022"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/subscription/change-plan',
    summary: {
      en: 'Modify SaaS plan tier with active billing synchronization lock',
      vi: 'Thay đổi gói SaaS với khóa đồng bộ hóa chu kỳ thanh toán',
      ja: '請求処理排他ロック付きSaaSサブスクリプションプラン変更',
      zh: '变更SaaS订阅套餐（扣费周期互斥锁与状态不可逆保护）',
    },
    description: {
      en: 'Locks subscription modifications while automated billing cycles are in progress (SUSPENDED), preventing billing fraud.',
      vi: 'Khóa sửa đổi khi chu kỳ thanh toán tự động đang diễn ra (SUSPENDED), ngăn chặn gian lận cước.',
      ja: '定期自動課金処理中（SUSPENDED）のアカウント変更を拒否し、請求の不整合を防ぎます。',
      zh: '在定时计费周期进行中（SUSPENDED）自动锁定套餐变更请求，杜绝账单错乱与资费套利。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "subscriptionId": "0194e1a0-0000-7000-8000-000000000023",
  "targetTier": "ENTERPRISE",
  "allowProratedRefund": false
}`,
    responseSample: `{
  "code": 200,
  "data": {
    "contractCode": "SUB-0194E1A0",
    "previousTier": "PRO",
    "newTier": "ENTERPRISE",
    "changeStatus": "CHANGED"
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000023"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/flash-sale/buy',
    summary: {
      en: 'Atomic flash-sale purchase with 0 overselling guarantee',
      vi: 'Mua hàng Flash-sale nguyên tử cam kết 0 bán khống',
      ja: 'オーバーセル（在庫超過販売）ゼロ保証のアトミックフラッシュセール購入',
      zh: '秒杀大促原子抢购（绝对零超卖与极速悲观互斥保证）',
    },
    description: {
      en: 'Resolves race condition under hundreds of concurrent users competing for the last stock unit without overselling.',
      vi: 'Giải quyết tranh chấp khi hàng trăm người tranh mua 1 món hàng cuối cùng, đảm bảo đúng 1 người mua được.',
      ja: '最後の1個を巡る数百人の同時アクセスに対し、悲観的排他ロックで100%の在庫整合性を保ちます。',
      zh: '针对数百人同时秒杀最后1件库存的严苛高频争抢，确保不多扣1件、不少扣1件。',
    },
    requiredRole: 'ROLE_USER',
    requestBodySample: `{
  "stockId": "0194e1a0-0000-7000-8000-000000000024",
  "buyerEmail": "flashbuyer@example.com",
  "quantity": 1
}`,
    responseSample: `{
  "code": 200,
  "data": { "stockSkuCode": "SKU-FLASHSALE-001", "availableQuantity": 0 },
  "traceId": "0194e1a0-1234-7000-8000-000000000024"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/wallet/transfer',
    summary: {
      en: 'Deterministic double-entry ledger fund transfer with platform fee credit',
      vi: 'Chuyển tiền sổ cái kép kế toán tài chính bảo toàn số dư & phí sàn',
      ja: '複式簿記台帳資金移動（残高保存則とプラットフォーム手数料自動振替）',
      zh: '双向复式记账法银行转账（资金绝对守恒与平台抽成自动化）',
    },
    description: {
      en: 'Executes concurrent double-entry balance transfer with strict debit/credit balance conservation and deadlock ordering.',
      vi: 'Chuyển tiền sổ cái kép với cam kết tổng tài sản bảo toàn, phòng chống âm tài khoản và triệt tiêu deadlock.',
      ja: '残高の借方・貸方整合性を維持し、デッドロック防止の順序制御付きで資金を移動します。',
      zh: '遵循严格借贷平衡定理，杜绝透支与死锁，并在单笔事务内完成手续费划扣。',
    },
    requiredRole: 'ROLE_ADMIN',
    requestBodySample: `{
  "sourceAccountNumber": "ACC-SRC-1001",
  "destinationAccountNumber": "ACC-DST-2002",
  "amount": 250.00,
  "currency": "USD"
}`,
    responseSample: `{
  "code": 200,
  "data": {
    "transferReference": "TRF-0194E1A0",
    "sourceAccountNumber": "ACC-SRC-1001",
    "destinationAccountNumber": "ACC-DST-2002",
    "transferredAmount": 250.00,
    "platformFeeDeducted": 5.00,
    "status": "SETTLED"
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000025"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/advanced-business/cart/checkout',
    summary: {
      en: 'Idempotent shopping cart checkout with duplicate submission guard',
      vi: 'Thanh toán giỏ hàng đảm bảo tính lũy thừa chống nhấn đúp',
      ja: '重複送信耐性を持つ冪等（Idempotent）ショッピングカートチェックアウト',
      zh: '具备幂等性保障的购物车极速结算（容忍重复点击与网络重发）',
    },
    description: {
      en: 'Tolerates network retries and double clicks using X-Idempotency-Key headers without creating duplicate orders.',
      vi: 'Chấp nhận retry mạng và nhấn đúp nhiều lần qua X-Idempotency-Key mà không sinh đơn hàng trùng lặp.',
      ja: 'X-Idempotency-Keyヘッダーにより、ブラウザの連打やネットワーク再送時にも単一注文のみを生成します。',
      zh: '基于X-Idempotency-Key严格去重，即便用户连续疯狂狂点，系统永远只落地一份唯一订单。',
    },
    requiredRole: 'ROLE_USER',
    requestBodySample: `{
  "cartId": "0194e1a0-0000-7000-8000-000000000026",
  "idempotencyKey": "IDEMP-CART-9988",
  "buyerEmail": "shopper@example.com",
  "shippingAddress": "123 Silicon Valley Road",
  "expectedTotalAmount": 349.99
}`,
    responseSample: `{
  "code": 201,
  "message": "Resource created successfully",
  "data": { "orderCode": "ORD-1794028000000", "orderStatus": "PAID" },
  "traceId": "0194e1a0-1234-7000-8000-000000000026"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/group-by',
    summary: {
      en: 'Multi-dimensional BI group-by analytics & aggregations',
      vi: 'Phân tích thống kê tổng hợp đa chiều theo nhóm (BI Group-By Analytics)',
      ja: '多次元BIグループ化集計・アナリティクス',
      zh: '多维商业智能分组统计聚合分析（BI Group-By Analytics）',
    },
    description: {
      en: 'Computes grouped counts and numeric aggregations across arbitrary entity attributes without loading rows into JVM heap.',
      vi: 'Tính toán đếm và tổng hợp số học theo bất kỳ trường phân nhóm nào ở tầng SQL mà không nạp bản ghi vào JVM heap.',
      ja: '行ペイロードをJVMヒープへロードせず、指定フィールドごとにグループ化したリアルタイム集計を実行します。',
      zh: '在数据库层按任意属性执行分组聚合指标计算，无需加载完整数据行负载至 JVM 堆。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "message": "Operation completed successfully",
  "data": [
    { "groupKey": "ACTIVE", "count": 14900, "sum": 1824500.00 },
    { "groupKey": "DRAFT", "count": 520, "sum": 41200.00 }
  ],
  "traceId": "0194e1a0-1234-7000-8000-000000000027",
  "timestamp": "2026-11-07T12:00:00Z"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/system/customizers',
    summary: {
      en: '7 Core Spring Ecosystem Customizer Groups Telemetry (plus standalone StorageCustomizer SPI)',
      vi: 'Telemetry chẩn đoán 7 nhóm Customizer SPI lõi của Spring Ecosystem (+ StorageCustomizer)',
      ja: 'Springエコシステム7大コアカスタマイザSPI診断テレメトリ（＋StorageCustomizer）',
      zh: 'Spring 生态 7 大核心自定义器 SPI 遥测诊断（另配 StorageCustomizer）',
    },
    description: {
      en: 'Inspects all 7 Core Spring Ecosystem Customizer groups (Core, AI/Platform, Security, Data, Cloud, Messaging, Architecture) managed by SpringEcosystemCustomizerRegistryHelper (StorageCustomizer runs via StorageCustomizerRegistryHelper).',
      vi: 'Trả về CustomizerRegistrySummaryDto thống kê 7 nhóm Customizer lõi (Core, AI/Platform, Security, Data, Cloud, Messaging, Architecture) qua SpringEcosystemCustomizerRegistryHelper.',
      ja: 'SpringEcosystemCustomizerRegistryHelper が管理する7大コアグループの登録ビーン数を返却します（StorageCustomizer は独立管理）。',
      zh: '通过 SpringEcosystemCustomizerRegistryHelper 查询 7 大核心生态分组的实时注册数量统计（StorageCustomizer 由 StorageCustomizerRegistryHelper 独立管理）。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "coreCustomizerCount": 1,
    "platformAiCustomizerCount": 1,
    "securityCustomizerCount": 1,
    "dataCustomizerCount": 1,
    "cloudCustomizerCount": 1,
    "messagingCustomizerCount": 1,
    "architectureCustomizerCount": 1,
    "totalCustomizerCount": 7
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000028",
  "timestamp": "2026-11-07T12:00:00Z"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/schema/typescript',
    summary: {
      en: 'Export clean, strongly-typed TypeScript interface definition',
      vi: 'Xuất định nghĩa TypeScript interface chuẩn kiểu dữ liệu cho Frontend',
      ja: 'フロントエンド向けの高精度TypeScriptインターフェース定義の動的出力',
      zh: '动态导出面向前端的高精度强类型TypeScript接口定义',
    },
    description: {
      en: 'Reflects the JPA Entity and generates a ready-to-use TypeScript interface with proper type mappings (string, number, boolean, Array).',
      vi: 'Tự động phản xạ thực thể JPA và sinh định nghĩa TypeScript interface hoàn chỉnh (string, number, boolean, Array) sẵn sàng copy sang Frontend.',
      ja: 'JPAエンティティを動的にリフレクションし、適切な型マッピングを備えたTypeScriptインターフェースを出力します。',
      zh: '深度内省JPA实体属性并自动生成具备完整类型映射的TypeScript接口，前端可直接导入使用。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `/**
 * TypeScript interface definition for CommercialProduct.
 * Auto-generated by Spring-NWVMC (Java 21 LTS).
 */
export interface CommercialProduct {
  id?: string;
  productCode?: string;
  name?: string;
  price?: number;
  costPrice?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/schema/json',
    summary: {
      en: 'Export standard Draft-07 JSON Schema representation',
      vi: 'Xuất lược đồ chuẩn JSON Schema Draft-07 phục vụ validate và tích hợp',
      ja: 'バリデーションおよび統合向けの標準Draft-07 JSONスキーマ出力',
      zh: '导出符合Draft-07国际标准的JSON Schema契约定义',
    },
    description: {
      en: 'Outputs standard Draft-07 JSON Schema with properties, required fields, formats (uuid, date-time), and realistic examples.',
      vi: 'Xuất tài liệu chuẩn Draft-07 JSON Schema gồm các trường dữ liệu, danh sách bắt buộc (required), định dạng (uuid, date-time) và ví dụ mẫu.',
      ja: 'プロパティ、必須フィールド、フォーマット（uuid、date-time）、実例値を含む標準Draft-07 JSONスキーマを出力します。',
      zh: '输出完整的Draft-07 JSON Schema，包含字段类型、必填约束、语义格式与仿真样例。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": 200,
  "data": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "CommercialProduct",
    "type": "object",
    "properties": {
      "id": { "type": "string", "format": "uuid", "description": "id" },
      "productCode": { "type": "string", "description": "productCode" },
      "price": { "type": "number", "description": "price" }
    },
    "required": [ "id", "productCode", "price" ]
  },
  "traceId": "0194e1a0-1234-7000-8000-000000000030"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/health',
    summary: {
      en: 'Inspect entity controller runtime operational health & metrics',
      vi: 'Kiểm tra sức khỏe vận hành và các chỉ số runtime của Controller thực thể',
      ja: 'エンティティコントローラーのリアルタイム稼働ヘルスと診断メトリクス取得',
      zh: '检查实体控制器的实时运行健康状态与诊断指标',
    },
    description: {
      en: 'Returns real-time operational diagnostics including total table records, Java 21 Virtual Threads status, L1/L2 cache state, CloudEvents status, and active Spring SPI customizers count.',
      vi: 'Trả về thông số chẩn đoán vận hành trực tiếp gồm tổng số bản ghi trong DB, trạng thái Virtual Threads Java 21, bộ nhớ đệm L1/L2, trạng thái phát CloudEvents và số lượng Spring SPI customizers đang hoạt động.',
      ja: 'データベース内の総レコード数、Java 21仮想スレッド状態、L1/L2キャッシュ状態、CloudEvents設定、アクティブなSpring SPIカスタマイザー数を含むリアルタイム稼働診断を返却します。',
      zh: '返回实时运行诊断数据，包含数据库总记录数、Java 21虚拟线程状态、L1/L2缓存状态、CloudEvents配置及活跃Spring SPI扩展插件计数。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "entityName": "CommercialProduct",
    "basePath": "/commercialproduct",
    "status": "ACTIVE",
    "totalRecords": 15420,
    "virtualThreadsEnabled": true,
    "cacheEnabled": true,
    "cloudEventsEnabled": true,
    "activeCustomizersCount": 7,
    "timestamp": "2026-11-07T12:22:43.108Z"
  },
  "traceId": "01a1b5f6-09c6-71be-97b5-052c61088d1e",
  "timestamp": "2026-11-07T19:22:43.108"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/import/csv',
    summary: {
      en: 'Declarative bulk CSV dataset ingestion & chunked persistence',
      vi: 'Nạp tệp dữ liệu CSV hàng loạt với cơ chế phân tích RFC-4180 và lưu trữ theo khối (Chunked)',
      ja: 'RFC-4180準拠パーサーとチャンク一括永続化を備えたCSVデータインポート',
      zh: '声明式批量CSV数据集导入，支持RFC-4180规范解析与分块持久化',
    },
    description: {
      en: 'Streams and ingests RFC-4180 compliant CSV raw payloads with camelCase/snake_case header normalization, type coercion (UUID, BigDecimal, LocalDate, Instant), transaction chunking (100 rows/batch), and detailed row-level error diagnostics.',
      vi: 'Tiếp nhận dữ liệu CSV thuần tuân thủ RFC-4180, chuẩn hóa tiêu đề camelCase/snake_case, tự động ép kiểu dữ liệu (UUID, BigDecimal, LocalDate, Instant), lưu trữ theo khối giao dịch 100 bản ghi và báo cáo lỗi chi tiết từng dòng.',
      ja: 'RFC-4180準拠のCSVペイロードを解析し、ヘッダーの自動正規化、型変換（UUID、BigDecimal、LocalDate、Instant）、トランザクション分割（100行/チャンク）、行レベルの詳細エラー診断を提供します。',
      zh: '接收符合RFC-4180标准的CSV原始载荷，自动归一化camelCase/snake_case表头，智能类型转换（UUID、BigDecimal、LocalDate、Instant），以100条记录为一个事务块分块保存，并提供行级精细错误诊断。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "totalSubmitted": 1000,
    "totalProcessed": 1000,
    "successCount": 998,
    "failureCount": 2,
    "errors": [
      {
        "rowNumber": 142,
        "rawContent": "ORD-142,,INVALID_AMOUNT",
        "errorMessage": "Field 'grossAmount' parse error: For input string: 'INVALID_AMOUNT'"
      }
    ]
  },
  "traceId": "01a1b60b-611c-7625-8aa7-06540b47e947",
  "timestamp": "2026-11-07T19:46:02.006"
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/{entities}/import/jsonl',
    summary: {
      en: 'Declarative bulk JSON Lines (JSONL/NDJSON) stream ingestion & chunked persistence',
      vi: 'Nạp tệp dữ liệu dòng JSON (JSONL / NDJSON) hàng loạt với khả năng phân tích độc lập và lưu trữ phân khúc (Chunked)',
      ja: 'JSON Lines（JSONL/NDJSON）ストリームの高速行解析とチャンク永続化を備えた一括インポート',
      zh: '声明式批量JSON Lines（JSONL/NDJSON）流式数据导入，支持逐行解析与分块持久化',
    },
    description: {
      en: 'Ingests high-throughput JSON Lines payloads (application/x-ndjson, application/jsonl) where each line represents an independent JSON entity instance. Ignores comments (#) and blanks, isolates malformed rows with line indices, and persists valid records in transactions of 100.',
      vi: 'Tiếp nhận luồng dữ liệu JSON Lines nhịp cao (application/x-ndjson, application/jsonl) với mỗi dòng là một thực thể JSON hoàn chỉnh. Tự động bỏ qua comment (#) và dòng trống, cô lập lỗi từng dòng kèm chỉ số dòng và lưu trữ theo khối 100 bản ghi/lô.',
      ja: '各行が独立したJSONエンティティを表す高スループットのJSON Linesペイロード（application/x-ndjson、application/jsonl）を処理します。コメント（#）や空白行をスキップし、不正な行を行番号付きで分離し、100件単位のトランザクションで永続化します。',
      zh: '接收高吞吐量JSON Lines数据载荷（application/x-ndjson、application/jsonl），每行表示一个独立的JSON实体。自动跳过注释行（#）与空行，对格式错误的单行进行行号精准隔离，以100条记录为一个事务块分块保存。',
    },
    requiredRole: 'ROLE_ADMIN',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "totalSubmitted": 2000,
    "totalProcessed": 2000,
    "successCount": 1999,
    "failureCount": 1,
    "errors": [
      {
        "rowIndex": 501,
        "fieldName": "payload",
        "errorCode": "error.validation.failed",
        "errorMessage": "Unexpected character ('}' (code 125)): was expecting double-quote to start field name"
      }
    ]
  },
  "traceId": "01a1b61c-6a58-7745-95bf-85987eab1e2e",
  "timestamp": "2026-11-07T20:04:38.734"
}`,
  },
  {
    method: 'PATCH',
    path: '/api/v1/{entities}/{id}/patch-rfc6902',
    summary: {
      en: 'Declarative RFC 6902 JSON Patch atomic operations with precondition evaluation',
      vi: 'Cập nhật vi mô nguyên tử theo chuẩn quốc tế RFC 6902 JSON Patch có xác thực điều kiện tiên quyết (Precondition)',
      ja: '事前条件アサーションを備えたRFC 6902準拠JSON Patchアトミック更新',
      zh: '符合RFC 6902国际标准的声明式JSON Patch原子级微更新，支持先验条件断言',
    },
    description: {
      en: 'Executes standard RFC 6902 operations (replace, test, copy, move, remove, add) on target entity attributes. Rejects mutations with HTTP 412 Precondition Failed when test operations fail, ensuring optimistic concurrency integrity.',
      vi: 'Thực thi các thao tác nguyên tử theo chuẩn RFC 6902 (replace, test, copy, move, remove, add) trên từng thuộc tính của thực thể. Tự động trả về HTTP 412 Precondition Failed nếu điều kiện test không thỏa mãn, đảm bảo tính toàn vẹn tranh chấp lạc quan.',
      ja: '対象エンティティ属性に対して標準RFC 6902操作（replace、test、copy、move、remove、add）を実行します。test操作が不一致の場合はHTTP 412 Precondition Failedで即座に拒否し、楽観的並行性の完全性を保護します。',
      zh: '在目标实体属性上执行标准RFC 6902原子操作（replace、test、copy、move、remove、add）。当test测试操作不匹配时自动返回HTTP 412 Precondition Failed，严格保障乐观并发的数据一致性。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "id": "01a1b622-cfc0-713d-9272-48f5095d15b5",
    "name": "After RFC6902 Patch",
    "status": "ACTIVE",
    "updatedAt": "2026-11-07T13:11:37.319Z"
  },
  "traceId": "01a1b622-cfc0-713d-9272-48f5095d15b5",
  "timestamp": "2026-11-07T20:11:37.319"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/export/jsonl',
    summary: {
      en: 'Stream high-performance JSON Lines (JSONL / NDJSON) with O(1) memory overhead',
      vi: 'Xuất dữ liệu dòng JSON Lines (JSONL / NDJSON) streaming hiệu năng cao với chi phí bộ nhớ O(1)',
      ja: 'メモリ負荷O(1)の高性能JSON Lines（JSONL / NDJSON）ストリーミングエクスポート',
      zh: 'O(1)内存开销的高性能JSON Lines（JSONL / NDJSON）流式导出',
    },
    description: {
      en: 'Streams matching entity records directly into the HTTP response as newline-delimited JSON objects (application/x-ndjson). Ideal for Big Data pipelines, ELK ingestion, AI vector embeddings, and Databricks lakehouses without heap memory bloat.',
      vi: 'Đẩy trực tiếp các bản ghi thực thể khớp điều kiện truy vấn ra HTTP response dưới dạng các đối tượng JSON phân tách bởi dấu xuống dòng (application/x-ndjson). Hoàn hảo cho Data Pipeline, ELK, AI Vector Store, Databricks mà không gây phình bộ nhớ heap.',
      ja: 'クエリ条件に一致するエンティティレコードを、改行区切りJSON（application/x-ndjson）としてHTTPレスポンスに直接ストリーミングします。ビッグデータパイプライン、ELK、AIベクトル検索、レイクハウス連携に最適です。',
      zh: '将符合查询条件的实体记录以换行符分隔的JSON对象（application/x-ndjson）直接流式推送到HTTP响应。极为适合大数据管道、ELK日志分析、AI向量数据库和湖仓一体集成，杜绝堆内存膨胀。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{"id":"01a1b636-71dd-73f0-ae9e-97f0041405ec","orderCode":"ORD-2026-001","customerName":"Alice","status":"ACTIVE","totalAmount":250.00}
{"id":"01a1b636-71dd-73f0-ae9e-97f0041405ed","orderCode":"ORD-2026-002","customerName":"Bob","status":"COMPLETED","totalAmount":1850.50}
{"id":"01a1b636-71dd-73f0-ae9e-97f0041405ee","orderCode":"ORD-2026-003","customerName":"Charlie","status":"PROCESSING","totalAmount":420.00}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/{id}/diff',
    summary: {
      en: 'Declarative entity state comparison and scalar difference inspection',
      vi: 'So sánh khác biệt vi mô giữa 2 bản ghi hoặc trạng thái thực thể (Diff Engine)',
      ja: '2つのエンティティインスタンス間の宣言的状態差分比較（Diffエンジン）',
      zh: '两个实体实例之间的声明式细粒度状态差异比对（Diff引擎）',
    },
    description: {
      en: 'Reflectively inspects scalar property discrepancies between source {id} and targetId. Classifies field modifications into MODIFIED, ADDED, and REMOVED without heap memory bloat.',
      vi: 'So sánh phản xạ các trường vô hướng giữa thực thể nguồn {id} và targetId. Phân loại biến động thành MODIFIED, ADDED và REMOVED phục vụ kiểm toán và phê duyệt trạng thái.',
      ja: 'ソースエンティティ {id} と targetId の全スカラー属性をリフレクション比較します。差分を MODIFIED、ADDED、REMOVED に自動分類し、監査・承認ワークフローを支援します。',
      zh: '基于反射对源实体 {id} 与 targetId 的标量字段执行全量比对。将属性级变更精准归类为 MODIFIED、ADDED 或 REMOVED，全面赋能业务审批与历史审计。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "sourceId": "01a1b643-9e59-7278-9d74-f4c0752141ec",
    "targetId": "01a1b643-b55d-7976-a02f-f9f568771670",
    "entityName": "CustomerOrder",
    "totalDifferences": 2,
    "differences": [
      {
        "fieldName": "totalAmount",
        "oldValue": "100.00",
        "newValue": "250.00",
        "changeType": "MODIFIED"
      },
      {
        "fieldName": "status",
        "oldValue": "PENDING",
        "newValue": "PROCESSING",
        "changeType": "MODIFIED"
      }
    ],
    "evaluatedAt": "2026-11-07T13:47:39.195Z"
  },
  "traceId": "01a1b643ccf97d96a0e4b0491f392327",
  "timestamp": "2026-11-07T20:47:39.195"
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/{entities}/{id}/**',
    summary: {
      en: 'Arbitrary-depth nested sub-resource navigation with dynamic filtering',
      vi: 'Điều hướng quan hệ phân cấp đa cấp không giới hạn kết hợp bộ lọc động',
      ja: '動的フィルタリングを備えた無制限階層ネストサブリソースナビゲーション',
      zh: '支持完整动态过滤的无限制任意深度嵌套子资源导航引擎',
    },
    description: {
      en: 'Recursively navigates 1-N, N-1, and N-N entity relationship hierarchies to arbitrary depths (e.g. /orders/{id}/items, /orders/{id}/items/{itemId}, /orders/{id}/items/{itemId}/logs). Collections support all 13 dynamic filter operators, sorting, pagination, and breadcrumb path inspection.',
      vi: 'Duyệt đệ quy cây quan hệ 1-N, N-1, N-N không giới hạn độ sâu (ví dụ: /orders/{id}/items, /orders/{id}/items/{itemId}, /orders/{id}/items/{itemId}/logs). Tự động hỗ trợ 13 toán tử lọc động, sắp xếp, phân trang an toàn và đường dẫn breadcrumb.',
      ja: '1-N、N-1、N-N エンティティリレーションシップ階層を任意の深さまで再帰的にナビゲートします（例: /orders/{id}/items/{itemId}/logs）。コレクションは13種類の動的フィルタ演算子、ソート、安全なページネーション、ブレッドクラム追跡を完全サポートします。',
      zh: '无限制递归遍历 1-N、N-1 及 N-N 实体关联层级到任意深度（如 /orders/{id}/items/{itemId}/logs）。嵌套集合全面支持 13 种动态过滤运算符、多字段排序、安全分页与面包屑溯源。',
    },
    requiredRole: 'ROLE_USER',
    responseSample: `{
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": {
    "leafType": "COLLECTION",
    "breadcrumb": "CustomerOrder[01a1b669-7036-79c0-9a57-b1285097fdb5] -> items",
    "page": {
      "content": [
        {
          "id": "01a1b669-7036-79c0-9a57-b1285097fdb7",
          "productName": "Ergonomic Mechanical Keyboard",
          "quantity": 2,
          "unitPrice": 149.99,
          "subTotal": 299.98
        }
      ],
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "traceId": "01a1b66a-2000-7000-8000-000000000001",
  "timestamp": "2026-11-07T14:34:25.000"
}`,
  },
];

