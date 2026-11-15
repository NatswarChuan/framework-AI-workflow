package com.example.implementation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object requesting a clinical consultation appointment slot booking.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class ClinicalAppointmentBookingRequestDto {

  private UUID patientId;

  @NotBlank(message = "Patient name is required")
  @Size(max = 100, message = "Patient name must not exceed 100 characters")
  private String patientName;

  @NotBlank(message = "Physician name is required")
  @Size(max = 100, message = "Physician name must not exceed 100 characters")
  private String physicianName;

  @NotBlank(message = "Department name is required")
  @Size(max = 64, message = "Department name must not exceed 64 characters")
  private String departmentName;

  @NotBlank(message = "Scheduled time slot is required")
  @Size(max = 32, message = "Scheduled time slot must not exceed 32 characters")
  private String scheduledTime;

  @Size(max = 500, message = "Chief complaint must not exceed 500 characters")
  private String chiefComplaint;
}

