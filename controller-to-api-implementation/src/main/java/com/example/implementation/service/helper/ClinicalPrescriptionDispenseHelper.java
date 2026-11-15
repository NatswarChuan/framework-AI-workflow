package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ClinicalPrescriptionDispenseRequestDto;
import com.example.implementation.dto.ClinicalPrescriptionDispenseResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper class enforcing clinical prescription state immutability once dispensed by a pharmacist.
 * Prevents post-dispensing tampering or medication dosage modifications.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class ClinicalPrescriptionDispenseHelper {

  private final ConcurrentMap<UUID, String> prescriptionStatuses = new ConcurrentHashMap<>();

  /**
   * Processes prescription dispensing or validates modification permissions.
   *
   * @param request dispensing request payload
   * @return dispensing result receipt
   * @throws BaseBusinessException with HTTP 422 if attempting to modify a dispensed prescription
   */
  public ClinicalPrescriptionDispenseResultDto processPrescription(
      final ClinicalPrescriptionDispenseRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_CLINICAL_NULL_REQUEST,
          AdvancedBusinessConstant.STR_PRESCRIPTION_REQUEST_CANNOT_BE_NULL
      );
    }

    UUID prescriptionId = request.getPrescriptionId();
    if (Objects.isNull(prescriptionId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_CLINICAL_NULL_PRESCRIPTION_ID,
          AdvancedBusinessConstant.STR_PRESCRIPTION_ID_CANNOT_BE_NULL
      );
    }

    String currentStatus = prescriptionStatuses.getOrDefault(
        prescriptionId,
        AdvancedBusinessConstant.STATUS_PRESCRIPTION_ACTIVE
    );

    // Guard against post-dispense tampering
    if (AdvancedBusinessConstant.STR_MODIFY.equalsIgnoreCase(request.getAction())) {
      if (AdvancedBusinessConstant.STATUS_PRESCRIPTION_DISPENSED.equalsIgnoreCase(currentStatus)) {
        log.warn(AdvancedBusinessConstant.STR_ILLEGAL_MODIFICATION_ATTEMPT_ON_DISP, prescriptionId);
        throw new BaseBusinessException(
            HttpStatus.UNPROCESSABLE_ENTITY,
            AdvancedBusinessConstant.ERR_CLINICAL_PRESCRIPTION_LOCKED,
            AdvancedBusinessConstant.MSG_CLINICAL_PRESCRIPTION_LOCKED
        );
      }
    }

    // Mark as dispensed
    prescriptionStatuses.put(prescriptionId, AdvancedBusinessConstant.STATUS_PRESCRIPTION_DISPENSED);
    log.info(AdvancedBusinessConstant.STR_CLINICAL_PRESCRIPTION_SUCCESSFULLY_D,
        prescriptionId, request.getPharmacistId());

    return ClinicalPrescriptionDispenseResultDto.builder()
        .prescriptionId(prescriptionId)
        .status(AdvancedBusinessConstant.STATUS_PRESCRIPTION_DISPENSED)
        .dispensedBy(request.getPharmacistId())
        .dispensedAt(Instant.now())
        .immutableLocked(true)
        .build();
  }

  /**
   * Seeds status for testing.
   *
   * @param prescriptionId prescription UUID
   * @param status status to seed
   */
  public void seedStatus(final UUID prescriptionId, final String status) {
    prescriptionStatuses.put(prescriptionId, status);
  }
}

