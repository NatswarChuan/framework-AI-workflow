package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import io.github.natswarchuan.module.event.annotation.PublishCloudEvent;
import io.github.natswarchuan.module.webhook.annotation.EntityWebhook;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Checkout payment entity emitting post-commit CloudEvents, Outbox events, and signed Webhooks.
 */
@Entity
@Table(
    name = "tbl_checkout_payments",
    indexes = {
      @Index(name = "idx_checkout_payments_ref", columnList = "payment_ref", unique = true),
      @Index(name = "idx_checkout_payments_order", columnList = "order_number")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntityWebhook(
    events = {
      NovaFieldConstant.WEBHOOK_EVENT_CREATED,
      NovaFieldConstant.WEBHOOK_EVENT_UPDATED,
      NovaFieldConstant.WEBHOOK_EVENT_STATE_CHANGED
    },
    secretHeader = NovaFieldConstant.WEBHOOK_SECRET_HEADER,
    includeFullPayload = true)
@PublishCloudEvent(
    eventType = NovaFieldConstant.CLOUD_EVENT_PAYMENT_TYPE,
    source = NovaPathConstant.CLOUD_EVENT_PAYMENT_SOURCE)
@EntitySecurity(
    readRoles = {
      NovaRoleConstant.ROLE_USER,
      NovaRoleConstant.ROLE_MERCHANT,
      NovaRoleConstant.ROLE_ADMIN,
      NovaRoleConstant.ROLE_SUPER_ADMIN
    },
    writeRoles = {
      NovaRoleConstant.ROLE_USER,
      NovaRoleConstant.ROLE_MERCHANT,
      NovaRoleConstant.ROLE_ADMIN,
      NovaRoleConstant.ROLE_SUPER_ADMIN
    },
    deleteRoles = {NovaRoleConstant.ROLE_SUPER_ADMIN})
public class CheckoutPayment extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = NovaFieldConstant.PREFIX_PAYMENT_CODE)
  @Column(name = "payment_ref", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String paymentRef;

  @NotBlank
  @Column(name = "order_number", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String orderNumber;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "amount",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal amount;

  @NotBlank
  @Column(name = "currency", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String currency;

  @NotBlank
  @Column(name = "payment_method", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String paymentMethod;

  @NotBlank
  @Column(name = "payment_status", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String paymentStatus;
}
