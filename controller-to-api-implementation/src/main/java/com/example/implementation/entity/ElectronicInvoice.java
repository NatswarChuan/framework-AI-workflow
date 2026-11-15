package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
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
 * Electronic tax invoice entity for B2C2B2C marketplace settlements.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link AutoCode}: Generates unique legal invoice series numbers {@code INV-ECOM-XXXXXXXX}.</li>
 *   <li>{@link UniqueField}: Guaranteed invoice number uniqueness.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_electronic_invoices",
    indexes = {
        @Index(name = "idx_e_invoices_no", columnList = "invoice_number", unique = true),
        @Index(name = "idx_e_invoices_order", columnList = "order_code")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ElectronicInvoice extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "INV-ECOM-")
  @Column(name = "invoice_number", nullable = false, length = 32)
  private String invoiceNumber;

  @NotBlank(message = "Order code is required")
  @Column(name = "order_code", nullable = false, length = 32)
  private String orderCode;

  @NotBlank(message = "Tax code is required")
  @Column(name = "tax_code", nullable = false, length = 32)
  private String taxCode;

  @NotBlank(message = "Buyer legal name is required")
  @Column(name = "buyer_name", nullable = false, length = 150)
  private String buyerName;

  @NotNull(message = "Pre-tax amount is required")
  @DecimalMin(value = "0.00", message = "Amount must be positive")
  @Column(name = "pre_tax_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal preTaxAmount;

  @NotNull(message = "Tax rate percentage is required")
  @DecimalMin(value = "0.00", message = "Tax rate cannot be negative")
  @Column(name = "tax_rate", nullable = false, precision = 5, scale = 2)
  private BigDecimal taxRate;

  @NotNull(message = "Tax amount is required")
  @DecimalMin(value = "0.00", message = "Tax amount cannot be negative")
  @Column(name = "tax_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal taxAmount;

  @Column(name = "total_invoiced_amount", precision = 12, scale = 2)
  private BigDecimal totalInvoicedAmount;

  @Column(name = "status", nullable = false, length = 32)
  private String status;
}
