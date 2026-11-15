package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
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
 * Department entity representing corporate functional divisions linked {@code @ManyToOne} to {@link Company}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@EntitySecurity(permitAll = true)
@Table(
    name = DatabaseSchemaConstant.TABLE_DEPARTMENTS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_DEPARTMENTS_CODE,
            columnList = DatabaseSchemaConstant.COL_CODE,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_DEPARTMENTS_COMPANY_ID,
            columnList = DatabaseSchemaConstant.COL_COMPANY_ID
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Department extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_CODE_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_CODE_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_CODE,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_CODE_LENGTH
  )
  private String code;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_NAME,
      nullable = false,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String name;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(
      name = DatabaseSchemaConstant.COL_ANNUAL_BUDGET,
      nullable = false,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal annualBudget;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_COMPANY_ID)
  private Company company;
}
