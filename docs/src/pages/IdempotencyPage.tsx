import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Hai Lớp Kiểm Soát: @Idempotent (AOP) & IdempotencyManagerHelper (SHA-256)',
    en: 'Two-Layer Enforcement: @Idempotent AOP & IdempotencyManagerHelper SHA-256 Check',
    ja: '二層防衛：@Idempotent AOP ＆ IdempotencyManagerHelper SHA-256 検証',
    zh: '双重幂等保障：@Idempotent AOP 切面与 IdempotencyManagerHelper SHA-256 校验',
  },
  calloutBody: {
    vi: 'Annotation @Idempotent cung cấp 2 thuộc tính: headerName (mặc định "X-Idempotency-Key") và ttlSeconds (mặc định 300L), được IdempotencyAspect chặn qua Caffeine L1 (ConflictBusinessException HTTP 409). Khi cần băm SHA-256 thân JSON và replay response HIT/422, gọi IdempotencyManagerHelper.evaluateIdempotency(key, rawPayload, ttlSeconds).',
    en: 'Annotation @Idempotent exposes headerName (default "X-Idempotency-Key") and ttlSeconds (default 300L), intercepted by IdempotencyAspect via bounded Caffeine cache (HTTP 409 ConflictBusinessException on concurrent or TTL duplicates). For SHA-256 payload digest validation and cached HIT replay / HTTP 422 mismatch blocking, invoke IdempotencyManagerHelper.evaluateIdempotency.',
    ja: '@Idempotent は headerName と ttlSeconds（既定 300L）を提供し、IdempotencyAspect が Caffeine で重複・同時実行を HTTP 409 で遮断します。ペイロード SHA-256 整合性検証（HTTP 422）とキャッシュ済み応答再利用（HIT）には IdempotencyManagerHelper.evaluateIdempotency を利用します。',
    zh: '@Idempotent 注解包含 headerName 与 ttlSeconds（默认 300L）两个属性，由 IdempotencyAspect 基于 Caffeine 缓存拦截重复与并发请求（HTTP 409）；若需校验请求体 SHA-256 指纹（不匹配抛 HTTP 422）及重放已缓存响应，可直接注入调用 IdempotencyManagerHelper.evaluateIdempotency。',
  },
  h1: {
    vi: '1. Khai Báo @Idempotent & Sử Dụng IdempotencyManagerHelper',
    en: '1. Declaring @Idempotent & Invoking IdempotencyManagerHelper',
    ja: '1. @Idempotent 宣言と IdempotencyManagerHelper の併用',
    zh: '1. 声明 @Idempotent 注解与调用 IdempotencyManagerHelper',
  },
  h2: {
    vi: '2. Quy Chuẩn Tiêu Đề & Hằng Số (IdempotentConstant)',
    en: '2. Headers & Status Constants (IdempotentConstant)',
    ja: '2. ヘッダー＆ステータス定数 (IdempotentConstant)',
    zh: '2. 请求/响应头与状态常量规范 (IdempotentConstant)',
  },
  colHdr: { vi: 'Header / Trạng Thái', en: 'Header / Status', ja: 'ヘッダー / 状態', zh: '标头 / 状态值' },
  colVal: { vi: 'Giá Trị', en: 'Value', ja: '値', zh: '字段值' },
  colDesc: { vi: 'Ý Nghĩa', en: 'Behavior', ja: '動作仕様', zh: '行为说明' },
  rKey: {
    vi: 'Mã khóa định danh duy nhất từ client trong yêu cầu ghi.',
    en: 'Client-supplied unique request token passed via X-Idempotency-Key.',
    ja: 'クライアントが送信する一意の冪等性キー。',
    zh: '客户端在写请求中携带的唯一幂等性键。',
  },
  rMiss: {
    vi: 'Yêu cầu hợp lệ lần đầu được phép thực thi và ghi nhận.',
    en: 'First-time valid execution recorded in cache store.',
    ja: '初回実行として許可・記録された状態。',
    zh: '首次合法请求，允许执行并写入记录。',
  },
  rHit: {
    vi: 'Phát hiện lặp lại trùng SHA-256: trả lại responseBody đã lưu không chạy lại logic ghi.',
    en: 'Repeated identical SHA-256 payload within TTL: replays cached response safely.',
    ja: '同一 SHA-256 ペイロードの再送を検知し、保存済みレスポンスを再返却。',
    zh: '检测到相同 SHA-256 负载重试：直接返回已缓存结果而不重复落库。',
  },
  rProc: {
    vi: 'Yêu cầu cùng khóa đang thực thi song song trên luồng khác (HTTP 409 CONFLICT).',
    en: 'In-flight sentinel indicating another request holds the same key concurrently (HTTP 409).',
    ja: '同一キーの別リクエストが現在実行中（HTTP 409 CONFLICT）。',
    zh: '另一并发线程正在处理同一幂等键（直接拦截并返回 HTTP 409）。',
  },
  h3: {
    vi: '3. Mã Lỗi Xung Đột & Bất Tương Thích (AopConstant & IdempotentConstant)',
    en: '3. Standardized Conflict & Integrity Errors (HTTP 400 / 409 / 422)',
    ja: '3. 標準化エラーコード仕様 (HTTP 400 / 409 / 422)',
    zh: '3. 标准化冲突与载荷校验异常 (HTTP 400 / 409 / 422)',
  },
  c400: {
    vi: 'Thiếu hoặc để trống X-Idempotency-Key khi gọi IdempotencyManagerHelper.evaluateIdempotency.',
    en: 'Missing or blank X-Idempotency-Key passed to IdempotencyManagerHelper.evaluateIdempotency.',
    ja: 'evaluateIdempotency 呼び出し時に X-Idempotency-Key が未指定または空の場合。',
    zh: '调用 IdempotencyManagerHelper.evaluateIdempotency 时缺少或为空键。',
  },
  c409: {
    vi: 'Hai luồng gửi trùng khóa đồng thời (in-flight) hoặc trùng lặp trong thời gian TTL qua @Idempotent AOP.',
    en: 'Concurrent in-flight duplicate or replay within TTL detected by IdempotencyAspect or evaluateIdempotency.',
    ja: '同一キーの同時実行競合または TTL 内の重複実行（IdempotencyAspect / Helper）。',
    zh: '检测到并发处理中重复或 TTL 窗口内重复提交（IdempotencyAspect / Helper）。',
  },
  c422: {
    vi: 'Tái sử dụng khóa với nội dung JSON Payload có mã băm SHA-256 khác ban đầu (ConstantTimeComparisonUtil).',
    en: 'Idempotency key reused with a mismatched SHA-256 request digest verified via ConstantTimeComparisonUtil.',
    ja: '同一キーに対し異なる SHA-256 ペイロードハッシュが送信された場合。',
    zh: '复用已存在幂等键但请求体 SHA-256 摘要不匹配（经恒定时间比对）。',
  },
};

