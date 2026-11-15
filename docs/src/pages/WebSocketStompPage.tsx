import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'An Toàn Giao Dịch Sau Commit (TransactionPhase.AFTER_COMMIT)',
    en: 'Transaction-Safe Post-Commit Broadcast',
    ja: 'コミット後ブロードキャストの整合性保証',
    zh: '事务提交后安全广播（避免脏消息）',
  },
  h1: {
    vi: '1. Kênh Kết Nối WebSocket & Topic STOMP (WebSocketStompConstant)',
    en: '1. WebSocket Handshake & STOMP Broadcast Topics (WebSocketStompConstant)',
    ja: '1. WebSocket 接続先＆STOMP 配信トピック (WebSocketStompConstant)',
    zh: '1. WebSocket 握手路径与 STOMP 广播主题 (WebSocketStompConstant)',
  },
  h2: {
    vi: '2. Listener Phát Sóng Sau Commit (EntityEventWebSocketBroadcasterListener)',
    en: '2. Post-Commit Domain Event Listener (EntityEventWebSocketBroadcasterListener)',
    ja: '2. トランザクションコミット後イベント配信 (EntityEventWebSocketBroadcasterListener)',
    zh: '2. 事务提交后事件监听广播 (EntityEventWebSocketBroadcasterListener)',
  },
  p2: {
    vi: 'EntityEventWebSocketBroadcasterListener sử dụng TransactionRuntimeBridge.executeAfterCommit để gọi WebSocketEntityBroadcasterHelper chỉ sau khi giao dịch DB đã commit:',
    en: 'EntityEventWebSocketBroadcasterListener schedules WebSocketEntityBroadcasterHelper via TransactionRuntimeBridge.executeAfterCommit so rolled-back transactions never publish events:',
    ja: 'EntityEventWebSocketBroadcasterListener は TransactionRuntimeBridge.executeAfterCommit を介して WebSocketEntityBroadcasterHelper を呼び出し、ロールバック時の誤配信を防ぎます：',
    zh: 'EntityEventWebSocketBroadcasterListener 通过 TransactionRuntimeBridge.executeAfterCommit 调度 WebSocketEntityBroadcasterHelper，保证仅在事务提交后推送消息：',
  },
  h3: {
    vi: '3. Tích Hợp Client STOMP Phía Frontend (JavaScript / TypeScript)',
    en: '3. Frontend STOMP Client Integration (TypeScript)',
    ja: '3. フロントエンド STOMP クライアント連携 (TypeScript)',
    zh: '3. 前端 STOMP 客户端订阅示例 (TypeScript)',
  },
  p3: {
    vi: 'Kết nối tới /ws-connect bằng @stomp/stompjs và đăng ký các kênh /topic/{entity}/{created|updated|deleted|state-changed}:',
    en: 'Connect to /ws-connect using @stomp/stompjs and subscribe to /topic/{entity}/{created|updated|deleted|state-changed}:',
    ja: '@stomp/stompjs で /ws-connect に接続し、/topic/{entity}/{created|updated|deleted|state-changed} を購読します：',
    zh: '使用 @stomp/stompjs 连接 /ws-connect 端点并订阅 /topic/{entity}/{created|updated|deleted|state-changed} 主题：',
  },
};

