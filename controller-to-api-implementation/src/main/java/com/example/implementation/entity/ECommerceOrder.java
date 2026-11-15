package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.EnterpriseOperationConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AuditTrail;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.ComputedField;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.StateMachine;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Multi-tier e-commerce order entity for B2C2B2C marketplace transactions.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link AutoCode}: Sequential order codes prefixed with {@code ORD-B2C2B2C-}.</li>
 *   <li>{@link StateMachine}: Strict state transitions from {@code CREATED} to {@code DELIVERED} or {@code CANCELLED}.</li>
 *   <li>{@link ComputedField}: Evaluates total amount = gross + shipping - discount.</li>
 *   <li>{@link AuditTrail}: Records all mutation events and transitions into audit log.</li>
 *   <li>{@link EntitySecurity}: Controlled access across customer, reseller, vendor and platform admin.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_ecommerce_orders",
    indexes = {
        @Index(name = "idx_ecom_orders_code", columnList = "order_code", unique = true),
        @Index(name = "idx_ecom_orders_status", columnList = "order_status"),
        @Index(name = "idx_ecom_orders_customer", columnList = "customer_email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@AuditTrail(category = "ECOMMERCE_ORDER_AUDIT")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN, RoleConstant.ROLE_OPERATOR},
    writeRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN, RoleConstant.ROLE_OPERATOR},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class ECommerceOrder extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "ORD-B2C2B2C-")
  @Column(name = "order_code", nullable = false, length = 32)
  private String orderCode;

  @StateMachine(
      initial = "CREATED",
      transitions = {
          "CREATED:PENDING_PAYMENT,CANCELLED",
          "PENDING_PAYMENT:CONFIRMED,CANCELLED",
          "CONFIRMED:ALLOCATED,REFUNDED",
          "ALLOCATED:SHIPPED",
          "SHIPPED:DELIVERED",
          "DELIVERED:COMPLETED"
      },
      deletableStates = {"CREATED", "CANCELLED"}
  )
  @NotBlank(message = "Order status is required")
  @Column(name = "order_status", nullable = false, length = 32)
  private String orderStatus;

  @NotBlank(message = "Customer email is required")
  @Email(message = "Valid email is required")
  @Column(name = "customer_email", nullable = false, length = 100)
  private String customerEmail;

  @NotBlank(message = "Customer name is required")
  @Column(name = "customer_name", nullable = false, length = 100)
  private String customerName;

  @NotBlank(message = "Shipping address is required")
  @Column(name = "shipping_address", nullable = false, length = 255)
  private String shippingAddress;

  @Column(name = "vendor_store_code", length = 32)
  private String vendorStoreCode;

  @Column(name = "reseller_partner_code", length = 32)
  private String resellerPartnerCode;

  @NotNull(message = "Gross amount is required")
  @DecimalMin(value = "0.00", message = "Amount must be positive")
  @Column(name = "gross_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal grossAmount;

  @NotNull(message = "Discount amount is required")
  @DecimalMin(value = "0.00", message = "Discount cannot be negative")
  @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal discountAmount;

  @NotNull(message = "Shipping fee is required")
  @DecimalMin(value = "0.00", message = "Shipping fee cannot be negative")
  @Column(name = "shipping_fee", nullable = false, precision = 12, scale = 2)
  private BigDecimal shippingFee;

  @ComputedField(
      operation = EnterpriseOperationConstant.COMPUTE_SUM_COLLECTION,
      collectionField = "items",
      itemField = "lineTotal",
      subtractField = "discountAmount",
      addField = "shippingFee"
  )
  @Column(name = "total_amount", precision = 12, scale = 2)
  private BigDecimal totalAmount;

  @Column(name = "currency", nullable = false, length = 3)
  private String currency;

  @Builder.Default
  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  @JoinColumn(name = "order_id")
  private List<ECommerceOrderItem> items = new ArrayList<>();
}
