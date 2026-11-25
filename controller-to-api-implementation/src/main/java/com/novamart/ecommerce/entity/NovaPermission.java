package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.PermissionAction;
import io.github.natswarchuan.core.annotation.PermissionCode;
import io.github.natswarchuan.core.annotation.PermissionFieldMask;
import io.github.natswarchuan.core.annotation.PermissionResource;
import io.github.natswarchuan.core.annotation.SecurityPermissionEntity;
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
 * Dynamic Database RBAC Permission entity defining resource, action, and dynamic field masking.
 */
@Entity
@Table(
    name = "tbl_nova_permissions",
    indexes = {
      @Index(name = "idx_nova_permissions_code", columnList = "permission_code", unique = true)
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@SecurityPermissionEntity(cacheTtlSeconds = NovaNumericConstant.RBAC_CACHE_TTL_SECONDS)
@EntitySecurity(
    readRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
public class NovaPermission extends BaseAuditEntity {

  @PermissionCode
  @UniqueField
  @NotBlank
  @Column(name = "permission_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String permissionCode;

  @PermissionResource
  @NotBlank
  @Column(name = "resource_name", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String resourceName;

  @PermissionAction
  @NotBlank
  @Column(name = "action_name", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String actionName;

  @PermissionFieldMask
  @Column(name = "masked_fields", length = NovaNumericConstant.COL_LEN_CSV)
  private String maskedFields;
}
