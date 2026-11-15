package com.example.implementation.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Result payload representing the terminal state of a distributed multi-phase Saga.
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
public class SagaExecutionResultDto {

  private UUID orderId;
  private String sagaStatus;
  private String orderStatus;
  private Integer remainingStockQuantity;
  private String message;
  private String compensationDetails;
}