export const WebSocketStompPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">Real-Time STOMP</span>
        <span className="badge badge-purple">/ws-connect</span>
        <span className="badge badge-amber">TransactionRuntimeBridge</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Hạ Tầng Real-Time WebSocket & STOMP'}
        {currentLang === 'en' && 'Real-Time WebSocket & STOMP Messaging Subsystem'}
        {currentLang === 'ja' && 'リアルタイム WebSocket & STOMP メッセージング基盤'}
        {currentLang === 'zh' && '实时 WebSocket 与 STOMP 消息子系统'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Tự động phát sóng sự kiện tạo mới, cập nhật, xóa và chuyển đổi trạng thái thực thể lên các kênh STOMP (/topic/{entity}/{created|updated|deleted|state-changed}) ngay sau khi giao dịch CSDL commit.'}
        {currentLang === 'en' &&
          'Automatically broadcasts entity lifecycle events (created, updated, deleted, state-changed) to STOMP destinations (/topic/{entity}/...) strictly after database transaction commit.'}
        {currentLang === 'ja' &&
          'DBトランザクションコミット直後に、作成・更新・削除・状態遷移ドメインイベントを STOMP トピック (/topic/{entity}/...) へ自動配信します。'}
        {currentLang === 'zh' &&
          '在数据库事务提交后自动向 STOMP 主题（/topic/{entity}/{created|updated|deleted|state-changed}）推送实体变更事件。'}
      </p>

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'Sự kiện chỉ phát đi qua TransactionRuntimeBridge.executeAfterCommit. Nếu giao dịch bị rollback, không có sự kiện giả nào bị rò rỉ ra WebSocket.'}
        {currentLang === 'en' &&
          'Events dispatch inside TransactionRuntimeBridge.executeAfterCommit. Rolled-back transactions emit zero phantom WebSocket frames.'}
        {currentLang === 'ja' &&
          'TransactionRuntimeBridge.executeAfterCommit 内でのみ送信されるため、ロールバック発生時の誤送信は完全にゼロです。'}
        {currentLang === 'zh' &&
          '广播严格在 TransactionRuntimeBridge.executeAfterCommit 回调中执行，事务回滚绝不推送脏事件。'}
      </Callout>

      <h2 id="websocket-config" className="section-heading">{TXT.h1[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>WebSocketStompConstant / Destination</th>
            <th>Type</th>
            <th>Lifecycle Scope</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/ws-connect</code> (<code>WS_ENDPOINT</code>)</td>
            <td>Handshake Endpoint</td>
            <td>WebSocket handshake endpoint with SockJS fallback</td>
          </tr>
          <tr>
            <td><code>/topic/&#123;entity&#125;/created</code> (<code>SUFFIX_CREATED</code>)</td>
            <td>Broadcast Topic</td>
            <td>Emitted after commit of entity creation</td>
          </tr>
          <tr>
            <td><code>/topic/&#123;entity&#125;/updated</code> (<code>SUFFIX_UPDATED</code>)</td>
            <td>Broadcast Topic</td>
            <td>Emitted after commit of PUT/PATCH entity update</td>
          </tr>
          <tr>
            <td><code>/topic/&#123;entity&#125;/deleted</code> (<code>SUFFIX_DELETED</code>)</td>
            <td>Broadcast Topic</td>
            <td>Emitted after commit of entity deletion</td>
          </tr>
          <tr>
            <td><code>/topic/&#123;entity&#125;/state-changed</code> (<code>SUFFIX_STATE_CHANGED</code>)</td>
            <td>Broadcast Topic</td>
            <td>Emitted on <code>@StateMachine</code> transition commit</td>
          </tr>
        </tbody>
      </table>

      <h2 id="backend-broadcaster" className="section-heading">{TXT.h2[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p2[currentLang]}</p>

      <CodeBlock
        language="java"
        fileName="module/realtime/websocket/listener/EntityEventWebSocketBroadcasterListener.java"
        code={`@Slf4j
@AutoComponent
@RequiredArgsConstructor
public class EntityEventWebSocketBroadcasterListener {

  private final WebSocketEntityBroadcasterHelper broadcasterHelper;

  public void onEntityCreated(final EntityCreatedEvent<?> event) {
    if (Objects.isNull(event)) {
      return;
    }
    final String entityName = event.getEntityClass().getSimpleName();
    TransactionRuntimeBridge.executeAfterCommit(() ->
        broadcasterHelper.broadcastEntityEvent(entityName, event.getEventType(), event.getEntity())
    );
  }
}`}
      />

      <h2 id="frontend-client" className="section-heading">{TXT.h3[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p3[currentLang]}</p>

      <CodeBlock
        language="typescript"
        fileName="client/realtime-subscriber.ts"
        code={`import { Client } from '@stomp/stompjs';

const stompClient = new Client({
  brokerURL: 'ws://localhost:8080/ws-connect',
  reconnectDelay: 5000,
});

stompClient.onConnect = () => {
  stompClient.subscribe('/topic/product/created', (message) => {
    const newProduct = JSON.parse(message.body);
    console.log('Entity created:', newProduct);
  });

  stompClient.subscribe('/topic/order/state-changed', (message) => {
    const stateUpdate = JSON.parse(message.body);
    console.log('State transitioned:', stateUpdate);
  });
};

stompClient.activate();`}
      />
    </div>
  );
};
