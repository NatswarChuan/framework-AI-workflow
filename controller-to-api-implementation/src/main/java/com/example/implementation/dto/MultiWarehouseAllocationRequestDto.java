package com.example.implementation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object requesting multi-warehouse distributed inventory stock allocation.
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
public class MultiWarehouseAllocationRequestDto {

  @NotBlank(message = "Order reference is required")
  @Size(max = 64, message = "Order reference must not exceed 64 characters")
  private String orderReference;

  @NotBlank(message = "Product SKU reference is required")
  @Size(max = 64, message = "Product SKU must not exceed 64 characters")
  private String productSkuCode;

  @NotNull(message = "Requested quantity is required")
  @Min(value = 1, message = "Requested quantity must be at least 1")
  private Integer requestedQuantity;

  @NotEmpty(message = "At least one candidate warehouse must be provided")
  private List<String> preferredWarehouseCodes;
}

