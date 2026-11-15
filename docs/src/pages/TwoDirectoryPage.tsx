import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const TwoDirectoryPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="two-directory"
        currentLang={currentLang}
        badges={[
          { label: 'entity/', tone: 'emerald' },
          { label: 'controller/', tone: 'blue' },
          { label: '@AutoComponent Helpers', tone: 'purple' },
        ]}
      />

      <h2 id="two-dir-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Restricting standard resources to two directories (<code>entity/</code> and <code>controller/</code>) eliminates duplicate boilerplate across repositories and controllers. Custom domain logic never belongs inside procedural controllers; instead, custom operations delegate cleanly to standalone <code>Service</code> and <code>@AutoComponent</code> <code>public final class</code> <code>Helper</code> beans.
      </p>

      <h2 id="two-dir-layout" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="text"
        fileName="Recommended Package Layout"
        code={`src/main/java/com/example/app/
├── entity/
│   ├── ProductCatalog.java        # @Entity + @EntitySecurity + @AuditTrail
│   └── CustomerOrder.java         # @StateMachine + @ComputedField
├── controller/
│   ├── ProductCatalogController.java   # extends AutoApiController<ProductCatalog>
│   └── TagController.java              # optional @ServiceOverride escape hatch
├── helper/                             # Only when custom orchestration is required
│   └── OrderCheckoutHelper.java        # public final class @AutoComponent
└── service/ & service/impl/            # Interface + Impl overrides (@AutoService)`}
      />

      <h2 id="two-dir-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="helper/OrderCheckoutHelper.java"
        code={`@Slf4j
@AutoComponent("orderCheckoutHelper")
@RequiredArgsConstructor
public final class OrderCheckoutHelper {

  private final OrderTotalsCalculatorHelper totalsHelper;

  public ApiResponse<CustomerOrder> checkoutCart(final CartCheckoutRequestDto request) {
    final CustomerOrder finalized = totalsHelper.computeAndPersist(request);
    return ApiResponse.success(finalized);
  }
}`}
      />

      <h2 id="two-dir-rules" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="warning" currentLang={currentLang}>
        Helper beans (<code>*Helper</code>) are injected singleton components without static helper methods. Pure stateless utility algorithms live inside <code>*Util</code> final classes holding only <code>public static</code> methods and a private constructor throwing <code>UnsupportedOperationException</code>.
      </Callout>
    </article>
  );
};
