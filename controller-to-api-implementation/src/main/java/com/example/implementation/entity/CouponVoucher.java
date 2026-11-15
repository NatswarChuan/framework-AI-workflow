package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
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
 * Promotional coupon voucher entity.
 *
 * <p>Equipped with declarative framework features:
 * <ul>
 *   <li>{@link UniqueField}: Unique promotional code across the platform.</li>
 *   <li>Discount parameters and minimum order threshold validations.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_coupon_vouchers",
    indexes = {
        @Index(name = "idx_coupon_vouchers_code", columnList = "coupon_code", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class CouponVoucher extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = "Coupon code is required")
  @Column(name = "coupon_code", nullable = false, length = 64)
  private String couponCode;

  @NotBlank(message = "Coupon title is required")
  @Column(name = "title", nullable = false, length = 100)
  private String title;

  @NotNull(message = "Discount amount is required")
  @DecimalMin(value = "0.01", message = "Discount must be positive")
  @Column(name = "discount_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal discountAmount;

  @NotNull(message = "Minimum order amount is required")
  @DecimalMin(value = "0.00", message = "Minimum order cannot be negative")
  @Column(name = "min_order_amount", nullable = false, precision = 12, scale = 2)
  private BigDecimal minOrderAmount;

  @Column(name = "max_uses")
  private Integer maxUses;

  @Column(name = "current_uses")
  private Integer currentUses;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
