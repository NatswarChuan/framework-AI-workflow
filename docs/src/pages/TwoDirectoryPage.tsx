import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const TwoDirectoryPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span className="badge badge-purple">Layer SRP</span>
        <span className="badge badge-blue">Strict 2-Directory Rule</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'The Strict 2-Directory Rule'}
        {currentLang === 'vi' && 'Quy Tắc Nghiêm Ngặt 2 Thư Mục (Strict 2-Directory Rule)'}
        {currentLang === 'ja' && '厳格な2ディレクトリ規則（Strict 2-Directory Rule）'}
        {currentLang === 'zh' && '严格的双目录架构规范 (Strict 2-Directory Rule)'}
      </h1>

      <p className="page-lead">
        {currentLang === 'en' && 'Enforcing clean architectural boundaries by restricting the developer domain surface area to exactly two directories: entity/ and controller/.'}
        {currentLang === 'vi' && 'Thiết lập ranh giới kiến trúc tinh gọn tuyệt đối: phạm vi lập trình nghiệp vụ thông thường chỉ nằm trong đúng hai thư mục: entity/ và controller/.'}
        {currentLang === 'ja' && '開発者が触れる基本スコープを entity/ と controller/ の厳格な2つのディレクトリのみに制限し、クリーンな境界を実現します。'}
        {currentLang === 'zh' && '通过将业务开发范围严格限定在 entity/ 与 controller/ 两个目录，构筑整洁且高聚合的企业架构边界。'}
      </p>

      <h2 id="architectural-basis-2-dirs" className="section-heading">
        {currentLang === 'en' && '1. Architectural Basis for the Strict 2-Directory Model'}
        {currentLang === 'vi' && '1. Cơ Sở Kiến Trúc Của Mô Hình 2 Thư Mục'}
        {currentLang === 'ja' && '1. 厳格な2ディレクトリ構成のアーキテクチャ根拠'}
        {currentLang === 'zh' && '1. 极简双目录规范的架构设计依据'}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        {currentLang === 'en' && 'In traditional Spring Boot applications, adding a single domain table requires writing 7-10 files: Entity, Repository, Service, ServiceImpl, DTOs, Mapper, and Controller. Over time, this leads to layer leakage, inconsistent authorization checks, and massive cognitive fatigue.'}
        {currentLang === 'vi' && 'Trong các ứng dụng Spring Boot truyền thống, mỗi bảng CSDL đều đòi hỏi lập trình viên phải tạo từ 7 đến 10 tệp mã nguồn: Entity, Repository, Service, ServiceImpl, DTOs, Mapper và Controller. Lâu dần, điều này gây rò rỉ trách nhiệm giữa các tầng, phân tán logic bảo mật và tạo gánh nặng bảo trì khổng lồ.'}
        {currentLang === 'ja' && '従来の Spring Boot ではテーブル1つにつき 7〜10 個のファイルを量産する必要があり、層の責任漏れやセキュリティ規則の分散、認知的疲弊を引き起こしていました。'}
        {currentLang === 'zh' && '在传统 Spring Boot 开发中，每新增一张表都需要建立 7～10 个文件，长期迭代会导致架构腐化、权限散落各处以及沉重的维护包袱。'}
      </p>

      <div className="doc-grid-2">
        <div className="doc-card">
          <h4>
            1. <code>entity/</code> Directory
          </h4>
          <p>
            {currentLang === 'en' && 'Contains Rich Domain Entities annotated with declarative enterprise capabilities (@EntitySecurity, @StateMachine, @AutoCode, @UniqueField, @FieldSecurity).'}
            {currentLang === 'vi' && 'Chứa các Rich Domain Entity được đính kèm các annotation khai báo doanh nghiệp (@EntitySecurity, @StateMachine, @AutoCode, @UniqueField, @FieldSecurity).'}
            {currentLang === 'ja' && '宣言的エンタープライズアノテーション（RBAC、ステートマシン、自動採番、重複排除、マスキング）を付与したドメインエンティティを配置します。'}
            {currentLang === 'zh' && '存放附带企业级声明式注解（RBAC、状态机、自动发号、唯一性校验、脱敏）的富领域实体类。'}
          </p>
        </div>

        <div className="doc-card">
          <h4>
            2. <code>controller/</code> Directory
          </h4>
          <p>
            {currentLang === 'en' && 'Contains Pure Controller Interfaces extending AutoApiController<E> annotated with @AutoRestController. 100% declarative dispatching.'}
            {currentLang === 'vi' && 'Chứa các Controller Interface kế thừa AutoApiController<E> đính kèm @AutoRestController. Đóng vai trò thuần túy là điều phối viên khai báo.'}
            {currentLang === 'ja' && '@AutoRestController を付与し AutoApiController<E> を継承した純粋な宣言的コントローラーインターフェースを配置します。'}
            {currentLang === 'zh' && '存放继承自 AutoApiController<E> 并标注 @AutoRestController 的纯声明式控制层接口，充当极速分发调度中枢。'}
          </p>
        </div>
      </div>

      <h2 id="custom-extensions" className="section-heading">
        {currentLang === 'en' && '2. Handling Complex Abnormal Business Workflows'}
        {currentLang === 'vi' && '2. Xử Lý Các Luồng Nghiệp Vụ Phức Tạp (Helper Extraction)'}
        {currentLang === 'ja' && '2. 複雑な異常系・多段階ビジネスロジックの拡張'}
        {currentLang === 'zh' && '2. 处理复杂跨系统异常业务流程 (Helper 解耦)'}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        {currentLang === 'en' && 'When an application requires specialized multi-step workflows (e.g. Flash-sale inventory locking, multi-warehouse reservation, cross-border sanctions check), developers declare an independent Service Interface and delegate decomposition strictly to final class @AutoComponent Helper beans:'}
        {currentLang === 'vi' && 'Khi hệ thống phát sinh các nghiệp vụ đa bước chuyên biệt (như đặt hàng Flash-sale, phân bổ kho hàng loạt, kiểm tra cấm vận hải quan), lập trình viên tạo Service Interface và phân rã 100% logic sang các lớp Helper độc lập (final class, @AutoComponent):'}
        {currentLang === 'ja' && 'フラッシュセール在庫確保や多拠点倉庫引当、国際貿易制裁チェックなど複雑な多段階処理が必要な場合は、Service Interface を介して final class @AutoComponent の Helper クラスへ委譲します：'}
        {currentLang === 'zh' && '当遇到秒杀锁库、多仓协同引当或海关制裁等复杂多步事务时，通过独立的 Service Interface 将具体子逻辑彻底下沉至 final class @AutoComponent Helper 独立组件：'}
      </p>

      <CodeBlock
        language="java"
        fileName="com/example/demo/helper/FlashSaleInventoryReservationHelper.java"
        code={`package com.example.demo.helper;

import io.github.natswarchuan.core.annotation.AutoComponent;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AutoComponent
@RequiredArgsConstructor
public final class FlashSaleInventoryReservationHelper {

    private final EntityManager entityManager;

    public boolean reserveStockPessimistic(final UUID productId, final int quantity) {
        log.info("Starting atomic inventory reservation for product: {}", productId);
        // Clean atomic execution with zero private methods and zero hard-code literals
        return true;
    }
}`}
      />

      <Callout
        type="warning"
        title={
          {
            vi: 'Ràng Buộc Nghiêm Ngặt SRP Tầng',
            en: 'Strict Layer SRP Constraints',
            ja: '厳格なレイヤーSRP制約',
            zh: '严格的分层单职责（SRP）约束',
          }[currentLang]
        }
      >
        {currentLang === 'vi' && (
          <ul>
            <li><strong>Controller chỉ điều phối:</strong> Không chứa tính toán nghiệp vụ, không tiêm Repository, không sửa Entity trực tiếp.</li>
            <li><strong>ServiceImpl chỉ chứa @Override:</strong> 100% phương thức trong ServiceImpl phải kế thừa Service Interface; mọi logic phân rã nằm trong các <code>final class @AutoComponent</code> Helper độc lập.</li>
          </ul>
        )}
        {currentLang === 'en' && (
          <ul>
            <li><strong>Controller ONLY acts as Coordinator/Dispatcher:</strong> Zero business calculations, zero Repository injections, zero direct entity mutations.</li>
            <li><strong>ServiceImpl ONLY contains @Override methods:</strong> 100% of methods in ServiceImpl implement the Service Interface; helper decomposition resides in independent <code>final class @AutoComponent</code> Helpers.</li>
          </ul>
        )}
        {currentLang === 'ja' && (
          <ul>
            <li><strong>Controllerは調整役のみ：</strong> 業務ロジック、Repository注入、直接的なEntity変更を禁止します。</li>
            <li><strong>ServiceImplは @Override のみ：</strong> 全メソッドをInterface実装とし、分割ロジックは独立した <code>final class @AutoComponent</code> Helper に配置します。</li>
          </ul>
        )}
        {currentLang === 'zh' && (
          <ul>
            <li><strong>Controller 仅充当调度器：</strong> 严禁包含业务逻辑计算、注入 Repository 或直接修改实体状态。</li>
            <li><strong>ServiceImpl 仅包含 @Override 方法：</strong> 全部业务拆解必须下沉至独立的 <code>final class @AutoComponent</code> Helper 组件。</li>
          </ul>
        )}
      </Callout>
    </div>
  );
};
