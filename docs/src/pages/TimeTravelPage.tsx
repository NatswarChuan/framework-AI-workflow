import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Hoàn Tác Định Danh Lịch Sử Độ Phức Tạp O(K)',
    en: 'Deterministic O(K) Backward Delta Inversion',
    ja: 'O(K) アルゴリズムによる決定論的過去状態復元',
    zh: '确定性 O(K) 逆向增量状态复原算法',
  },
  h1: {
    vi: '1. API Truy Vấn Time-Travel (TimeTravelDynamicApiController)',
    en: '1. Time-Travel Inspection Endpoint (TimeTravelDynamicApiController)',
    ja: '1. Time-Travel クエリエンドポイント (TimeTravelDynamicApiController)',
    zh: '1. Time-Travel 历史快照查询接口 (TimeTravelDynamicApiController)',
  },
  h2: {
    vi: '2. Lược Đồ Phản Hồi HistoricalEntitySnapshotDto',
    en: '2. HistoricalEntitySnapshotDto Response Contract',
    ja: '2. HistoricalEntitySnapshotDto レスポンス構造',
    zh: '2. HistoricalEntitySnapshotDto 返回契约格式',
  },
};

export const TimeTravelPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-purple">TimeTravelDynamicApiController</span>
        <span className="badge badge-amber">CDC Delta Inversion</span>
        <span className="badge badge-emerald">ISO-8601 UTC</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Động Cơ Time-Travel & Tái Tạo Trạng Thái Lịch Sử'}
        {currentLang === 'en' && 'Audit Trail Time-Travel & Historical State Reconstruction'}
        {currentLang === 'ja' && '監査タイムトラベルと過去状態の完全復元'}
        {currentLang === 'zh' && '审计追踪时间旅行与实体历史状态复原引擎'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'TimeTravelDynamicApiController và EntityTimeTravelReconstructionHelper tái tạo trạng thái lịch sử chính xác tại một mốc thời gian ISO-8601 UTC bằng cách hoàn tác các thay đổi audit diễn ra sau thời điểm đó.'}
        {currentLang === 'en' &&
          'TimeTravelDynamicApiController and EntityTimeTravelReconstructionHelper reconstruct exact entity snapshots at any ISO-8601 UTC timestamp by applying inverse audit diffs chronologically backward.'}
        {currentLang === 'ja' &&
          'TimeTravelDynamicApiController と EntityTimeTravelReconstructionHelper が ISO-8601 UTC 時刻以降の差分ログを逆適用し、過去状態を正確に復元します。'}
        {currentLang === 'zh' &&
          'TimeTravelDynamicApiController 与 EntityTimeTravelReconstructionHelper 通过逆向应用审计变更差分，精确重建实体在指定 ISO-8601 UTC 时刻的字段快照。'}
      </p>

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'Áp dụng giá trị cũ (oldValue) ngược thời gian cho K bản ghi diff phát sinh sau mốc timestamp với độ phức tạp O(K), không cần chụp snapshot toàn CSDL.'}
        {currentLang === 'en' &&
          'Inverts K audit diff records recorded after the target asOf timestamp in O(K) operations without maintaining duplicate full-table point-in-time snapshots.'}
        {currentLang === 'ja' &&
          '指定時刻以降のK件の差分のみをO(K)で巻き戻すため、データベース全体のフルスナップショット保管が不要です。'}
        {currentLang === 'zh' &&
          '仅对目标时刻之后的 K 条字段增量执行逆向叠加，时间复杂度为 O(K)，无需额外维护全库镜像备份。'}
      </Callout>

      <h2 id="time-travel-endpoint" className="section-heading">{TXT.h1[currentLang]}</h2>
      <CodeBlock
        language="bash"
        fileName="GET /api/v1/system/time-travel/{entityName}/{id}"
        code={`curl -X GET "http://localhost:8080/api/v1/system/time-travel/CustomerOrder/0194e1a0-0000-7000-8000-000000000001?timestamp=2026-11-01T15:30:00Z" \\
  -H "Authorization: Bearer <TOKEN>"`}
      />

      <h2 id="time-travel-response" className="section-heading">{TXT.h2[currentLang]}</h2>
      <CodeBlock
        language="json"
        fileName="HistoricalEntitySnapshotDto"
        code={`{
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "entityId": "0194e1a0-0000-7000-8000-000000000001",
    "entityName": "CustomerOrder",
    "asOfTimestamp": "2026-11-01T15:30:00Z",
    "reconstructedFields": {
      "status": "PENDING_PAYMENT",
      "grossAmount": "1499.00",
      "discountAmount": "100.00"
    },
    "appliedInverseDiffCount": 3,
    "existedAtTimestamp": true,
    "traceId": "0194e1a0-1234-7000-8000-000000000099"
  }
}`}
      />
    </div>
  );
};
