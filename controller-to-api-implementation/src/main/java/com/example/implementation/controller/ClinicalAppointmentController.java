package com.example.implementation.controller;

import com.example.implementation.entity.ClinicalAppointment;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Dynamic proxy REST controller for {@link ClinicalAppointment} entities in the Healthcare domain.
 * Auto-generates enterprise endpoints at {@code /api/v1/clinical-appointments}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface ClinicalAppointmentController extends AutoApiController<ClinicalAppointment> {
}

