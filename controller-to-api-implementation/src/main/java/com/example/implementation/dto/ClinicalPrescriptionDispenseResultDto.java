package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating prescription dispensing receipt.
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
@Schema(description = "Result payload of clinical prescription dispensing")
public class ClinicalPrescriptionDispenseResultDto {

  @Schema(description = "Prescription UUID identifier")
  private UUID prescriptionId;

  @Schema(description = "Terminal prescription status: DISPENSED", example = "DISPENSED")
  private String status;

  @Schema(description = "Pharmacist who verified and dispensed medication", example = "PHARMACIST-009")
  private String dispensedBy;

  @Schema(description = "Timestamp when legally locked and dispensed")
  private Instant dispensedAt;

  @Schema(description = "Whether the record is permanently locked against changes", example = "true")
  private boolean immutableLocked;
}

