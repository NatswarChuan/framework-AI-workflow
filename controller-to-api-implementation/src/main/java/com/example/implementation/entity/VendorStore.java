package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Vendor store entity representing a merchant partner storefront in the B2C2B2C marketplace.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link EntitySecurity}: Restricted creation/deletion to Platform and Vendor admins.</li>
 *   <li>{@link AutoCode}: Automatically generates vendor store codes prefixed with {@code VND-}.</li>
 *   <li>{@link AutoSlug}: Automatically produces URL slugs derived from the store name.</li>
 *   <li>{@link UniqueField}: Enforces strict uniqueness on the store code and slug.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_vendor_stores",
    indexes = {
        @Index(name = "idx_vendor_stores_code", columnList = "store_code", unique = true),
        @Index(name = "idx_vendor_stores_slug", columnList = "slug", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class VendorStore extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "VND-")
  @Column(name = "store_code", nullable = false, length = 32)
  private String storeCode;

  @NotBlank(message = "Store name is required")
  @Size(max = 100, message = "Store name must not exceed 100 characters")
  @Column(name = "store_name", nullable = false, length = 100)
  private String storeName;

  @UniqueField
  @AutoSlug(sourceField = "storeName")
  @Column(name = "slug", nullable = false, length = 120)
  private String slug;

  @Column(name = "business_license", length = 64)
  private String businessLicense;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
