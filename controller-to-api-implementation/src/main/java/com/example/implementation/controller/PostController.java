package com.example.implementation.controller;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Dynamic proxy REST controller for {@link Post} entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/posts} with derived method {@code findBySlug}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface PostController extends AutoApiController<Post> {

  /**
   * Derived query retrieving article post by URL slug identifier.
   *
   * @param slug post URL slug
   * @return {@link ResponseEntity} wrapping retrieved post
   */
  @GetMapping(ApiEndpointConstant.PATH_BY_SLUG)
  ResponseEntity<ApiResponse<Post>> findBySlug(
      @PathVariable(ApiEndpointConstant.PARAM_SLUG) String slug);
}
