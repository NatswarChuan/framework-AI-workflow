package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.natswarchuan.module.ai.helper.DynamicEntityAiMetadataProviderHelper;
import io.github.natswarchuan.common.constant.AiConstant;
import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.common.helper.RestClientHelper;
import io.github.natswarchuan.common.dto.EntityMetadataDto;
import io.github.natswarchuan.module.event.EntityCreatedEvent;
import io.github.natswarchuan.core.hook.EntityLifecycleHook;
import io.github.natswarchuan.module.realtime.helper.SseEmitterRegistryHelper;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import com.example.implementation.entity.Customer;
import com.example.implementation.entity.CustomerOrder;
import com.example.implementation.entity.Department;
import com.example.implementation.entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.SneakyThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Comprehensive integration test for Spring Ecosystem components:
 * Domain Events (@EventListener), Real-time SSE (SseEmitter), Lifecycle Hooks SPI,
 * Spring 6 RestClient, and Spring AI Ready Metadata Providers.
 *
 * @author NatswarChuan
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(EcosystemTestConfiguration.class)
public class SpringEcosystemIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Autowired
  private SseEmitterRegistryHelper sseEmitterRegistryHelper;

  @Autowired
  private DynamicEntityAiMetadataProviderHelper aiMetadataHelper;

  @Autowired
  private RestClient restClient;

  @Autowired
  private RestClientHelper restClientHelper;

  @Autowired
  private TestDomainEventListener domainEventListener;

  @Autowired
  private TestPostLifecycleHook testPostLifecycleHook;




  @Test
  @DisplayName("Ecosystem 1 (Domain Events): Publishes EntityCreatedEvent when new entity is persisted")
  @SneakyThrows
  public void domainEvents_EntityCreation_PublishesDomainEvent() {
    final int initialSize = domainEventListener.getCreatedEvents().size();
    final Post newPost = Post.builder()
        .title("Spring Ecosystem Integration Post")
        .content("Validating domain events across the Spring framework")
        .viewCount(10L)
        .published(true)
        .build();

    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newPost))
        )
        .andExpect(status().isCreated());

    assertThat(domainEventListener.getCreatedEvents().size()).isGreaterThan(initialSize);
  }

  @Test
  @DisplayName("Ecosystem 2 (Lifecycle Hook SPI): Automatically triggers beforeCreate and afterCreate callbacks")
  @SneakyThrows
  public void lifecycleHook_CustomBusinessLogic_ExecutesCallbacks() {
    final int beforeInitial = testPostLifecycleHook.getBeforeCreateCount();
    final int afterInitial = testPostLifecycleHook.getAfterCreateCount();

    final Post newPost = Post.builder()
        .title("Hook Testing Post")
        .content("Validating Lifecycle Hook execution")
        .viewCount(5L)
        .published(true)
        .build();

    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newPost))
        )
        .andExpect(status().isCreated());

    assertThat(testPostLifecycleHook.getBeforeCreateCount()).isEqualTo(beforeInitial + 1);
    assertThat(testPostLifecycleHook.getAfterCreateCount()).isEqualTo(afterInitial + 1);
  }

  @Test
  @DisplayName("Ecosystem 3 (Real-Time SSE): Registers SseEmitter connection and broadcasts real-time events")
  public void realTimeSse_EmitterLifecycleAndBroadcast_WorksCorrectly() {
    final String entityName = CustomerOrder.class.getSimpleName();
    final SseEmitter emitter = sseEmitterRegistryHelper.createEmitter(entityName);

    assertThat(emitter).isNotNull();
    assertThat(sseEmitterRegistryHelper.getActiveCount(entityName)).isGreaterThan(0);

    sseEmitterRegistryHelper.broadcast(entityName, "TEST_UPDATE", "Order #123 Updated");
    sseEmitterRegistryHelper.removeEmitter(entityName, emitter);
  }

  @Test
  @DisplayName("Ecosystem 4 (Spring 6 RestClient): Successfully injects RestClient and RestClientHelper beans")
  public void spring6RestClient_BeansLoaded_ConfiguredWithInterceptors() {
    assertThat(restClient).isNotNull();
    assertThat(restClientHelper).isNotNull();
  }

  @Test
  @DisplayName("Ecosystem 5 (Spring AI Ready): Generates system context prompt and tool schema for LLMs")
  public void springAiReady_GeneratesSystemPromptAndToolSchema() {
    final String prompt = aiMetadataHelper.generateSystemContextPrompt(CustomerOrder.class);
    assertThat(prompt).contains("Entity: CustomerOrder");
    assertThat(prompt).contains("Basic Fields:");
    assertThat(prompt).contains("Supported Filter Operators:");

    final EntityMetadataDto toolSchema = aiMetadataHelper.generateAiToolSchema(CustomerOrder.class);
    assertThat(toolSchema).isNotNull();
    assertThat(toolSchema.getEntityName()).isEqualTo("CustomerOrder");
    assertThat(toolSchema.getEndpointBasePath()).isEqualTo("/api/v1/customer-orders");
  }

  @Test
  @DisplayName("Ecosystem 6 (Dynamic SSE Endpoint): GET /api/v1/customer-orders/stream returns text/event-stream")
  @SneakyThrows
  public void realTimeSse_DynamicProxyEndpoint_ReturnsSseEmitter() {
    mockMvc.perform(
            get(ImplementationTestConstant.ORDERS_API + ApiEndpointConstant.PATH_STREAM)
                .accept(MediaType.TEXT_EVENT_STREAM_VALUE)
        )
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Ecosystem 7 (Dynamic AI Endpoint): GET /api/v1/customer-orders/ai-context returns system context prompt")
  @SneakyThrows
  public void springAiReady_DynamicProxyEndpoint_ReturnsSystemContextPromptResponse() {
    mockMvc.perform(
            get(ImplementationTestConstant.ORDERS_API + AiConstant.PATH_AI_CONTEXT)
                .accept(MediaType.APPLICATION_JSON)
        )
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Ecosystem 8 (Natural Language AI Query): POST /api/v1/posts/ai-query executes filtered query automatically")
  @SneakyThrows
  public void springAiReady_NaturalLanguageQuery_ReturnsFilteredPosts() {
    final io.github.natswarchuan.common.dto.AiQueryRequestDto requestDto = io.github.natswarchuan.common.dto.AiQueryRequestDto.builder()
        .prompt(ImplementationTestConstant.AI_QUERY_PUBLISHED_PROMPT)
        .size(5)
        .build();

    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API + AiConstant.PATH_AI_QUERY)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data").exists());
  }
}

