package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Storefront category entity organizing NovaMart products with automatic slug generation.
 */
@Entity
@Table(
    name = "tbl_store_categories",
    indexes = {
      @Index(name = "idx_store_categories_code", columnList = "code", unique = true),
      @Index(name = "idx_store_categories_slug", columnList = "slug", unique = true)
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
public class StoreCategory extends BaseAuditEntity {

  @UniqueField
  @NotBlank
  @Column(name = "code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String code;

  @NotBlank
  @Column(name = "name", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String name;

  @UniqueField
  @AutoSlug(sourceField = NovaFieldConstant.FIELD_NAME)
  @Column(name = "slug", nullable = false, length = NovaNumericConstant.COL_LEN_SLUG)
  private String slug;

  @Column(name = "description", length = NovaNumericConstant.COL_LEN_CSV)
  private String description;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
