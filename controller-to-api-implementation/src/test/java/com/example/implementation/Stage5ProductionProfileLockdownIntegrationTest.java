package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

/**
 * Verifies that activating {@code prod} profile enforces Secure-by-Default lockdown over
 * {@code /system/studio} and {@code /api/v1/auth/token}.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-15
 */
@ActiveProfiles(Stage5TestConstant.PROFILE_PROD)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = Stage5TestConstant.PROD_JWT_PROPERTY)
public class Stage5ProductionProfileLockdownIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @Test
  @DisplayName("Production Profile: Studio UI requires auth (HTTP 401) and Demo JWT returns opaque HTTP 404")
  public void productionProfile_LocksStudioBehindAuthAndDisablesDemoTokenEndpoint() {
    final ResponseEntity<String> studioRes =
        this.restTemplate.getForEntity(Stage5TestConstant.URL_STUDIO, String.class);
    assertThat(studioRes.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

    final ResponseEntity<String> tokenRes =
        this.restTemplate.postForEntity(Stage5TestConstant.URL_TOKEN_ADMIN, null, String.class);
    assertThat(tokenRes.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
  }
}
