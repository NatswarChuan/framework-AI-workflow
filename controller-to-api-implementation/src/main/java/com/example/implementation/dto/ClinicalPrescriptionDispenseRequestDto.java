package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object for dispensing clinical prescriptions or attempting modification.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for clinical prescription dispensing")
public class ClinicalPrescriptionDispenseRequestDto {

  @NotNull
  @Schema(description = "Prescription UUID identifier")
  private UUID prescriptionId;

  @NotBlank
  @Schema(description = "Pharmacist ID who dispenses medication", example = "PHARMACIST-009")
  private String pharmacistId;

  @Schema(description = "Action requested: DISPENSE or MODIFY", example = "DISPENSE")
  private String action;

  @Schema(description = "New dosage if modification attempted", example = "500mg")
  private String proposedDosage;
}

