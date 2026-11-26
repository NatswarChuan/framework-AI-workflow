import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE1_CONTENT } from '../data/pages/stage1Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const TwoDirectoryPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="two-directory"
        currentLang={currentLang}
        guardrailTip={{
          type: 'warning',
          content: <RichDocText text={STAGE1_CONTENT.tdCalloutWarn} currentLang={currentLang} />,
        }}
      />

      <h2 id="two-dir-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.tdGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="two-dir-layout" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="text"
        fileName={pickText(STAGE1_CONTENT.tdLayoutFile, currentLang)}
        code={`controller-to-api-implementation/src/main/java/com/example/implementation/
├── entity/                                 # Core domain models (JPA + declarative annotations)
│   ├── ProductCatalog.java                 # @EntitySecurity + @FieldSecurity + @AutoSlug + @UniqueField
│   ├── ECommerceOrder.java                 # @AutoCode + @StateMachine + @ComputedField + @AuditTrail
│   ├── InventoryStock.java                 # @EntitySecurity + @UniqueField (atomic warehouse stock)
│   ├── PaymentTransaction.java             # @AutoCode + @UniqueField (idempotent settlements)
│   ├── ElectronicInvoice.java              # @EntityWebhook + @PublishCloudEvent + @AutoCode
│   └── Tag.java                            # Taxonomy tags demonstrating @ServiceOverride
├── controller/                             # 1-line dynamic proxy interfaces (zero boilerplate!)
│   ├── ProductCatalogController.java       # extends AutoApiController<ProductCatalog> + @TargetDataSource
│   ├── ProductCatalogReadOnlyController.java # extends AutoReadApi<ProductCatalog> + ProductReadDto + @HttpCacheable
│   ├── ECommerceOrderController.java       # extends AutoApiController<ECommerceOrder> + @CustomEndpoint
│   ├── InventoryStockController.java       # extends AutoApiController<InventoryStock> + @DistributedLock route
│   ├── PaymentTransactionController.java   # extends AutoApiController<PaymentTransaction> + @Idempotent
│   └── TagController.java                  # extends AutoApiController<Tag> + @ServiceOverride
├── dto/                                    # Strongly-typed projections & receipts (Builder Pattern)
├── helper/                                 # Optional @Component final helpers (OrderSummaryHelper, CatalogAssistantHelper...)
├── service/ & service/impl/                # Optional @Service AOP beans (InventoryReservationServiceImpl, MarketplaceAnalyticsServiceImpl)
├── provider/                               # SPI implementations (MarketplaceOutboxEventDispatcherProvider)
└── customizer/                             # Security/framework hooks (EnterpriseSecurityIdentityCustomizer)`}
      />

      <h2 id="two-dir-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="src/main/java/com/example/implementation/helper/OrderSummaryHelper.java"
        code={`package com.example.implementation.helper;

import com.example.implementation.constant.DocsFlowShowcaseConstant;
import com.example.implementation.dto.OrderQuickSummaryDto;
import io.github.natswarchuan.common.response.ApiResponse;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component(DocsFlowShowcaseConstant.BEAN_ORDER_SUMMARY_HELPER)
@RequiredArgsConstructor
public final class OrderSummaryHelper {

  private final EntityManager entityManager;

  public ApiResponse<OrderQuickSummaryDto> buildOrderQuickSummary() {
    final long totalOrders = entityManager
        .createQuery(DocsFlowShowcaseConstant.JPQL_COUNT_ALL_ORDERS, Long.class)
        .getSingleResult();
    final long pendingPayment = entityManager
        .createQuery(DocsFlowShowcaseConstant.JPQL_COUNT_ORDERS_BY_STATUS, Long.class)
        .setParameter(DocsFlowShowcaseConstant.JPQL_PARAM_STATUS, DocsFlowShowcaseConstant.ORDER_STATUS_PENDING_PAYMENT)
        .getSingleResult();
    return ApiResponse.success(OrderQuickSummaryDto.fromCounts(totalOrders, pendingPayment));
  }
}`}
      />
    </article>
  );
};
