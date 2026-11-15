package com.example.implementation.controller;

import com.example.implementation.constant.ShowcaseConstant;
import com.example.implementation.entity.Tag;
import com.example.implementation.service.helper.TagEscapeHatchHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoApiController;
import java.util.Map;

/**
 * Dynamic proxy REST controller for {@link Tag} taxonomy classification entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/tags} and demonstrates Stage 2
 * {@code @ServiceOverride} escape-hatch delegation for custom Spring DI statistics.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-06
 */
@AutoRestController
public interface TagController extends AutoApiController<Tag> {

  /**
   * Executes custom taxonomy count aggregation delegated to {@link TagEscapeHatchHelper}.
   *
   * @return taxonomy statistics payload wrapped in {@link ApiResponse}
   */
  @AutoGet(ShowcaseConstant.PATH_TAG_ESCAPE_STATS)
  @ServiceOverride(
      targetBean = TagEscapeHatchHelper.class,
      methodName = ShowcaseConstant.METHOD_BUILD_TAXONOMY_STATS)
  ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
}
