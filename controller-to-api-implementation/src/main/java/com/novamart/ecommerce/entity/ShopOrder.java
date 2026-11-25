package com.novamart.ecommerce.entity;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AuditTrail;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.StateMachine;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
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
 * Customer order entity with AutoCode numbering, strict StateMachine lifecycle, and AuditTrail.
 */
@Entity
@Table(
    name = "tbl_shop_orders",
    indexes = {
      @Index(name = "idx_shop_orders_number", columnList = "order_number", unique = true),
      @Index(name = "idx_shop_orders_status", columnList = "order_status")
    })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@AuditTrail(category = NovaFieldConstant.AUDIT_CATEGORY_SHOP_ORDER, recordFieldDiffs = true)
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
    deleteRoles = {NovaRoleConstant.ROLE_ADMIN, NovaRoleConstant.ROLE_SUPER_ADMIN})
public class ShopOrder extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = NovaFieldConstant.PREFIX_ORDER_CODE)
  @Column(name = "order_number", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String orderNumber;

  @NotBlank
  @Email
  @Column(name = "customer_email", nullable = false, length = NovaNumericConstant.COL_LEN_NAME)
  private String customerEmail;

  @NotBlank
  @Column(name = "merchant_code", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String merchantCode;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "subtotal_amount",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal subtotalAmount;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "discount_amount",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal discountAmount;

  @NotNull
  @DecimalMin(NovaNumericConstant.DECIMAL_MIN_ZERO)
  @Column(
      name = "total_amount",
      nullable = false,
      precision = NovaNumericConstant.MONEY_PRECISION,
      scale = NovaNumericConstant.MONEY_SCALE)
  private BigDecimal totalAmount;

  @StateMachine(
      initial = NovaFieldConstant.ORDER_STATE_DRAFT,
      transitions = {
        NovaFieldConstant.TRANSITION_FROM_DRAFT,
        NovaFieldConstant.TRANSITION_FROM_PENDING,
        NovaFieldConstant.TRANSITION_FROM_PAID,
        NovaFieldConstant.TRANSITION_FROM_SHIPPED
      },
      deletableStates = {
        NovaFieldConstant.ORDER_STATE_DRAFT,
        NovaFieldConstant.ORDER_STATE_CANCELLED
      })
  @Column(name = "order_status", nullable = false, length = NovaNumericConstant.COL_LEN_CODE)
  private String orderStatus;
}
