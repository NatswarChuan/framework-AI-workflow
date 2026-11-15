package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.EnterpriseOperationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.ComputedField;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
 * Shopping cart entity representing customer or reseller shopping baskets.
 *
 * <p>Demonstrates automatic calculation via {@link ComputedField} aggregating
 * item totals and cart total amounts.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_shopping_carts",
    indexes = {
        @Index(name = "idx_shopping_carts_user", columnList = "user_email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ShoppingCart extends BaseAuditEntity {

  @NotBlank(message = "User email is required")
  @Email(message = "Valid email required")
  @Column(name = "user_email", nullable = false, length = 100)
  private String userEmail;

  @Column(name = "currency", nullable = false, length = 3)
  private String currency;

  @ComputedField(
      operation = EnterpriseOperationConstant.COMPUTE_SUM_COLLECTION,
      collectionField = "items",
      itemField = "subtotal"
  )
  @Column(name = "total_amount", precision = 12, scale = 2)
  private BigDecimal totalAmount;

  @Builder.Default
  @OneToMany(mappedBy = "shoppingCart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<CartItem> items = new ArrayList<>();
}
