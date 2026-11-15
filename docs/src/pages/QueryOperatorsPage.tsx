import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { OPERATORS_DATA } from '../data/operatorsData';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  lead: {
    vi: 'Truy vấn trường Entity qua 13 toán tử lọc động (QueryFilterParameterUtil chặn SQLi/XSS, giới hạn MAX_DYNAMIC_FILTERS=30 và MAX_SORT_RELATION_DEPTH=4) kết hợp phân trang Keyset O(1).',
    en: 'Filter any entity field across 13 parameterized operators (QueryFilterParameterUtil blocks SQLi/XSS and bounds MAX_DYNAMIC_FILTERS=30, MAX_SORT_RELATION_DEPTH=4) paired with O(1) Keyset cursor pagination.',
    ja: '13種類の型安全フィルタ演算子（QueryFilterParameterUtil により最大30フィルタ・関連ソート深度4まで制限し SQLi/XSS を遮断）と定数時間 O(1) Keyset ページングを提供します。',
    zh: '支持 13 种参数化动态过滤运算符（QueryFilterParameterUtil 校验并限制 MAX_DYNAMIC_FILTERS=30、MAX_SORT_RELATION_DEPTH=4 防护注入），结合 O(1) Keyset 游标分页。',
  },
  h1: {
    vi: '1. Danh Bạ 13 Toán Tử Lọc Động (FilterOperatorConstant)',
    en: '1. 13 Dynamic Filter Operators (FilterOperatorConstant)',
    ja: '1. 13種類の動的フィルタ演算子 (FilterOperatorConstant)',
    zh: '1. 13 种动态过滤运算符清单 (FilterOperatorConstant)',
  },
  h2: {
    vi: '2. Phân Tích Độ Phức Tạp: Keyset Pagination O(1) vs OFFSET O(N)',
    en: '2. Complexity Comparison: Keyset Pagination O(1) vs OFFSET O(N)',
    ja: '2. 計算量比較：Keyset ページネーション O(1) vs OFFSET O(N)',
    zh: '2. 复杂度对比：Keyset 游标分页 O(1) vs 传统 OFFSET O(N)',
  },
  p2: {
    vi: 'OFFSET N buộc SQL engine đọc và loại bỏ N hàng trước trang mục tiêu; Keyset dùng UUIDv7 làm con trỏ B-Tree WHERE id > :afterId ORDER BY id LIMIT :size để giữ chi phí seek O(1).',
    en: 'SQL OFFSET N scans and discards N preceding rows before returning the target slice; Keyset seeks directly via UUIDv7 B-Tree ordering (WHERE id > :afterId ORDER BY id LIMIT :size) in O(1) index hops.',
    ja: 'SQL の OFFSET N は N 行を読み捨ててから結果を返すため深いページで劣化しますが、Keyset は UUIDv7 B-Tree インデックスへ WHERE id > :afterId で O(1) 直接シークします。',
    zh: 'SQL OFFSET N 在深分页场景会扫描并丢弃前 N 行；Keyset 基于时间有序的 UUIDv7 主键执行 B-Tree 范围定位（WHERE id > :afterId），保持 O(1) 常数索引寻址开销。',
  },
  h3: {
    vi: '3. Ví Dụ Truy Vấn Keyset Pagination (GET /keyset)',
    en: '3. Keyset Pagination Request Example (GET /keyset)',
    ja: '3. Keyset ページネーション呼び出し例 (GET /keyset)',
    zh: '3. Keyset 游标分页调用样例 (GET /keyset)',
  },
  calloutTitle: {
    vi: 'Chỉ Mục Tuần Tự UUIDv7 & Chống Lạm Dụng Query',
    en: 'Sequential UUIDv7 Index & Filter Bounds',
    ja: 'UUIDv7 シーケンシャルインデックス＆クエリ制限',
    zh: 'UUIDv7 顺序索引与动态查询防滥用边界',
  },
  calloutBody: {
    vi: 'UUIDv7 (RFC 9562) nhúng timestamp 48-bit tăng dần giúp B-Tree không phân mảnh khi chèn. Đồng thời QueryFilterParameterUtil từ chối payload lọc vượt quá 30 điều kiện hoặc lồng quan hệ sâu quá 4 cấp.',
    en: 'UUIDv7 (RFC 9562) embeds a monotonic 48-bit millisecond prefix for localized B-Tree inserts, while QueryFilterParameterUtil rejects filter sets exceeding 30 predicates or relation sort paths deeper than 4 levels.',
    ja: 'UUIDv7 は48ビット単調増加ミリ秒タイムスタンプを含み B-Tree 断片化を防ぎます。QueryFilterParameterUtil は30個超のフィルタや4階層超のソートパスを拒否します。',
    zh: 'UUIDv7 嵌入 48 位单调递增毫秒时间戳，显著降低 B-Tree 插入页分裂；同时 QueryFilterParameterUtil 硬性限制单次最多 30 个过滤条件及 4 层关联排序深度。',
  },
};

export const QueryOperatorsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-purple">Big Data Indexing</span>
        <span className="badge badge-emerald">13 Operators</span>
        <span className="badge badge-blue">Keyset O(1)</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && '13 Dynamic Filter Operators & Keyset Pagination'}
        {currentLang === 'vi' && '13 Toán Tử Lọc Động & Phân Trang Keyset O(1)'}
        {currentLang === 'ja' && '13の動的フィルタ演算子とKeysetページネーション'}
        {currentLang === 'zh' && '13种动态过滤运算符与Keyset游标分页'}
      </h1>

      <p className="page-lead">{TXT.lead[currentLang]}</p>

      <h2 id="operators-table" className="section-heading">{TXT.h1[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Operator</th>
            <th>Query URL Syntax</th>
            <th>SQL Equivalent</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {OPERATORS_DATA.map((op) => (
            <tr key={op.operator}>
              <td>
                <span className="badge badge-blue" style={{ fontFamily: 'JetBrains Mono' }}>{op.operator}</span>
              </td>
              <td><code>{op.syntax}</code></td>
              <td><code>{op.sqlEquivalent}</code></td>
              <td>{op.description[currentLang]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="keyset-pagination" className="section-heading">{TXT.h2[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p2[currentLang]}</p>

      <div className="doc-grid-2">
        <div className="doc-card">
          <h4 style={{ color: 'var(--accent-rose)' }}>OFFSET O(N) Scan</h4>
          <p>
            <code>SELECT * FROM tbl ORDER BY id LIMIT 20 OFFSET 1000000</code><br />
            Linear full-index / heap discard proportional to page depth.
          </p>
        </div>

        <div className="doc-card">
          <h4 style={{ color: 'var(--accent-emerald)' }}>UUIDv7 Keyset O(1) Seek</h4>
          <p>
            <code>WHERE id &gt; :afterId ORDER BY id ASC LIMIT 20</code><br />
            Constant-time B-Tree range lookup independent of table depth.
          </p>
        </div>
      </div>

      <h2 id="keyset-usage" className="section-heading">{TXT.h3[currentLang]}</h2>
      <CodeBlock
        language="bash"
        fileName="cURL Keyset Pagination"
        code={`# Initial page
curl -X GET "http://localhost:8080/api/v1/customer-orders/keyset?size=20&sort=id&dir=asc"

# Subsequent page via afterId cursor
curl -X GET "http://localhost:8080/api/v1/customer-orders/keyset?size=20&sort=id&dir=asc&afterId=0194e1a0-0000-7000-8000-000000000020"`}
      />

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {TXT.calloutBody[currentLang]}
      </Callout>
    </div>
  );
};
