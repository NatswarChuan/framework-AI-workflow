package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
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
 * Healthcare domain entity representing an electronic health record (EHR) patient profile.
 * Protected by strict HIPAA-compliant declarative security and field masking.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_patient_records",
    indexes = {
        @Index(name = "idx_patient_records_mrn", columnList = "medical_record_number", unique = true),
        @Index(name = "idx_patient_records_nid", columnList = "national_health_id", unique = true)
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class PatientRecord extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "MRN-")
  @Column(name = "medical_record_number", nullable = false, length = 32)
  private String medicalRecordNumber;

  @NotBlank
  @Size(max = 100)
  @Column(name = "full_name", nullable = false, length = 100)
  private String fullName;

  @NotBlank
  @UniqueField
  @Size(max = 32)
  @Column(name = "national_health_id", nullable = false, length = 32)
  private String nationalHealthId;

  @Column(name = "date_of_birth", length = 32)
  private String dateOfBirth;

  @Column(name = "gender", length = 16)
  private String gender;

  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Column(name = "blood_type", length = 8)
  private String bloodType;

  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Column(name = "medical_history_summary", length = 1000)
  private String medicalHistorySummary;

  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true
  )
  @Column(name = "diagnosis_notes", length = 1000)
  private String diagnosisNotes;

  @Column(name = "active", nullable = false)
  private Boolean active;
}
