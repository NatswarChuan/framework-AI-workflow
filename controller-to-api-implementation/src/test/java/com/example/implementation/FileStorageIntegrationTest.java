package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * Enterprise integration test validating declarative multi-provider file storage capabilities
 * within the implementation application.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-08
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class FileStorageIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  @DisplayName("Verify Full File Storage Lifecycle: Upload, Download, Metadata, Exists, PresignedUrl, Delete")
  public void testFileStorageFullLifecycle() throws Exception {
    final String adminToken = jwtTokenProviderHelper.generateToken(
        "storage-admin",
        UuidUtil.generateUuidV7String(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final byte[] fileContent = "Controller-To-API File Storage Integration Payload 2026".getBytes(StandardCharsets.UTF_8);
    final MockMultipartFile multipartFile = new MockMultipartFile(
        "file",
        "enterprise-spec.txt",
        "text/plain",
        fileContent
    );

    // 1. Upload file via POST /api/v1/storage/upload
    final MvcResult uploadResult = mockMvc.perform(
            MockMvcRequestBuilders.multipart("/api/v1/storage/upload")
                .file(multipartFile)
                .param("folder", "specs/2026")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.fileId").isNotEmpty())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.provider").value("LOCAL"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.originalFileName").value("enterprise-spec.txt"))
        .andReturn();

    final String uploadResponseJson = uploadResult.getResponse().getContentAsString();
    final JsonNode uploadNode = objectMapper.readTree(uploadResponseJson);
    final String fileId = uploadNode.path("data").path("fileId").asText();
    assertThat(fileId).isNotBlank();

    // 2. Download file via GET /api/v1/storage/download/{fileId}
    final MvcResult downloadResult = mockMvc.perform(
            MockMvcRequestBuilders.get("/api/v1/storage/download/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_DISPOSITION, org.hamcrest.Matchers.containsString("enterprise-spec.txt")))
        .andExpect(MockMvcResultMatchers.header().string(HttpHeaders.CONTENT_TYPE, org.hamcrest.Matchers.containsString("text/plain")))
        .andReturn();

    final byte[] downloadedBytes = downloadResult.getResponse().getContentAsByteArray();
    assertThat(downloadedBytes).isEqualTo(fileContent);

    // 3. Query metadata via GET /api/v1/storage/metadata/{fileId}
    mockMvc.perform(
            MockMvcRequestBuilders.get("/api/v1/storage/metadata/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.fileId").value(fileId))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.fileName").value("enterprise-spec.txt"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.sizeBytes").value(fileContent.length))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.provider").value("LOCAL"));

    // 4. Verify file existence via GET /api/v1/storage/exists/{fileId}
    mockMvc.perform(
            MockMvcRequestBuilders.get("/api/v1/storage/exists/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data").value(true));

    // 5. Generate presigned URL via POST /api/v1/storage/presigned-url
    final String presignedRequestJson = """
        {
          "fileIdentifier": "%s",
          "httpMethod": "GET",
          "expirationSeconds": 600
        }
        """.formatted(fileId);

    mockMvc.perform(
            MockMvcRequestBuilders.post("/api/v1/storage/presigned-url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(presignedRequestJson)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.presignedUrl").isNotEmpty())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.expirationSeconds").value(600));

    // 6. Delete file via DELETE /api/v1/storage/{fileId}
    mockMvc.perform(
            MockMvcRequestBuilders.delete("/api/v1/storage/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.deleted").value(true));

    // 7. Verify file existence is false after deletion
    mockMvc.perform(
            MockMvcRequestBuilders.get("/api/v1/storage/exists/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data").value(false));

    // 8. Download deleted file should return 404 Not Found
    mockMvc.perform(
            MockMvcRequestBuilders.get("/api/v1/storage/download/" + fileId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
        )
        .andExpect(MockMvcResultMatchers.status().isNotFound());
  }
}

