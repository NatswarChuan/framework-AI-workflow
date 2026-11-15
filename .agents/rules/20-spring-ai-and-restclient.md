# Rule 20: Chuẩn Spring AI, RestClient & Event-Driven Architecture

Tài liệu này quy chuẩn bắt buộc về việc tích hợp Trí Tuệ Nhân Tạo Doanh Nghiệp (**Spring AI**), giao tiếp HTTP đồng bộ bằng **`RestClient`** hiện đại (thay thế hoàn toàn `RestTemplate`), và cơ chế giao tiếp module qua **Spring Event-Driven Architecture**.

---

## 1. CHUẨN SPRING AI (CHATCLIENT, VECTORSTORE & RAG)

### 1.1. Nguyên Tắc Thiết Kế Spring AI:
1. **Kiến Trúc Tách Rời (Decoupled AI)**: Sử dụng trừu tượng `ChatClient` và `VectorStore` của Spring AI, cho phép hoán đổi giữa OpenAI, Anthropic, Ollama, pgvector, Milvus hoặc Qdrant chỉ qua cấu hình Spring Profiles.
2. **Không Hardcode Prompt**: Quản lý prompt templates qua `AiConstant` hoặc tài nguyên `classpath:prompts/`.
3. **Structured Output Type-Safe**: Bắt buộc dùng `BeanOutputConverter<T>` để nhận kết quả có cấu trúc strongly-typed, tuyệt đối không dùng JSON thô hay chuỗi lỏng lẻo.
4. **Bảo Mật Khóa API**: Khóa API (`OPENAI_API_KEY`) nạp từ biến môi trường qua `application-prod.yml`.

### 1.2. Lớp Hằng Số Spring AI (`AiConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Hằng số phân hệ trí tuệ nhân tạo Spring AI.
 */
public final class AiConstant {

  private AiConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String SYSTEM_PROMPT_TEMPLATE = "Bạn là trợ lý ảo doanh nghiệp chuyên nghiệp. Trả lời chính xác, trung thực dựa trên tài liệu được cung cấp.";
  public static final String RAG_CONTEXT_VARIABLE = "context";
  public static final String RAG_QUERY_VARIABLE = "question";

  public static final int DEFAULT_TOP_K = 4;
  public static final double DEFAULT_SIMILARITY_THRESHOLD = 0.75;
}
```

### 1.3. Lớp Dịch Vụ AI Chuẩn (`AiAssistantServiceImpl.java`)
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.AiConstant;
import com.enterprise.app.common.constant.AiLogConstant;
import com.enterprise.app.dto.AiInquiryRequestDto;
import com.enterprise.app.dto.AiInsightResponseDto;
import com.enterprise.app.service.AiAssistantService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;

/**
 * Triển khai dịch vụ trợ lý AI doanh nghiệp tuân thủ chuẩn Spring AI.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAssistantServiceImpl implements AiAssistantService {

  private final ChatClient chatClient;

  @Override
  public AiInsightResponseDto generateInsight(final AiInquiryRequestDto inquiryDto) {
    Objects.requireNonNull(inquiryDto);
    log.info(AiLogConstant.START_GENERATE_INSIGHT, inquiryDto.getTopic());

    final BeanOutputConverter<AiInsightResponseDto> outputConverter =
        new BeanOutputConverter<>(AiInsightResponseDto.class);

    final AiInsightResponseDto response = chatClient.prompt()
        .system(AiConstant.SYSTEM_PROMPT_TEMPLATE)
        .user(inquiryDto.getTopic())
        .call()
        .entity(outputConverter);

    log.info(AiLogConstant.FINISH_GENERATE_INSIGHT, inquiryDto.getTopic());
    return response;
  }
}
```

---

## 2. CHUẨN SPRING RESTCLIENT (HTTP CLIENT TIÊN TIẾN)

- **Thay thế hoàn toàn RestTemplate**: 100% sử dụng **`RestClient`** (Spring 6 / Boot 3.2+) cho giao tiếp HTTP đồng bộ.
- Cấu hình Timeout và Connection Pooling với JDK HttpClient hoặc Apache HttpClient.
- Bắt lỗi HTTP từ dịch vụ ngoài và bọc vào Custom Exception với `HttpStatus` cụ thể:

```java
package com.enterprise.app.config;

import com.enterprise.app.common.constant.HttpHeaderConstant;
import java.time.Duration;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Cấu hình RestClient tập trung cho giao tiếp HTTP đồng bộ.
 */
@Configuration
public class RestClientConfig {

  @Bean
  public RestClient defaultRestClient() {
    final ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
        .withConnectTimeout(Duration.ofSeconds(5))
        .withReadTimeout(Duration.ofSeconds(10));

    final ClientHttpRequestFactory requestFactory = ClientHttpRequestFactories.get(settings);

    return RestClient.builder()
        .requestFactory(requestFactory)
        .defaultHeader(HttpHeaderConstant.HEADER_ACCEPT, "application/json")
        .build();
  }
}
```

---

## 3. CHUẨN SPRING EVENT-DRIVEN & TRANSACTIONAL LISTENER

- Giao tiếp giữa các module phân rã thực hiện qua `ApplicationEventPublisher`.
- Sử dụng `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)` để bảo đảm sự kiện chỉ được xử lý khi giao dịch ghi CSDL đã commit thành công.
- Sử dụng `@Async` với Task Executor chuyên biệt để không chặn luồng chính.
