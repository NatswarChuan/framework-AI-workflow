package com.novamart.ecommerce.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Production security lockdown test verifying Dev Studio and Demo Auth endpoints stay blocked
 * when the dev profile is NOT active (application.yml baseline).
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
    properties = {
      "app.framework.security.jwt-secret=NovaMartProductionLockdownTestKeyAtLeast32BytesHs256",
      "novamart.datasource.primary-url=jdbc:h2:mem:novamartproddb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
      "novamart.datasource.replica-url=jdbc:h2:mem:novamartproddb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE"
    })
public class ProductionSecurityLockdownIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Test
  public void shouldBlockDevStudioAndDemoAuthTokenEndpointsInNonDevProfile() throws Exception {
    final int studioStatus =
        mockMvc.perform(get("/system/studio")).andReturn().getResponse().getStatus();
    assertThat(studioStatus).isIn(401, 403, 404);

    final int studioDemoTokenStatus =
        mockMvc
            .perform(get("/system/studio/demo-token").param("role", "ROLE_ADMIN"))
            .andReturn()
            .getResponse()
            .getStatus();
    assertThat(studioDemoTokenStatus).isIn(401, 403, 404);

    final int authTokenGetStatus =
        mockMvc.perform(get("/api/v1/auth/token")).andReturn().getResponse().getStatus();
    assertThat(authTokenGetStatus).isIn(401, 403, 404, 405);

    final int authTokenPostStatus =
        mockMvc.perform(post("/api/v1/auth/token")).andReturn().getResponse().getStatus();
    assertThat(authTokenPostStatus).isIn(401, 403, 404);
  }
}
