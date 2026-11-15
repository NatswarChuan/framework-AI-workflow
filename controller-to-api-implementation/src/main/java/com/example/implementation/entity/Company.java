package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Company entity representing root enterprise organizations in multi-tier relational chains
 * ({@code Company <- Department <- Customer <- CustomerOrder}).
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_COMPANIES,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_COMPANIES_TAX_CODE,
            columnList = DatabaseSchemaConstant.COL_TAX_CODE,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_COMPANIES_COUNTRY_CODE,
            columnList = DatabaseSchemaConstant.COL_COUNTRY_CODE
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Company extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_CODE_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_CODE_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_TAX_CODE,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_CODE_LENGTH
  )
  private String taxCode;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_200, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_NAME,
      nullable = false,
      length = ValidationConstant.LENGTH_200
  )
  private String name;

  @NotBlank(message = ValidationConstant.MSG_CODE_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_10, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_COUNTRY_CODE,
      nullable = false,
      length = ValidationConstant.LENGTH_10
  )
  private String countryCode;

  @Column(name = DatabaseSchemaConstant.COL_ACTIVE, nullable = false)
  private Boolean active;
}
