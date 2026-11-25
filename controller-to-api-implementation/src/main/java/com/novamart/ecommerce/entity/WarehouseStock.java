package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Warehouse inventory entity storing available and reserved SKU stock levels for flash sales.
 */
@Entity
@Table(
    name = "tbl_warehouse_stocks",
    indexes = {
      @Index(name = "idx_warehouse_stocks_sku", columnList = "sku", unique = true),
      @Index(name = "idx_warehouse_stocks_wh", columnList = "warehouse_code")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {
      NovaRoleConstant.ROLE_USER,
      NovaRoleConstant.ROLE_MERCHANT,
      NovaRoleConstant.ROLE_ADMIN,
      NovaRoleConstant.ROLE_SUPER_ADMIN
    },
    writeRoles = {
      NovaRoleConstant.ROLE_MERCHANT,
      NovaRoleConstant.ROLE_ADMIN,
      NovaRoleConstant.ROLE_SUPER_ADMIN
    },
    deleteRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN})
public class WarehouseStock extends BaseAuditEntity {

  @UniqueField
  @NotBlank
  @Column(name = "sku", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String sku;

  @NotBlank
  @Column(name = "warehouse_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String warehouseCode;

  @NotNull
  @Min(NovaNumericConstant.INT_ZERO)
  @Column(name = "available_quantity", nullable = false)
  private Integer availableQuantity;

  @NotNull
  @Min(NovaNumericConstant.INT_ZERO)
  @Column(name = "reserved_quantity", nullable = false)
  private Integer reservedQuantity;
}