export const IdempotencyPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">IdempotencyAspect</span>
        <span className="badge badge-blue">IdempotencyManagerHelper</span>
        <span className="badge badge-purple">@Idempotent</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Hạ Tầng Idempotency Phân Tán (@Idempotent)'}
        {currentLang === 'en' && 'Distributed Idempotency Subsystem (@Idempotent)'}
        {currentLang === 'ja' && '分散冪等性（Idempotency）基盤 (@Idempotent)'}
        {currentLang === 'zh' && '分布式幂等性保障子系统 (@Idempotent)'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Chống gửi trùng lặp yêu cầu ghi quan trọng qua @Idempotent (IdempotencyAspect dùng Caffeine L1) và xác thực vân tay SHA-256 qua IdempotencyManagerHelper.'}
        {currentLang === 'en' &&
          'Prevent duplicate mutating operations with @Idempotent (bounded Caffeine AOP interception) combined with explicit SHA-256 payload fingerprinting in IdempotencyManagerHelper.'}
        {currentLang === 'ja' &&
          '@Idempotent（Caffeine L1 による AOP 重複遮断）と IdempotencyManagerHelper による SHA-256 整合性検証で二重実行を防ぎます。'}
        {currentLang === 'zh' &&
          '通过 @Idempotent（IdempotencyAspect Caffeine 有界缓存拦截）与 IdempotencyManagerHelper 的 SHA-256 请求体指纹校验，确保关键写操作严密幂等。'}
      </p>

      <Callout type="warning" title={TXT.calloutTitle[currentLang]}>
        {TXT.calloutBody[currentLang]}
      </Callout>

      <h2 id="idempotent-annotation" className="section-heading">{TXT.h1[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="helper/PaymentChargeExecutionHelper.java"
        code={`@AutoComponent
@RequiredArgsConstructor
public final class PaymentChargeExecutionHelper {

  private final IdempotencyManagerHelper idempotencyManagerHelper;

  @Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 86400L)
  public PaymentReceiptDto executeCharge(
      final String idempotencyKey,
      final String rawPayload,
      final PaymentChargeRequestDto request) {
    final IdempotentRecordDto cached =
        idempotencyManagerHelper.evaluateIdempotency(idempotencyKey, rawPayload, 86400L);
    if (Objects.nonNull(cached)) {
      return deserializeCached(cached.getResponseBody());
    }
    return executeAndRecord(idempotencyKey, rawPayload, request);
  }
}`}
      />

      <h2 id="idempotent-headers" className="section-heading">{TXT.h2[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>{TXT.colHdr[currentLang]}</th>
            <th>{TXT.colVal[currentLang]}</th>
            <th>{TXT.colDesc[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>X-Idempotency-Key</code></td>
            <td><code>UUIDv7 / Token</code></td>
            <td>{TXT.rKey[currentLang]}</td>
          </tr>
          <tr>
            <td><code>X-Idempotency-Status</code></td>
            <td><code>MISS</code></td>
            <td>{TXT.rMiss[currentLang]}</td>
          </tr>
          <tr>
            <td><code>X-Idempotency-Status</code></td>
            <td><code>HIT</code></td>
            <td>{TXT.rHit[currentLang]}</td>
          </tr>
          <tr>
            <td><code>X-Idempotency-Status</code></td>
            <td><code>PROCESSING</code></td>
            <td>{TXT.rProc[currentLang]}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="idempotent-errors" className="section-heading">{TXT.h3[currentLang]}</h2>
      <div className="doc-grid-3">
        <div className="doc-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h4 style={{ color: '#ef4444' }}>400 Bad Request</h4>
          <p><code>error.idempotency.key_missing</code><br />{TXT.c400[currentLang]}</p>
        </div>
        <div className="doc-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h4 style={{ color: '#f59e0b' }}>409 Conflict</h4>
          <p><code>error.idempotency.conflict</code> / <code>concurrent_processing</code><br />{TXT.c409[currentLang]}</p>
        </div>
        <div className="doc-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <h4 style={{ color: '#8b5cf6' }}>422 Unprocessable</h4>
          <p><code>error.idempotency.payload_mismatch</code><br />{TXT.c422[currentLang]}</p>
        </div>
      </div>
    </div>
  );
};
