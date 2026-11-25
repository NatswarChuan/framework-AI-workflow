package com.novamart.ecommerce.util;

import com.novamart.ecommerce.constant.NovaRoleConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.util.Set;
import org.springframework.beans.factory.ObjectProvider;

/**
 * Test utility generating Bearer Authorization header values using Spring-NWVMC JwtTokenService.
 */
public final class NovaJwtTestUtil {

  private NovaJwtTestUtil() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }

  /**
   * Builds a Bearer JWT header value for the specified subject and role set.
   *
   * @param jwtProvider ObjectProvider for framework JwtTokenService
   * @param userId subject identifier
   * @param username principal username
   * @param roles granted authority strings
   * @return Authorization header value starting with "Bearer "
   */
  public static String buildBearerToken(
      final ObjectProvider<JwtTokenService> jwtProvider,
      final String userId,
      final String username,
      final Set<String> roles) {
    final String token = jwtProvider.getObject().generateToken(username, userId, roles);
    return NovaTestConstant.BEARER_PREFIX + token;
  }
}
