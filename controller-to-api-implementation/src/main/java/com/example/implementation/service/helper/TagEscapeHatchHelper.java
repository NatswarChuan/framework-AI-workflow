package com.example.implementation.service.helper;

import com.example.implementation.constant.ShowcaseConstant;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.common.util.UuidUtil;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Spring-managed helper demonstrating Stage 2 {@code @ServiceOverride} escape-hatch routing with
 * constructor dependency injection and read-only JPA query execution.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-15
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class TagEscapeHatchHelper {

  private final EntityManager entityManager;

  /**
   * Computes real-time taxonomy statistics using the Spring-injected {@link EntityManager}.
   *
   * @return wrapped map containing entity label, row count, dispatch mode, and UUIDv7 trace id
   */
  public ApiResponse<Map<String, String>> buildTaxonomyStats() {
    log.info(ShowcaseConstant.LOG_START_STATS);
    final Long countValue =
        entityManager.createQuery(ShowcaseConstant.JPQL_COUNT_TAGS, Long.class).getSingleResult();
    final Map<String, String> payload = new LinkedHashMap<>();
    payload.put(ShowcaseConstant.KEY_ENTITY, ShowcaseConstant.ENTITY_TAG);
    payload.put(ShowcaseConstant.KEY_TOTAL_TAGS, String.valueOf(countValue));
    payload.put(ShowcaseConstant.KEY_DISPATCH_MODE, ShowcaseConstant.MODE_SERVICE_OVERRIDE);
    payload.put(
        ShowcaseConstant.KEY_EVALUATION_ID, UuidUtil.generateUuidV7().toString());
    log.info(ShowcaseConstant.LOG_END_STATS, countValue);
    return ApiResponse.success(payload);
  }
}
