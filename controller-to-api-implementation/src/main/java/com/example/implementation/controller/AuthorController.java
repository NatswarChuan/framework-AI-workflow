package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Author;

/**
 * Dynamic proxy REST controller interface for {@link Author} entities.
 *
 * <p>Automatically provisions full RESTful capabilities at {@code /api/v1/authors}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface AuthorController extends AutoApiController<Author> {
}
