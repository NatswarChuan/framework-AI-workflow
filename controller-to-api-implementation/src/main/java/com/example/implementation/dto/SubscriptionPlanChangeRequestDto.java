package com.example.implementation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object requesting a SaaS subscription tier upgrade or downgrade.
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
public class SubscriptionPlanChangeRequestDto {

  @NotNull(message = "Subscription ID is required")
  private UUID subscriptionId;

  @NotBlank(message = "Target subscription tier is required")
  @Size(max = 64, message = "Target subscription tier must not exceed 64 characters")
  private String targetTier;

  private Boolean allowProratedRefund;
}

