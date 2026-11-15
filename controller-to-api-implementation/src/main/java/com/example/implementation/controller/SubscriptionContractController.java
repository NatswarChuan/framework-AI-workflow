package com.example.implementation.controller;

import com.example.implementation.entity.SubscriptionContract;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * RESTful dynamic proxy controller for SaaS {@link SubscriptionContract} instances.
 * Automatically generates 26+ endpoints, including {@code GET /policy-summary} reflecting
 * the natural-language business rules in real time.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface SubscriptionContractController extends AutoApiController<SubscriptionContract> {
}
