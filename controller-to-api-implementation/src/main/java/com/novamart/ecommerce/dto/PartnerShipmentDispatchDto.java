package com.novamart.ecommerce.dto;

import io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Strongly-typed DTO wrapping outbound partner shipping HTTP dispatch results.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PartnerShipmentDispatchDto {

  private String carrierName;
  private String trackingEndpoint;
  private int httpStatus;
  private String responsePayload;
  private long elapsedMs;

  /**
   * Maps a framework ThirdPartyCallResponseDto into a NovaMart PartnerShipmentDispatchDto.
   *
   * @param endpoint target partner URL called
   * @param response framework outbound response DTO
   * @return mapped PartnerShipmentDispatchDto, or null if response is null
   */
  public static PartnerShipmentDispatchDto fromThirdPartyResponse(
      final String endpoint, final ThirdPartyCallResponseDto response) {
    if (Objects.isNull(response)) {
      return null;
    }
    return PartnerShipmentDispatchDto.builder()
        .carrierName(response.getServiceName())
        .trackingEndpoint(endpoint)
        .httpStatus(response.getStatusCode())
        .responsePayload(response.getResponseBody())
        .elapsedMs(response.getExecutionTimeMs())
        .build();
  }
}
