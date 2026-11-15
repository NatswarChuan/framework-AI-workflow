package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AuditTrail;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.TrackExecutionTime;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Employee entity with declarative {@link AutoCode}, {@link UniqueField}, {@link EntitySecurity},
 * {@link AuditTrail}, {@link TrackExecutionTime}, and {@link FieldSecurity}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@AuditTrail(category = "HR_EMPLOYEE")
@TrackExecutionTime(warningThresholdMs = 300L)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN},
    ownerField = "createdBy"
)
@Table(
    name = DatabaseSchemaConstant.TABLE_EMPLOYEES,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_EMPLOYEES_CODE,
            columnList = DatabaseSchemaConstant.COL_EMPLOYEE_CODE,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_EMPLOYEES_DEPT_ID,
            columnList = DatabaseSchemaConstant.COL_DEPARTMENT_ID
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_EMPLOYEES_STATUS,
            columnList = DatabaseSchemaConstant.COL_EMPLOYMENT_STATUS
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Employee extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = BusinessDomainConstant.PREFIX_EMPLOYEE_CODE)
  @Size(max = ValidationConstant.MAX_CODE_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_EMPLOYEE_CODE,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_CODE_LENGTH
  )
  private String employeeCode;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_FULL_NAME,
      nullable = false,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String fullName;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Email(message = ValidationConstant.MSG_EMAIL_INVALID)
  @UniqueField
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_WORK_EMAIL,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String workEmail;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_30, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_EMPLOYMENT_STATUS,
      nullable = false,
      length = ValidationConstant.LENGTH_30
  )
  private String employmentStatus;

  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Positive(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(
      name = DatabaseSchemaConstant.COL_SALARY,
      nullable = false,
      precision = ValidationConstant.DECIMAL_PRECISION,
      scale = ValidationConstant.DECIMAL_SCALE
  )
  private BigDecimal salary;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_DEPARTMENT_ID)
  private Department department;
}
