package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
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
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Product catalog entity representing multi-tier master products in the B2C2B2C marketplace.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link EntitySecurity}: Read open to customers, creation/modification by vendor and platform admins.</li>
 *   <li>{@link FieldSecurity}: Masking the wholesale {@code costPrice} from end-consumers and resellers.</li>
 *   <li>{@link AutoSlug}: Generating SEO-optimized product URLs from product title.</li>
 *   <li>{@link UniqueField}: Guaranteed SKU uniqueness across the entire marketplace.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_product_catalogs",
    indexes = {
        @Index(name = "idx_product_catalogs_sku", columnList = "sku_code", unique = true),
        @Index(name = "idx_product_catalogs_slug", columnList = "slug", unique = true),
        @Index(name = "idx_product_catalogs_vendor", columnList = "vendor_store_code")
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
public class ProductCatalog extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = "SKU code is required")
  @Size(max = 64, message = "SKU code must not exceed 64 characters")
  @Column(name = "sku_code", nullable = false, length = 64)
  private String skuCode;

  @NotBlank(message = "Product name is required")
  @Size(max = 200, message = "Product name must not exceed 200 characters")
  @Column(name = "product_name", nullable = false, length = 200)
  private String productName;

  @UniqueField
  @AutoSlug(sourceField = "productName")
  @Column(name = "slug", nullable = false, length = 250)
  private String slug;

  @NotBlank(message = "Category is required")
  @Column(name = "category", nullable = false, length = 64)
  private String category;

  @Column(name = "brand", length = 64)
  private String brand;

  @NotBlank(message = "Vendor store code is required")
  @Column(name = "vendor_store_code", nullable = false, length = 32)
  private String vendorStoreCode;

  @NotNull(message = "Retail consumer price is required")
  @DecimalMin(value = "0.00", message = "Retail price must be positive")
  @Column(name = "retail_price", nullable = false, precision = 12, scale = 2)
  private BigDecimal retailPrice;

  @NotNull(message = "B2B reseller wholesale price is required")
  @DecimalMin(value = "0.00", message = "B2B price must be positive")
  @Column(name = "b2b_wholesale_price", nullable = false, precision = 12, scale = 2)
  private BigDecimal b2bWholesalePrice;

  /**
   * Internal vendor production cost price.
   * Strictly nullified from callers lacking vendor/platform admin roles.
   */
  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Column(name = "cost_price", precision = 12, scale = 2)
  private BigDecimal costPrice;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
