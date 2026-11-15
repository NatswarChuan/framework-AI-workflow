import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Phản Hồi Xung Đột HTTP 409 CONFLICT (DistributedLockAcquisitionException)',
    en: 'Deterministic HTTP 409 Conflict (DistributedLockAcquisitionException)',
    ja: '競合時の HTTP 409 CONFLICT 応答 (DistributedLockAcquisitionException)',
    zh: '严格 HTTP 409 冲突拦截 (DistributedLockAcquisitionException)',
  },
  h1: {
    vi: '1. Thuộc Tính Chú Thích @DistributedLock (DistributedLockConstant)',
    en: '1. @DistributedLock Attributes & SpEL AST Caching',
    ja: '1. @DistributedLock 属性仕様＆SpEL ASTキャッシュ',
    zh: '1. @DistributedLock 注解属性与 SpEL AST 缓存机制',
  },
  colAttr: { vi: 'Thuộc tính', en: 'Attribute', ja: '属性名', zh: '属性名' },
  colType: { vi: 'Kiểu', en: 'Type', ja: '型', zh: '类型' },
  colDef: { vi: 'Mặc định', en: 'Default', ja: '既定値', zh: '默认值' },
  colDesc: { vi: 'Mô tả', en: 'Description', ja: '説明', zh: '说明' },
  dKey: {
    vi: 'Biểu thức SpEL định danh tài nguyên (AST lưu trong SPEL_EXPRESSION_CACHE tối đa 1024 mục).',
    en: 'SpEL lock key expression (parsed ASTs cached in DistributedLockConstant.SPEL_EXPRESSION_CACHE, max 1024).',
    ja: 'SpELリソース識別式（構文木は SPEL_EXPRESSION_CACHE に最大1024件キャッシュ）。',
    zh: '识别锁资源的 SpEL 表达式（语法树缓存在 SPEL_EXPRESSION_CACHE，上限 1024 条）。',
  },
  dWait: {
    vi: 'Thời gian chờ tối đa (ms) trước khi DistributedLockManagerHelper ném DistributedLockAcquisitionException (HTTP 409).',
    en: 'Maximum wait duration in ms before DistributedLockManagerHelper throws DistributedLockAcquisitionException (HTTP 409).',
    ja: 'HTTP 409 (DistributedLockAcquisitionException) を送出するまでの最大待機時間（ミリ秒）。',
    zh: '竞争失败抛出 DistributedLockAcquisitionException (HTTP 409) 前的最大等待毫秒数。',
  },
  dLease: {
    vi: 'Thời gian giữ khóa tối đa (ms) trước khi tự động giải phóng chống deadlock.',
    en: 'Lease expiry TTL in ms preventing stale deadlock locks when a caller crashes.',
    ja: 'デッドロック防止のための自動ロック解放 TTL（ミリ秒）。',
    zh: '防死锁最大租约有效毫秒数，到期自动释放。',
  },
  h2: {
    vi: '2. Khóa Trừ Tồn Kho Trong @AutoComponent Helper',
    en: '2. Inventory Deduction Guard in @AutoComponent Helper',
    ja: '2. @AutoComponent Helper での在庫引き当て保護',
    zh: '2. 在独立 @AutoComponent Helper 中保护库存扣减',
  },
  p2: {
    vi: 'Đính kèm @DistributedLock trên phương thức public của @AutoComponent Helper thay vì Controller hoặc private method:',
    en: 'Place @DistributedLock on public methods of @AutoComponent Helper classes guarded by DistributedLockAspect:',
    ja: '@DistributedLockAspect によるインターセプトのため、@AutoComponent Helper の public メソッドへ付与します：',
    zh: '将 @DistributedLock 标注在 @AutoComponent Helper 的 public 方法上，由 DistributedLockAspect 切面拦截：',
  },
  h3: {
    vi: '3. Khóa Tài Khoản Nguồn Giao Dịch Sổ Kép',
    en: '3. Double-Entry Account Ledger Lock',
    ja: '3. 二重仕訳口座の排他ロック例',
    zh: '3. 双分录资金转账源账户加锁样例',
  },
  p3: {
    vi: 'Khóa theo #request.sourceAccountId giúp loại trừ race condition khi nhiều kênh giao dịch đồng thời:',
    en: 'Partition lock scope by #request.sourceAccountId to serialize concurrent withdrawals on the same ledger:',
    ja: '#request.sourceAccountId をキーにすることで、同一口座への並行出金競合を排除します：',
    zh: '按 #request.sourceAccountId 分片加锁，序列化同一账户的并发扣款请求：',
  },
};

