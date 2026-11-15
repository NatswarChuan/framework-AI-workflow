package com.example.implementation.constant;

import io.github.natswarchuan.common.constant.CommonConstant;

/**
 * Constants supporting Stage 2 {@code @ServiceOverride} escape-hatch showcase endpoints and
 * taxonomy statistics formatting.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-15
 */
public final class ShowcaseConstant {

  private ShowcaseConstant() {
    throw new UnsupportedOperationException(CommonConstant.MSG_UTILITY_CLASS);
  }

  /** Relative endpoint path mapped onto {@code TagController} via {@code @ServiceOverride}. */
  public static final String PATH_TAG_ESCAPE_STATS = "/showcase/escape-hatch-stats";

  /** Helper method name targeted by {@code @ServiceOverride}. */
  public static final String METHOD_BUILD_TAXONOMY_STATS = "buildTaxonomyStats";

  /** JPQL count query counting persisted {@code Tag} rows via Spring-injected EntityManager. */
  public static final String JPQL_COUNT_TAGS = "SELECT COUNT(t) FROM Tag t";

  /** Response map key holding the entity class name. */
  public static final String KEY_ENTITY = "entity";

  /** Response map key holding persisted tag count. */
  public static final String KEY_TOTAL_TAGS = "totalTags";

  /** Response map key identifying dispatch mode. */
  public static final String KEY_DISPATCH_MODE = "dispatchMode";

  /** Response map key carrying UUIDv7 correlation stamp. */
  public static final String KEY_EVALUATION_ID = "evaluationId";

  /** Entity display value for Tag taxonomy. */
  public static final String ENTITY_TAG = "Tag";

  /** Dispatch mode value identifying Stage 2 Escape Hatch delegation. */
  public static final String MODE_SERVICE_OVERRIDE = "STAGE_2_SERVICE_OVERRIDE_SPRING_DI";

  /** Log message emitted at entry of escape-hatch taxonomy aggregation. */
  public static final String LOG_START_STATS = "Starting @ServiceOverride Tag taxonomy statistics";

  /** Log message emitted at completion of escape-hatch taxonomy aggregation. */
  public static final String LOG_END_STATS =
      "Finished @ServiceOverride Tag taxonomy statistics: totalTags={}";
}
