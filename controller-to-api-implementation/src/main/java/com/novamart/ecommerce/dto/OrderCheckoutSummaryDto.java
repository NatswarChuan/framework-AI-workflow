package com.novamart.ecommerce.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Aggregated checkout summary DTO counting shop orders across every state machine lifecycle phase.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OrderCheckoutSummaryDto {

  private long totalOrders;
  private long draftCount;
  private long pendingPaymentCount;
  private long paidCount;
  private long shippedCount;
  private long deliveredCount;
  private long cancelledCount;
  private long refundedCount;
  private BigDecimal grossOrderVolume;
}
