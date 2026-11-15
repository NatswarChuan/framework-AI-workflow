package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.HumanPolicy;
import io.github.natswarchuan.core.annotation.MultiTenant;
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
 * SaaS and Subscription domain entity governed entirely by natural-language business policies.
 *
 * <p>Demonstrates the developer-friendly Human-Language Policy engine:
 * lifecycle state progression, RBAC authorization, and field masking are declared
 * using natural, spoken-like English sentences rather than cryptic annotation syntax.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_subscription_contracts",
    indexes = {
        @Index(name = "idx_subscription_contracts_code", columnList = "contract_code", unique = true),
        @Index(name = "idx_subscription_contracts_status", columnList = "contract_status")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@MultiTenant(tenantField = "tenantId")
@HumanPolicy(
    lifecycle = "Starts at DRAFT. From DRAFT can transition to ACTIVE or CANCELLED. "
              + "From ACTIVE can transition to SUSPENDED or EXPIRED. From SUSPENDED can transition to ACTIVE or CANCELLED. "
              + "Allow deletion only when DRAFT or CANCELLED.",
    security = "Allow read for USER, ADMIN, OPERATOR. Allow write for OPERATOR, ADMIN. Allow delete for SUPER_ADMIN.",
    masking = "Mask recurringAmount for USER with asterisks. Nullify clientTaxNumber for non-ADMIN.",
    stateField = "contractStatus"
)
public class SubscriptionContract extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "SUB-")
  @Column(name = "contract_code", nullable = false, length = 32)
  private String contractCode;

  @NotBlank
  @Size(max = 120)
  @Column(name = "subscriber_name", nullable = false, length = 120)
  private String subscriberName;

  @NotBlank
  @Size(max = 100)
  @Column(name = "subscriber_email", nullable = false, length = 100)
  private String subscriberEmail;

  @NotBlank
  @Size(max = 64)
  @Column(name = "subscription_tier", nullable = false, length = 64)
  private String subscriptionTier;

  @NotNull
  @Column(name = "recurring_amount", nullable = false, precision = 18, scale = 2)
  private BigDecimal recurringAmount;

  @Column(name = "billing_period", nullable = false, length = 16)
  private String billingPeriod;

  @Column(name = "client_tax_number", length = 32)
  private String clientTaxNumber;

  @Column(name = "contract_status", nullable = false, length = 32)
  private String contractStatus;

  @Column(name = "tenant_id", length = 64)
  private String tenantId;
}

