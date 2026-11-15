import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Giữ Nguyên Vai Trò Điều Phối Viên (Zero Procedural Controller)',
    en: 'Pure Coordinator / Dispatcher Compliance',
    ja: 'コントローラーの純粋ディスパッチャ規約維持',
    zh: '严格恪守纯调度器规范',
  },
  h1: {
    vi: '1. Khai Báo @CustomEndpoint Trên Controller Interface',
    en: '1. Declaring @CustomEndpoint on Controller Interfaces',
    ja: '1. コントローラーインターフェースへの @CustomEndpoint 宣言',
    zh: '1. 在 Controller 接口声明 @CustomEndpoint',
  },
  h2: {
    vi: '2. Triển Khai Delegate @AutoComponent Helper Độc Lập',
    en: '2. Implementing the Delegate @AutoComponent Helper Bean',
    ja: '2. 委譲先 @AutoComponent Helper Bean の実装',
    zh: '2. 实现独立的 @AutoComponent 委派 Helper 组件',
  },
};

export const CustomEndpointsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-purple">@CustomEndpoint</span>
        <span className="badge badge-blue">Zero Boilerplate</span>
        <span className="badge badge-emerald">Pure Coordinator</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Mở Rộng Endpoint Tùy Biến (@CustomEndpoint)'}
        {currentLang === 'en' && 'Custom Endpoints Subsystem (@CustomEndpoint)'}
        {currentLang === 'ja' && 'カスタムエンドポイント拡張 (@CustomEndpoint)'}
        {currentLang === 'zh' && '自定义端点声明式扩展 (@CustomEndpoint)'}
      </h1>
      <p className="page-lead">
        {currentLang === 'vi' &&
          'Ngoài 38 hợp đồng @Auto*, @CustomEndpoint cho phép bổ sung các hành vi nghiệp vụ đặc thù (hoàn tiền, thống kê, phê duyệt) ngay trên Controller Interface mà vẫn giữ Controller không có code thủ tục.'}
        {currentLang === 'en' &&
          'Beyond the 38 inherited @Auto* contracts, @CustomEndpoint registers domain-specific endpoints directly on controller interfaces and delegates execution reflectively to a Spring helper bean.'}
        {currentLang === 'ja' &&
          '38種類の標準契約に加え、@CustomEndpoint により独自ドメインエンドポイントをインターフェース上へ宣言し、任意の Spring Bean へ処理を委譲できます。'}
        {currentLang === 'zh' &&
          '除了继承自 AutoApiController 的 38 个标准化契约外，@CustomEndpoint 允许直接在控制器接口上声明自定义业务端点并自动委派给独立 Helper Bean 执行。'}
      </p>

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'Controller giữ nguyên vai trò Điều Phối Viên thuần túy. Toàn bộ logic xử lý nằm trong Bean độc lập (Helper) và được nạp qua delegateBean + delegateMethod.'}
        {currentLang === 'en' &&
          'The controller interface declares route contract metadata only; execution routes through delegateBean and delegateMethod to an independent Helper bean.'}
        {currentLang === 'ja' &&
          'コントローラーはルート契約の宣言のみを担当し、実行ロジックはすべて delegateBean / delegateMethod 指定の Helper へ委譲されます。'}
        {currentLang === 'zh' &&
          'Controller 接口仅保留路径与契约声明，全部业务执行通过 delegateBean 与 delegateMethod 转发至独立的 Helper 组件。'}
      </Callout>

      <h2 id="custom-endpoint-decl" className="section-heading">{TXT.h1[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="controller/OrderController.java"
        code={`@AutoRestController(path = "/api/v1/orders")
public interface OrderController extends AutoApiController<Order> {

  @CustomEndpoint(
      path = "/{id}/refund",
      httpMethod = "POST",
      delegateBean = "orderRefundCustomHandlerHelper",
      delegateMethod = "processRefund",
      summary = "Process order refund by order identifier"
  )
  ApiResponse<RefundResponseDto> refundOrder(
      @AutoVariable("id") UUID orderId,
      @Valid @AutoBody RefundRequestDto request
  );
}`}
      />

      <h2 id="custom-endpoint-delegate" className="section-heading">{TXT.h2[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="helper/OrderRefundCustomHandlerHelper.java"
        code={`@Slf4j
@AutoComponent("orderRefundCustomHandlerHelper")
@RequiredArgsConstructor
public final class OrderRefundCustomHandlerHelper {

  public ApiResponse<RefundResponseDto> processRefund(
      final UUID orderId,
      final RefundRequestDto request) {
    final RefundResponseDto result = RefundResponseDto.builder()
        .orderId(orderId)
        .refundTransactionId(UuidUtil.generateUuidV7())
        .status("REFUND_COMPLETED")
        .build();
    return ApiResponse.success(result);
  }
}`}
      />
    </div>
  );
};
