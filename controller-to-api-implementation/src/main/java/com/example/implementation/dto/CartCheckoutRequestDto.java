package com.example.implementation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating idempotent cart checkout request.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class CartCheckoutRequestDto {

  @NotNull
  private UUID cartId;

  @NotBlank
  private String buyerEmail;

  @NotBlank
  private String shippingAddress;

  @NotBlank
  private String idempotencyKey;

  @NotNull
  private BigDecimal expectedTotalAmount;
}

