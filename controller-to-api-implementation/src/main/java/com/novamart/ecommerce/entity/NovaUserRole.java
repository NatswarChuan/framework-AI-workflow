package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.SecurityUserRoleEntity;
import io.github.natswarchuan.core.annotation.UserRoleCode;
import io.github.natswarchuan.core.annotation.UserRoleSubject;
import io.github.natswarchuan.core.annotation.UserRoleTenantId;
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
 * Dynamic Database RBAC User-Role assignment entity binding subjects to roles and tenant scopes.
 */
@Entity
@Table(
    name = "tbl_nova_user_roles",
    indexes = {
      @Index(name = "idx_nova_user_roles_subject", columnList = "username, role_code")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@SecurityUserRoleEntity(enabled = true)
@EntitySecurity(
    readRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
public class NovaUserRole extends BaseAuditEntity {

  @UserRoleSubject
  @NotBlank
  @Column(name = "username", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String username;

  @UserRoleCode
  @NotBlank
  @Column(name = "role_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String roleCode;

  @UserRoleTenantId
  @Column(name = "tenant_id", length = NovaNumericConstant.COL_LEN_CODE)
  private String tenantId;
}
