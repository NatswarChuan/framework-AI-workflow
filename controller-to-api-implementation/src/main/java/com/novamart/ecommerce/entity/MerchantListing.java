package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.MultiTenant;
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
 * Multi-tenant merchant product listing enforcing strict fail-closed X-Tenant-ID isolation.
 */
@Entity
@Table(
    name = "tbl_merchant_listings",
    indexes = {
      @Index(name = "idx_merchant_listings_tenant_id", columnList = "merchant_tenant_id, id"),
      @Index(name = "idx_merchant_listings_code", columnList = "listing_code", unique = true)
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@MultiTenant(
    tenantField = NovaFieldConstant.FIELD_MERCHANT_TENANT_ID,
    bypassTenantRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
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
public class MerchantListing extends BaseAuditEntity {

  @Column(name = "merchant_tenant_id", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String merchantTenantId;

  @UniqueField
  @AutoCode(prefix = NovaFieldConstant.PREFIX_LISTING_CODE)
  @Column(name = "listing_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String listingCode;

  @NotBlank
  @Column(name = "product_sku", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String productSku;

  @NotBlank
  @Column(name = "title", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String title;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "listing_price",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal listingPrice;

  @Column(name = "status", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String status;
}
