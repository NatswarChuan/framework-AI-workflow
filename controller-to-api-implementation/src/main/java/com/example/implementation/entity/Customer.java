package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
 * Customer entity demonstrating multi-relationship topologies ({@code @ManyToOne} to {@link Department}
 * and {@code @ManyToMany} to {@link Tag}).
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_CUSTOMERS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_CUSTOMERS_CODE,
            columnList = DatabaseSchemaConstant.COL_CUSTOMER_CODE,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_CUSTOMERS_DEPT_ID,
            columnList = DatabaseSchemaConstant.COL_DEPARTMENT_ID
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Customer extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_CODE_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_CODE_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_CUSTOMER_CODE,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_CODE_LENGTH
  )
  private String customerCode;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_FULL_NAME,
      nullable = false,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String fullName;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_30, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_TIER,
      nullable = false,
      length = ValidationConstant.LENGTH_30
  )
  private String tier;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_DEPARTMENT_ID)
  private Department department;

  @Builder.Default
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = DatabaseSchemaConstant.TABLE_CUSTOMER_TAGS,
      joinColumns = @JoinColumn(name = DatabaseSchemaConstant.COL_CUSTOMER_ID),
      inverseJoinColumns = @JoinColumn(name = DatabaseSchemaConstant.COL_TAG_ID)
  )
  private List<Tag> tags = new ArrayList<>();
}
