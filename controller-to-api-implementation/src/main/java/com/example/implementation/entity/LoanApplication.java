package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.StateMachine;
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
 * FinTech lending domain entity representing a commercial loan application.
 * Manages underwriting workflows through multi-stage state transitions.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_loan_applications",
    indexes = {
        @Index(name = "idx_loan_applications_code", columnList = "loan_reference_code", unique = true),
        @Index(name = "idx_loan_applications_status", columnList = "loan_status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}
)
public class LoanApplication extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "LOAN-")
  @Column(name = "loan_reference_code", nullable = false, length = 32)
  private String loanReferenceCode;

  @NotBlank
  @Size(max = 100)
  @Column(name = "applicant_name", nullable = false, length = 100)
  private String applicantName;

  @NotBlank
  @Size(max = 100)
  @Column(name = "applicant_email", nullable = false, length = 100)
  private String applicantEmail;

  @NotNull
  @Column(name = "principal_amount", nullable = false, precision = 18, scale = 2)
  private BigDecimal principalAmount;

  @NotNull
  @Column(name = "interest_rate", nullable = false, precision = 5, scale = 2)
  private BigDecimal interestRate;

  @NotNull
  @Column(name = "term_months", nullable = false)
  private Integer termMonths;

  @Column(name = "credit_score")
  private Integer creditScore;

  @StateMachine(
      initial = "SUBMITTED",
      transitions = {
          "SUBMITTED:UNDERWRITING,REJECTED",
          "UNDERWRITING:RISK_ASSESSED,REJECTED",
          "RISK_ASSESSED:APPROVED,REJECTED",
          "APPROVED:DISBURSED"
      },
      deletableStates = {"SUBMITTED", "REJECTED"}
  )
  @Column(name = "loan_status", nullable = false, length = 32)
  private String loanStatus;
}
