package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.PolicyAction;
import io.github.natswarchuan.core.annotation.PolicyAllowedRoles;
import io.github.natswarchuan.core.annotation.PolicyEffect;
import io.github.natswarchuan.core.annotation.PolicyResource;
import io.github.natswarchuan.core.annotation.SecurityPolicyEntity;
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
 * Dynamic Database RBAC Access Policy entity supporting ALLOW and explicit DENY overrides.
 */
@Entity
@Table(
    name = "tbl_nova_access_policies",
    indexes = {
      @Index(name = "idx_nova_access_policies_res_act", columnList = "resource_pattern, action_pattern")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@SecurityPolicyEntity(priority = NovaNumericConstant.RBAC_POLICY_PRIORITY)
@EntitySecurity(
    readRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
public class NovaAccessPolicy extends BaseAuditEntity {

  @PolicyResource
  @NotBlank
  @Column(name = "resource_pattern", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String resourcePattern;

  @PolicyAction
  @NotBlank
  @Column(name = "action_pattern", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String actionPattern;

  @PolicyAllowedRoles
  @NotBlank
  @Column(name = "target_roles", nullable = false, length = NovaNumericConstant.COL_LEN_CSV)
  private String targetRoles;

  @PolicyEffect
  @NotBlank
  @Column(name = "effect", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String effect;
}
