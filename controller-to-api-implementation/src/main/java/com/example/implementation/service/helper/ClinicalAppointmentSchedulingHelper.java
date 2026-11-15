package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ClinicalAppointmentBookingRequestDto;
import com.example.implementation.entity.ClinicalAppointment;
import io.github.natswarchuan.common.constant.ErrorConstant;
import io.github.natswarchuan.common.constant.LogConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component orchestrating clinical appointment bookings under high multi-patient contention.
 *
 * <p>Enforces atomic slot allocation to eliminate race conditions (double-booking) and
 * validates consultation state transitions according to clinical healthcare governance.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class ClinicalAppointmentSchedulingHelper {

  private final EntityManager entityManager;
  private final ConcurrentHashMap<String, Object> slotLocks = new ConcurrentHashMap<>();

  /**
   * Reserves a physician consultation slot with race condition prevention.
   *
   * @param request appointment booking request payload
   * @return confirmed {@link ClinicalAppointment} entity
   * @throws BaseBusinessException if the target physician slot is already booked
   */
  public ClinicalAppointment bookAppointmentAtomic(final ClinicalAppointmentBookingRequestDto request) {
    Objects.requireNonNull(request);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_BOOK_APPOINTMENT_ATOMIC, request.getPhysicianName());

    final String slotKey = request.getPhysicianName() + AdvancedBusinessConstant.STR_SYMBOL + request.getScheduledTime();
    final Object lock = slotLocks.computeIfAbsent(slotKey, k -> new Object());

    synchronized (lock) {
      final TypedQuery<ClinicalAppointment> conflictQuery = entityManager.createQuery(
          AdvancedBusinessConstant.STR_SELECT_A_FROM_CLINICAL_APPOINTMENT_A
              + AdvancedBusinessConstant.STR_AND_A_SCHEDULED_TIME_TIME_SLOT
              + AdvancedBusinessConstant.STR_AND_A_APPOINTMENT_STATUS_IN_ACTIVE_S,
          ClinicalAppointment.class
      );
      conflictQuery.setParameter(AdvancedBusinessConstant.STR_PHYSICIAN, request.getPhysicianName());
      conflictQuery.setParameter(AdvancedBusinessConstant.STR_TIME_SLOT, request.getScheduledTime());
      conflictQuery.setParameter(AdvancedBusinessConstant.STR_ACTIVE_STATUSES, List.of(
          AdvancedBusinessConstant.STATE_APPOINTMENT_REQUESTED,
          AdvancedBusinessConstant.STATE_APPOINTMENT_CONFIRMED,
          AdvancedBusinessConstant.STATE_APPOINTMENT_CHECKED_IN,
          AdvancedBusinessConstant.STATE_APPOINTMENT_IN_CONSULTATION
      ));

      final List<ClinicalAppointment> existingConflicts = conflictQuery.getResultList();
      if (!existingConflicts.isEmpty()) {
        throw new BaseBusinessException(
            HttpStatus.CONFLICT,
            AdvancedBusinessConstant.ERR_APPOINTMENT_SLOT_ALREADY_BOOKED,
            AdvancedBusinessConstant.MSG_APPOINTMENT_SLOT_ALREADY_BOOKED
        );
      }

      final String generatedCode = AdvancedBusinessConstant.STR_APT + UuidUtil.generateUuidV7().toString().substring(0, 18).replace(AdvancedBusinessConstant.STR_SYMBOL_2, AdvancedBusinessConstant.STR_EMPTY).toUpperCase();
      final ClinicalAppointment appointment = ClinicalAppointment.builder()
          .appointmentCode(generatedCode)
          .patientId(request.getPatientId())
          .patientName(request.getPatientName())
          .physicianName(request.getPhysicianName())
          .departmentName(request.getDepartmentName())
          .scheduledTime(request.getScheduledTime())
          .chiefComplaint(request.getChiefComplaint())
          .appointmentStatus(AdvancedBusinessConstant.STATE_APPOINTMENT_CONFIRMED)
          .build();

      entityManager.persist(appointment);
      entityManager.flush();
      log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_BOOK_APPOINTMENT_ATOMIC);
      return appointment;
    }
  }

  /**
   * Validates legal clinical state progression for an existing consultation.
   *
   * @param currentStatus current status of the consultation
   * @param targetStatus proposed target status
   * @throws BaseBusinessException if the proposed transition violates the state machine graph
   */
  public void validateConsultationTransition(final String currentStatus, final String targetStatus) {
    Objects.requireNonNull(currentStatus);
    Objects.requireNonNull(targetStatus);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_VALIDATE_CONSULTATION_TRANSITION, targetStatus);

    if (!AdvancedBusinessConstant.STATE_APPOINTMENT_COMPLETED.equals(targetStatus)) {
      log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_VALIDATE_CONSULTATION_TRANSITION);
      return;
    }
    if (!AdvancedBusinessConstant.STATE_APPOINTMENT_REQUESTED.equals(currentStatus)) {
      log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_VALIDATE_CONSULTATION_TRANSITION);
      return;
    }

    throw new BaseBusinessException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorConstant.ERR_BUSINESS_RULE_VIOLATION,
        AdvancedBusinessConstant.STR_CANNOT_DIRECTLY_COMPLETE_AN_UNCONFIR
    );
  }
}
