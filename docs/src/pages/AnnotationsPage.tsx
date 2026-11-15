import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const AnnotationsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-blue">Declarative Power</span>
        <span className="badge badge-emerald">10 Core Annotations</span>
        <span className="badge badge-amber">Zero Magic Strings</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'Universal Declarative Annotations Reference'}
        {currentLang === 'vi' && 'Tham Chiếu 10 Chú Thích Khai Báo Cốt Lõi (Declarative Annotations)'}
        {currentLang === 'ja' && 'ユニバーサル宣言的アノテーションリファレンス'}
        {currentLang === 'zh' && '通用声明式注解完全技术手册'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Spring-NWVMC cung cấp 10 chú thích khai báo (Annotations) nòng cốt. Mỗi mục dưới đây được trình bày đồng nhất theo 3 cột trọng tâm: Cơ sở kiến trúc, Phạm vi áp dụng, Cách triển khai kèm Code mẫu chuẩn.'}
        {currentLang === 'en' &&
          'Spring-NWVMC provides 10 core declarative annotations. Each entry below follows a unified 3-column specification: Architectural Rationale, Target Applicability, Declarative Implementation, and a focus-highlighted code sample.'}
        {currentLang === 'ja' &&
          'Spring-NWVMCは10個の中核的な宣言的アノテーションを提供します。使用すべき理由、適用ケース、実装方法と標準コード例を統一フォーマットで解説します。'}
        {currentLang === 'zh' &&
          'Spring-NWVMC 提供 10 个核心声明式注解。以下采用统一的三栏结构深度剖析：选用理由、适用场景、实现步骤与标准代码范式。'}
      </p>

      {ANNOTATIONS_DATA.map((item, index) => (
        <div key={item.name} style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2.25rem' }}>
          <h2 id={item.name.replace('@', '').toLowerCase()} className="section-heading">
            <span className="badge badge-blue" style={{ fontSize: '0.78rem' }}>#{index + 1}</span>
            <span style={{ color: 'var(--accent-blue)' }}>{item.name}</span>
            <span className="badge badge-purple" style={{ fontSize: '0.73rem', fontWeight: 600 }}>Target: {item.target}</span>
          </h2>

          <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
            {item.purpose[currentLang]}
          </p>

          <div className="doc-grid-3">
            <div className="doc-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
                {currentLang === 'vi' ? '💡 CƠ SỞ KIẾN TRÚC' : currentLang === 'ja' ? '💡 設計根拠' : currentLang === 'zh' ? '💡 设计依据' : '💡 ARCHITECTURAL RATIONALE'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0, lineHeight: 1.55 }}>
                {item.rationale[currentLang]}
              </p>
            </div>

            <div className="doc-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>
                {currentLang === 'vi' ? '🎯 PHẠM VI ÁP DỤNG' : currentLang === 'ja' ? '🎯 適用対象' : currentLang === 'zh' ? '🎯 适用范围' : '🎯 TARGET APPLICABILITY'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0, lineHeight: 1.55 }}>
                {item.applicability[currentLang]}
              </p>
            </div>

            <div className="doc-card">
              <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '0.4rem' }}>
                {currentLang === 'vi' ? '🛠️ CÁCH TRIỂN KHAI' : currentLang === 'ja' ? '🛠️ 実装・利用仕様' : currentLang === 'zh' ? '🛠️ 声明式配置' : '🛠️ DECLARATIVE IMPLEMENTATION'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0, lineHeight: 1.55 }}>
                {item.usage[currentLang]}
              </p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.89rem', marginBottom: '0.75rem' }}>
            {item.explanation[currentLang]}
          </p>

          <CodeBlock
            language="java"
            fileName={`${item.name} Standard Usage`}
            code={item.syntaxSample}
          />
        </div>
      ))}

      <Callout
        type="info"
        title={
          {
            vi: 'Chính Sách Zero Magic Numbers & Strings',
            en: 'Zero Magic Numbers & Strings Policy',
            ja: 'マジックナンバー＆マジックストリング禁止ポリシー',
            zh: '零硬编码魔法数字与字符串规范',
          }[currentLang]
        }
      >
        {currentLang === 'vi' && (
          <>Mọi thuộc tính phân quyền trên annotation (ví dụ <code>readRoles = {'{'}RoleConstant.ROLE_USER{'}'}</code>) đều tham chiếu hằng số trong <code>*Constant.java</code> nhằm loại bỏ chuỗi hard-code rải rác.</>
        )}
        {currentLang === 'en' && (
          <>Every annotation attribute (e.g. <code>readRoles = {'{'}RoleConstant.ROLE_USER{'}'}</code>) references constants defined in <code>*Constant.java</code> files to eliminate hard-coded strings.</>
        )}
        {currentLang === 'ja' && (
          <>アノテーションの権限属性（例：<code>readRoles = {'{'}RoleConstant.ROLE_USER{'}'}</code>）はすべて <code>*Constant.java</code> の定数を参照し、ハードコードを排除します。</>
        )}
        {currentLang === 'zh' && (
          <>注解中的所有角色权限属性（例如 <code>readRoles = {'{'}RoleConstant.ROLE_USER{'}'}</code>）均严格引用 <code>*Constant.java</code> 常量类，消除散落硬编码。</>
        )}
      </Callout>
    </div>
  );
};
