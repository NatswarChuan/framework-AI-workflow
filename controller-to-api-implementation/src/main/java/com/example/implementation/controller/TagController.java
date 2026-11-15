package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Tag;

/**
 * Dynamic proxy REST controller for {@link Tag} taxonomy classification entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/tags}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface TagController extends AutoApiController<Tag> {
}
