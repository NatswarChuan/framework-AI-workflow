package com.example.implementation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object carrying flash-sale purchase execution request.
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
public class FlashSalePurchaseRequestDto {

  @NotNull
  private UUID stockId;

  @NotBlank
  private String buyerEmail;

  @NotNull
  @Positive
  private Integer quantity;

  @NotNull
  @Positive
  private BigDecimal unitPrice;
}

