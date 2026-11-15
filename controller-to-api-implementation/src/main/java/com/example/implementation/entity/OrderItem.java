package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.EnterpriseOperationConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.ComputedField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Order item entity with declarative subtotal calculation ({@code subTotal = unitPrice * quantity})
 * via {@link ComputedField}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_ORDER_ITEMS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_ORDER_ITEMS_PRODUCT_NAME,
            columnList = DatabaseSchemaConstant.COL_PRODUCT_NAME
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class OrderItem extends BaseAuditEntity {

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_200, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_PRODUCT_NAME,
      nullable = false,
      length = ValidationConstant.LENGTH_200
  )
  private String productName;

  @Positive(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(name = DatabaseSchemaConstant.COL_QUANTITY, nullable = false)
  private Integer quantity;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(
      name = DatabaseSchemaConstant.COL_UNIT_PRICE,
      nullable = false,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal unitPrice;

  @ComputedField(
      operation = EnterpriseOperationConstant.COMPUTE_MULTIPLY,
      sourceFields = {
          DatabaseSchemaConstant.PROP_UNIT_PRICE,
          DatabaseSchemaConstant.PROP_QUANTITY
      }
  )
  @Column(
      name = DatabaseSchemaConstant.COL_SUB_TOTAL,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal subTotal;
}
