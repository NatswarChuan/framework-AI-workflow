package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.StateMachine;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Healthcare domain entity representing a clinical consultation appointment.
 * Governed by a declarative finite state machine lifecycle with non-deletable safeguards.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = "tbl_clinical_appointments",
    indexes = {
        @Index(name = "idx_clinical_appointments_code", columnList = "appointment_code", unique = true),
        @Index(name = "idx_clinical_appointments_status", columnList = "appointment_status"),
        @Index(name = "idx_clinical_appointments_slot", columnList = "physician_name, scheduled_time", unique = true)
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
    writeRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}
)
public class ClinicalAppointment extends BaseAuditEntity {

  @UniqueField
  @AutoCode(prefix = "APT-")
  @Column(name = "appointment_code", nullable = false, length = 32)
  private String appointmentCode;

  @Column(name = "patient_id")
  private UUID patientId;

  @NotBlank
  @Size(max = 100)
  @Column(name = "patient_name", nullable = false, length = 100)
  private String patientName;

  @NotBlank
  @Size(max = 100)
  @Column(name = "physician_name", nullable = false, length = 100)
  private String physicianName;

  @Column(name = "department_name", length = 64)
  private String departmentName;

  @Column(name = "scheduled_time", length = 32)
  private String scheduledTime;

  @Column(name = "chief_complaint", length = 500)
  private String chiefComplaint;

  @StateMachine(
      initial = "REQUESTED",
      transitions = {
          "REQUESTED:CONFIRMED,CANCELLED",
          "CONFIRMED:CHECKED_IN,CANCELLED",
          "CHECKED_IN:IN_CONSULTATION",
          "IN_CONSULTATION:COMPLETED"
      },
      deletableStates = {"REQUESTED", "CANCELLED"}
  )
  @Column(name = "appointment_status", nullable = false, length = 32)
  private String appointmentStatus;
}
