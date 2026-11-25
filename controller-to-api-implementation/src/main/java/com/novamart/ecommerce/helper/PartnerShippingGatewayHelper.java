package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.dto.PartnerShipmentDispatchDto;
import com.novamart.ecommerce.exception.InvalidIntegrationInputException;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallRequestDto;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto;
import io.github.natswarchuan.module.integration.helper.ThirdPartyRestClientHelper;
import io.github.natswarchuan.module.webhook.dto.WebhookSubscriptionDto;
import io.github.natswarchuan.module.webhook.helper.WebhookDispatcherHelper;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Outbound shipping carrier gateway & webhook registration helper using ObjectProvider-safe DI.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class PartnerShippingGatewayHelper {

  private final ObjectProvider<ThirdPartyRestClientHelper> restClientProvider;
  private final ObjectProvider<WebhookDispatcherHelper> webhookDispatcherProvider;

  /**
   * Queries an external partner shipping endpoint with automatic W3C traceparent propagation.
   *
   * @param targetUrl partner carrier tracking or quote URL
   * @return strongly-typed PartnerShipmentDispatchDto
   */
  public PartnerShipmentDispatchDto fetchCarrierQuote(final String targetUrl) {
    validateTargetUrl(targetUrl);
    log.info(NovaLogConstant.START_PARTNER_SHIPPING, targetUrl);
    final ThirdPartyCallRequestDto request =
        ThirdPartyCallRequestDto.builder()
            .serviceName(NovaFieldConstant.SERVICE_PARTNER_SHIPPING)
            .targetUrl(targetUrl)
            .httpMethod(NovaPathConstant.HTTP_METHOD_GET)
            .build();
    final ThirdPartyCallResponseDto response =
        restClientProvider.getObject().executeOutboundCall(request);
    log.info(NovaLogConstant.FINISH_PARTNER_SHIPPING, response.getStatusCode());
    return PartnerShipmentDispatchDto.fromThirdPartyResponse(targetUrl, response);
  }

  /**
   * Registers an HMAC-signed outbound webhook subscriber for a NovaMart entity.
   *
   * @param targetEntity entity simple name (e.g. CheckoutPayment)
   * @param endpointUrl subscriber HTTPS callback URL
   * @param secretKey HMAC-SHA256 signing secret
   * @return registered WebhookSubscriptionDto
   */
  public WebhookSubscriptionDto registerPaymentWebhookSubscriber(
      final String targetEntity, final String endpointUrl, final String secretKey) {
    validateTargetUrl(endpointUrl);
    log.info(NovaLogConstant.START_WEBHOOK_REGISTER, targetEntity, endpointUrl);
    final WebhookSubscriptionDto subscription =
        WebhookSubscriptionDto.builder()
            .subscriptionId(UuidUtil.generateUuidV7())
            .targetEntity(targetEntity)
            .endpointUrl(endpointUrl)
            .secretKey(secretKey)
            .subscribedEvents(
                List.of(
                    NovaFieldConstant.WEBHOOK_EVENT_CREATED,
                    NovaFieldConstant.WEBHOOK_EVENT_UPDATED))
            .active(true)
            .createdAt(Instant.now())
            .build();
    final WebhookSubscriptionDto registered =
        webhookDispatcherProvider.getObject().registerSubscription(subscription);
    log.info(NovaLogConstant.FINISH_WEBHOOK_REGISTER, registered.getSubscriptionId());
    return registered;
  }

  /**
   * Validates that an outbound partner URL is non-null and non-blank.
   *
   * @param targetUrl candidate target URL
   */
  public void validateTargetUrl(final String targetUrl) {
    if (Objects.isNull(targetUrl)) {
      throw new InvalidIntegrationInputException(NovaErrorConstant.MSG_ENDPOINT_REQUIRED);
    }
    if (targetUrl.isBlank()) {
      throw new InvalidIntegrationInputException(NovaErrorConstant.MSG_ENDPOINT_REQUIRED);
    }
  }
}
