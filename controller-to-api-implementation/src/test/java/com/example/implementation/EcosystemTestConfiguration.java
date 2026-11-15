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

@TestConfiguration
public class EcosystemTestConfiguration {

  @Bean
  public TestDomainEventListener testDomainEventListener() {
    return new TestDomainEventListener();
  }

  @Bean
  public TestPostLifecycleHook testPostLifecycleHook() {
    return new TestPostLifecycleHook();
  }
}
