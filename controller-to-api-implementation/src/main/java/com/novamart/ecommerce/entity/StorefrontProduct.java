package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
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
 * Storefront product catalog entity with automatic slug, SKU uniqueness, and supplier cost masking.
 */
@Entity
@Table(
    name = "tbl_storefront_products",
    indexes = {
      @Index(name = "idx_storefront_products_sku", columnList = "sku", unique = true),
      @Index(name = "idx_storefront_products_slug", columnList = "slug", unique = true),
      @Index(name = "idx_storefront_products_cat", columnList = "category_code")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
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
public class StorefrontProduct extends BaseAuditEntity {

  @UniqueField
  @NotBlank
  @Column(name = "sku", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String sku;

  @NotBlank
  @Column(name = "name", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String name;

  @UniqueField
  @AutoSlug(sourceField = NovaFieldConstant.FIELD_NAME)
  @Column(name = "slug", nullable = false, length = NovaNumericConstant.COL_LEN_SLUG)
  private String slug;

  @NotBlank
  @Column(name = "category_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String categoryCode;

  @Column(name = "brand", length = NovaNumericConstant.COL_LEN_CODE)
  private String brand;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "retail_price",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal retailPrice;

  @FieldSecurity(
      viewRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true)
  @Column(
      name = "supplier_cost",
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal supplierCost;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