export const DistributedLockPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-rose">Concurrency Guard</span>
        <span className="badge badge-amber">@DistributedLock</span>
        <span className="badge badge-emerald">DistributedLockAspect</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Khóa Phân Tán Declarative (@DistributedLock)'}
        {currentLang === 'en' && 'Declarative Distributed Locks (@DistributedLock)'}
        {currentLang === 'ja' && '宣言的分散ロック (@DistributedLock)'}
        {currentLang === 'zh' && '声明式分布式锁机制 (@DistributedLock)'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Chặn Race Condition và Over-Booking thông qua @DistributedLock, DistributedLockAspect và DistributedLockManagerHelper với SpEL key AST cache (MAX_SPEL_CACHE_SIZE = 1024).'}
        {currentLang === 'en' &&
          'Eliminate race conditions and inventory overselling via @DistributedLock, DistributedLockAspect, and DistributedLockManagerHelper backed by cached SpEL AST key resolution.'}
        {currentLang === 'ja' &&
          'ASTキャッシュ付きSpELキー解決を行う @DistributedLock、DistributedLockAspect、DistributedLockManagerHelper により競合状態と過剰販売を防止します。'}
        {currentLang === 'zh' &&
          '借助缓存 SpEL AST 解析结果的 @DistributedLock、DistributedLockAspect 与 DistributedLockManagerHelper 彻底消除竞态与超卖。'}
      </p>

      <Callout type="warning" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'Khi quá waitTimeMs (mặc định 3000L ms), DistributedLockManagerHelper ném DistributedLockAcquisitionException với mã error.distributed_lock.acquired_failed và HTTP 409 CONFLICT.'}
        {currentLang === 'en' &&
          'Exceeding waitTimeMs (default 3000L ms) triggers DistributedLockAcquisitionException (error.distributed_lock.acquired_failed) mapped to HTTP 409 CONFLICT.'}
        {currentLang === 'ja' &&
          'waitTimeMs（既定 3000L ms）を超過すると DistributedLockAcquisitionException（HTTP 409 CONFLICT）が送出されます。'}
        {currentLang === 'zh' &&
          '等待超过 waitTimeMs（默认 3000L 毫秒）将抛出 DistributedLockAcquisitionException（错误码 error.distributed_lock.acquired_failed，HTTP 409 CONFLICT）。'}
      </Callout>

      <h2 id="annotation-attributes" className="section-heading">{TXT.h1[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>{TXT.colAttr[currentLang]}</th>
            <th>{TXT.colType[currentLang]}</th>
            <th>{TXT.colDef[currentLang]}</th>
            <th>{TXT.colDesc[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>key</code></td>
            <td><code>String</code></td>
            <td><code>""</code></td>
            <td>{TXT.dKey[currentLang]}</td>
          </tr>
          <tr>
            <td><code>waitTimeMs</code></td>
            <td><code>long</code></td>
            <td><code>3000L</code></td>
            <td>{TXT.dWait[currentLang]}</td>
          </tr>
          <tr>
            <td><code>leaseTimeMs</code></td>
            <td><code>long</code></td>
            <td><code>5000L</code></td>
            <td>{TXT.dLease[currentLang]}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="usage-example" className="section-heading">{TXT.h2[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p2[currentLang]}</p>

      <CodeBlock
        language="java"
        fileName="helper/InventoryReservationHelper.java"
        code={`@Slf4j
@AutoComponent
public final class InventoryReservationHelper {

  @DistributedLock(
      key = "'LOCK:INVENTORY:' + #productId",
      waitTimeMs = 2000L,
      leaseTimeMs = 5000L
  )
  public InventoryReservationResult reserveStock(final UUID productId, final int quantity) {
    return InventoryReservationResult.builder()
        .productId(productId)
        .reservedQuantity(quantity)
        .status("RESERVED")
        .build();
  }
}`}
      />

      <h2 id="double-entry-transfer" className="section-heading">{TXT.h3[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p3[currentLang]}</p>

      <CodeBlock
        language="java"
        fileName="helper/BankLedgerTransferHelper.java"
        code={`@AutoComponent
@RequiredArgsConstructor
public final class BankLedgerTransferHelper {

  private final TransferProcessingService transferProcessingService;

  @DistributedLock(
      key = "'LOCK:ACCOUNT:' + #request.sourceAccountId",
      waitTimeMs = 5000L,
      leaseTimeMs = 10000L
  )
  public TransferReceipt executeTransfer(final TransferRequestDto request) {
    return transferProcessingService.processLedgerEntries(request);
  }
}`}
      />
    </div>
  );
};
