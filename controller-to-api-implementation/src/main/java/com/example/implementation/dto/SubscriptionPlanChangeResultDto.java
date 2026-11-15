package com.example.implementation.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating the result of a SaaS subscription plan transition.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SubscriptionPlanChangeResultDto {

  private UUID subscriptionId;
  private String contractCode;
  private String previousTier;
  private String newTier;
  private String changeStatus;
  private BigDecimal proratedAdjustment;
}

