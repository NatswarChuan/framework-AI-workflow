package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.RoleCode;
import io.github.natswarchuan.core.annotation.RoleName;
import io.github.natswarchuan.core.annotation.RolePermissions;
import io.github.natswarchuan.core.annotation.SecurityRoleEntity;
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
 * Dynamic Database RBAC Role catalog entity managed at runtime by Spring-NWVMC.
 */
@Entity
@Table(
    name = "tbl_nova_roles",
    indexes = {@Index(name = "idx_nova_roles_code", columnList = "role_code", unique = true)})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@SecurityRoleEntity(cacheTtlSeconds = NovaNumericConstant.RBAC_CACHE_TTL_SECONDS)
@EntitySecurity(
    readRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
public class NovaRole extends BaseAuditEntity {

  @RoleCode
  @UniqueField
  @NotBlank
  @Column(name = "role_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String roleCode;

  @RoleName
  @NotBlank
  @Column(name = "role_name", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String roleName;

  @RolePermissions
  @Column(name = "permissions_csv", length = NovaNumericConstant.COL_LEN_CSV)
  private String permissionsCsv;
}
