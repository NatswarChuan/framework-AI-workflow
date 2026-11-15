package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.EnterpriseOperationConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.ComputedField;
import io.github.natswarchuan.core.annotation.StateMachine;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
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
 * CustomerOrder entity demonstrating declarative enterprise mechanics:
 * <ul>
 *   <li>{@link AutoCode}: Generates sequential {@code ORD-XXXXXXXX} codes when omitted.</li>
 *   <li>{@link StateMachine}: Governs order lifecycle transitions and blocks deletion of finalized orders.</li>
 *   <li>{@link ComputedField}: Computes gross aggregate amounts minus discount plus shipping fee.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_CUSTOMER_ORDERS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_ORDERS_NUMBER,
            columnList = DatabaseSchemaConstant.COL_ORDER_NUMBER,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_ORDERS_CUSTOMER_ID,
            columnList = DatabaseSchemaConstant.COL_CUSTOMER_ID
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_ORDERS_STATUS,
            columnList = DatabaseSchemaConstant.COL_ORDER_STATUS
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class CustomerOrder extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = BusinessDomainConstant.PREFIX_ORDER_CODE)
  @Size(max = ValidationConstant.LENGTH_60, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_ORDER_NUMBER,
      nullable = false,
      unique = true,
      length = ValidationConstant.LENGTH_60
  )
  private String orderNumber;

  @StateMachine(
      initial = BusinessDomainConstant.STATE_PENDING,
      transitions = {
          BusinessDomainConstant.RULE_PENDING_TO_NEXT,
          BusinessDomainConstant.RULE_CONFIRMED_TO_NEXT,
          BusinessDomainConstant.RULE_PAID_TO_NEXT,
          BusinessDomainConstant.RULE_SHIPPED_TO_NEXT
      },
      deletableStates = {
          BusinessDomainConstant.STATE_PENDING,
          BusinessDomainConstant.STATE_CANCELLED
      }
  )
  @Size(max = ValidationConstant.LENGTH_30, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_ORDER_STATUS,
      nullable = false,
      length = ValidationConstant.LENGTH_30
  )
  private String orderStatus;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(
      name = DatabaseSchemaConstant.COL_DISCOUNT_AMOUNT,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal discountAmount;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(
      name = DatabaseSchemaConstant.COL_SHIPPING_FEE,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal shippingFee;

  @ComputedField(
      operation = EnterpriseOperationConstant.COMPUTE_SUM_COLLECTION,
      collectionField = DatabaseSchemaConstant.PROP_ITEMS,
      itemField = DatabaseSchemaConstant.PROP_SUB_TOTAL,
      subtractField = DatabaseSchemaConstant.PROP_DISCOUNT_AMOUNT,
      addField = DatabaseSchemaConstant.PROP_SHIPPING_FEE
  )
  @Column(
      name = DatabaseSchemaConstant.COL_TOTAL_AMOUNT,
      nullable = false,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal totalAmount;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_CUSTOMER_ID)
  private Customer customer;

  @Builder.Default
  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_ORDER_ID)
  private List<OrderItem> items = new ArrayList<>();
}
