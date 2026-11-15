package com.example.implementation.controller;

import com.example.implementation.entity.PatientRecord;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Dynamic proxy REST controller for {@link PatientRecord} entities in the Healthcare EHR domain.
 * Auto-generates enterprise endpoints at {@code /api/v1/patient-records}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface PatientRecordController extends AutoApiController<PatientRecord> {
}

