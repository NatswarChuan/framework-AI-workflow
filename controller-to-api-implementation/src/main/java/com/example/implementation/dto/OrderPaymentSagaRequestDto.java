package com.example.implementation.dto;

import jakarta.validation.constraints.DecimalMin;
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
 * Request payload initiating an e-commerce multi-phase distributed Saga payment flow.
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
public class OrderPaymentSagaRequestDto {

  @NotNull(message = "Order identifier is required")
  private UUID orderId;

  @NotBlank(message = "Stock SKU code is required")
  private String stockSkuCode;

  @NotNull(message = "Reservation quantity is required")
  private Integer reservationQuantity;

  @NotNull(message = "Payment amount is required")
  @DecimalMin(value = "0.01", message = "Payment amount must be greater than zero")
  private BigDecimal paymentAmount;

  @NotBlank(message = "Payment method is required")
  private String paymentMethod;

  private boolean simulatePaymentFailure;
}
