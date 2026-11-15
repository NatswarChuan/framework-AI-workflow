package com.example.implementation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.github.natswarchuan.common.constant.EnterpriseOperationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.ComputedField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Cart item entity representing a single item within a {@link ShoppingCart}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_cart_items",
    indexes = {
        @Index(name = "idx_cart_items_cart", columnList = "cart_id"),
        @Index(name = "idx_cart_items_sku", columnList = "sku_code")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, exclude = {"shoppingCart"})
public class CartItem extends BaseAuditEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "cart_id", nullable = false)
  @JsonIgnore
  private ShoppingCart shoppingCart;

  @NotBlank(message = "SKU code is required")
  @Column(name = "sku_code", nullable = false, length = 64)
  private String skuCode;

  @NotBlank(message = "Product name is required")
  @Column(name = "product_name", nullable = false, length = 200)
  private String productName;

  @NotNull(message = "Unit price is required")
  @DecimalMin(value = "0.00", message = "Price cannot be negative")
  @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
  private BigDecimal unitPrice;

  @NotNull(message = "Quantity is required")
  @Min(value = 1, message = "Quantity must be at least 1")
  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @ComputedField(
      operation = EnterpriseOperationConstant.COMPUTE_MULTIPLY,
      sourceFields = {"unitPrice", "quantity"}
  )
  @Column(name = "subtotal", precision = 12, scale = 2)
  private BigDecimal subtotal;
}
