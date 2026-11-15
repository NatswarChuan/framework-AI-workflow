import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const DistributedLockPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="distributed-lock"
        currentLang={currentLang}
        badges={[
          { label: '@DistributedLock', tone: 'amber' },
          { label: 'DistributedLockAspect', tone: 'purple' },
          { label: 'SpEL Cache (1024 ASTs)', tone: 'blue' },
        ]}
      />

      <h2 id="lock-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>@DistributedLock</code> coordinates mutually exclusive execution across horizontal nodes for critical operations such as inventory deduction or payment settlement. <code>DistributedLockAspect</code> and <code>DistributedLockManagerHelper</code> cache parsed SpEL expressions inside <code>DistributedLockConstant.SPEL_EXPRESSION_CACHE</code> (capacity <code>1024</code>) to eliminate repeated expression parsing cost under high concurrency.
      </p>

      <h2 id="lock-attrs" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Default Constant</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>key</code></td>
              <td><code>""</code> (required SpEL/literal)</td>
              <td>Lock resource expression, e.g. <code>"'ORDER_' + #orderId"</code></td>
            </tr>
            <tr>
              <td><code>waitTimeMs</code></td>
              <td><code>3000L</code> (<code>DEFAULT_WAIT_TIME_MS</code>)</td>
              <td>Maximum acquisition wait timeout before raising <code>DistributedLockAcquisitionException</code></td>
            </tr>
            <tr>
              <td><code>leaseTimeMs</code></td>
              <td><code>5000L</code> (<code>DEFAULT_LEASE_TIME_MS</code>)</td>
              <td>Maximum lock lease duration before automatic expiry prevents cluster deadlock</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="lock-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="helper/InventoryReservationHelper.java"
        highlightLines={[4, 5, 6, 7]}
        code={`@AutoComponent
public final class InventoryReservationHelper {

  @DistributedLock(
      key = "'SKU_STOCK_' + #skuCode",
      waitTimeMs = 3000L,
      leaseTimeMs = 5000L
  )
  public ReservationReceiptDto reserveStock(final String skuCode, final int qty) {
    return executeAtomicDecrement(skuCode, qty);
  }
}`}
      />

      <Callout type="note" currentLang={currentLang}>
        When contention exceeds <code>waitTimeMs</code>, callers receive HTTP 409 / 423 mapped from error code <code>error.distributed_lock.acquired_failed</code>.
      </Callout>
    </article>
  );
};
