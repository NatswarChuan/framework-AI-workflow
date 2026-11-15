package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Inventory stock entity representing warehouse or store inventory nodes.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link EntitySecurity}: Access control for stock manipulation.</li>
 *   <li>{@link UniqueField}: Unique stock SKU per warehouse location.</li>
 *   <li>Atomic increment and decrement capabilities via {@code PATCH /increment}.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_inventory_stocks",
    indexes = {
        @Index(name = "idx_inventory_stocks_sku", columnList = "stock_sku_code", unique = true),
        @Index(name = "idx_inventory_stocks_wh", columnList = "warehouse_code")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN, RoleConstant.ROLE_OPERATOR},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class InventoryStock extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = "Stock SKU code is required")
  @Size(max = 64, message = "Stock SKU code must not exceed 64 characters")
  @Column(name = "stock_sku_code", nullable = false, length = 64)
  private String stockSkuCode;

  @NotBlank(message = "Product SKU reference is required")
  @Column(name = "product_sku_code", nullable = false, length = 64)
  private String productSkuCode;

  @NotBlank(message = "Warehouse code is required")
  @Column(name = "warehouse_code", nullable = false, length = 64)
  private String warehouseCode;

  @NotNull(message = "Available quantity is required")
  @PositiveOrZero(message = "Available quantity cannot be negative")
  @Column(name = "available_quantity", nullable = false)
  private Integer availableQuantity;

  @NotNull(message = "Reserved quantity is required")
  @PositiveOrZero(message = "Reserved quantity cannot be negative")
  @Column(name = "reserved_quantity", nullable = false)
  private Integer reservedQuantity;

  @Column(name = "low_stock_threshold")
  private Integer lowStockThreshold;
}
