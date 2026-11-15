package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
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
 * FinTech banking domain entity representing a commercial bank ledger account.
 * Features atomic balance increments and declarative field security on tax identifiers.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_bank_accounts",
    indexes = {
        @Index(name = "idx_bank_accounts_num", columnList = "account_number", unique = true),
        @Index(name = "idx_bank_accounts_iban", columnList = "iban_routing_number", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class BankAccount extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "ACC-")
  @Column(name = "account_number", nullable = false, length = 32)
  private String accountNumber;

  @NotBlank
  @Size(max = 100)
  @Column(name = "account_holder_name", nullable = false, length = 100)
  private String accountHolderName;

  @NotBlank
  @UniqueField
  @Size(max = 64)
  @Column(name = "iban_routing_number", nullable = false, length = 64)
  private String ibanRoutingNumber;

  @NotBlank
  @Size(max = 16)
  @Column(name = "account_type", nullable = false, length = 16)
  private String accountType;

  @NotNull
  @Column(name = "current_balance", nullable = false, precision = 18, scale = 2)
  private BigDecimal currentBalance;

  @Column(name = "currency", nullable = false, length = 8)
  private String currency;

  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Column(name = "tax_identifier", length = 32)
  private String taxIdentifier;

  @Column(name = "status", nullable = false, length = 16)
  private String status;
}
