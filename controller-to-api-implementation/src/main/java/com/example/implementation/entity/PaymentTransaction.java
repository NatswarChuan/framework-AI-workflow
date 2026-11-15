package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.Idempotent;
import io.github.natswarchuan.core.annotation.UniqueField;
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
 * Payment transaction entity recording financial settlements.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link Idempotent}: Guaranteed duplicate payment protection via header key.</li>
 *   <li>{@link AutoCode}: Generates unique transaction references {@code TXN-XXXXXXXX}.</li>
 *   <li>{@link UniqueField}: Enforces uniqueness on transaction reference.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_payment_transactions",
    indexes = {
        @Index(name = "idx_payment_txns_ref", columnList = "transaction_reference", unique = true),
        @Index(name = "idx_payment_txns_order", columnList = "order_code")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 86400L)
public class PaymentTransaction extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "TXN-")
  @Column(name = "transaction_reference", nullable = false, length = 32)
  private String transactionReference;

  @NotBlank(message = "Order code is required")
  @Column(name = "order_code", nullable = false, length = 32)
  private String orderCode;

  @NotBlank(message = "Payment method is required")
  @Column(name = "payment_method", nullable = false, length = 32)
  private String paymentMethod;

  @NotNull(message = "Payment amount is required")
  @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
  @Column(name = "amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal amount;

  @Column(name = "currency", nullable = false, length = 3)
  private String currency;

  @NotBlank(message = "Payment status is required")
  @Column(name = "status", nullable = false, length = 32)
  private String status;

  @Column(name = "gateway_provider", length = 64)
  private String gatewayProvider;

  @Column(name = "gateway_response_code", length = 64)
  private String gatewayResponseCode;
}
