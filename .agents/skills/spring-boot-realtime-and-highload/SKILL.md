---
name: spring-boot-realtime-and-highload
description: >-
  Kích hoạt kỹ năng này khi thiết kế và xây dựng các chức năng Real-Time (Server-Sent Events SSE,
  WebSocket, STOMP), thiết lập kiến trúc chịu tải công suất cao (Virtual Threads Java 21,
  Connection Pooling HikariCP, Resilience4j Rate Limiting/Circuit Breaker, Async Task Processing).
---

# Kỹ Năng: Thiết Kế Chức Năng Real-Time & Kiến Trúc Chịu Tải Công Suất Cao

Kỹ năng này hướng dẫn toàn diện phương pháp xây dựng các tính năng tương tác thời gian thực (**Server-Sent Events - SSE**, **WebSocket/STOMP**) và tối ưu hóa hệ thống để xử lý lưu lượng truy cập lớn, chịu tải công suất cao mà vẫn bảo đảm độ trễ thấp và tính ổn định tuyệt đối.

---

## 1. NGUYÊN TẮC THIẾT KẾ HỆ THỐNG REAL-TIME & CHỊU TẢI CAO

1. **Lựa Chọn Công Nghệ Thời Gian Thực Phù Hợp**:
   - Dữ liệu 1 chiều từ Server -> Client: Chọn **Server-Sent Events (SSE)**. Tiết kiệm tài nguyên, tự động kết nối lại trên HTTP/2, thân thiện với Firewall.
   - Dữ liệu 2 chiều Server <-> Client: Chọn **WebSocket với giao thức STOMP**. Thích hợp cho tương tác nhóm, chat, cập nhật theo thời gian thực hai chiều.
2. **Kích Hoạt Virtual Threads (Java 21 / Project Loom)**:
   - Chuyển đổi toàn bộ bộ điều phối tác vụ và bộ phục vụ HTTP sang Virtual Threads.
   - Khả năng co giãn lên đến hàng trăm nghìn luồng đồng thời mà không tốn nhiều bộ nhớ RAM như Platform Threads truyền thống.
3. **Phòng Chống Rò Rỉ Bộ Nhớ (Anti-Memory Leak)**:
   - Các kết nối thời gian thực phải được đăng ký đầy đủ các callback dọn dẹp (`onCompletion`, `onTimeout`, `onError`).
   - Sử dụng cơ chế định kỳ gửi Heartbeat (Ping/Pong) để phát hiện và dọn các kết nối treo (Dead Connections).
4. **Phòng Vệ Tải & Chống Nghẽn Tầng (Resilience4j)**:
   - Áp dụng `RateLimiter` để giới hạn số lượng request trên từng IP/User.
   - Áp dụng `CircuitBreaker` cô lập các dịch vụ phụ trợ chậm trễ, ngăn hiện tượng sập đổ dây chuyền (Cascading Failure).

---

## 2. TRIỂN KHAI SERVER-SENT EVENTS (SSE) CÓ QUẢN LÝ KẾT NỐI

```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.LogConstant;
import com.enterprise.app.common.constant.RealtimeConstant;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Điều phối các luồng phát dữ liệu thời gian thực Server-Sent Events.
 */
@Slf4j
@Service
public class RealtimeNotificationServiceImpl {

  private final Map<String, SseEmitter> subscribers = new ConcurrentHashMap<>();

  public SseEmitter createSubscription(final String userId) {
    Objects.requireNonNull(userId);
    log.info(LogConstant.LOG_START_WITH_PARAM, "createSubscription", userId);

    final SseEmitter emitter = new SseEmitter(RealtimeConstant.SSE_TIMEOUT_MILLIS);

    emitter.onCompletion(() -> subscribers.remove(userId));
    emitter.onTimeout(() -> {
      emitter.complete();
      subscribers.remove(userId);
    });
    emitter.onError(ex -> {
      emitter.complete();
      subscribers.remove(userId);
    });

    subscribers.put(userId, emitter);
    log.info(LogConstant.LOG_FINISH_WITH_RESULT, "createSubscription", userId);
    return emitter;
  }

  public void sendToUser(final String userId, final String eventName, final Object data) {
    final SseEmitter emitter = subscribers.get(userId);
    if (Objects.isNull(emitter)) {
      return;
    }

    try {
      emitter.send(SseEmitter.event()
          .name(eventName)
          .data(data));
    } catch (final IOException ex) {
      emitter.complete();
      subscribers.remove(userId);
      log.warn(LogConstant.LOG_WARN_BUSINESS, "SSE_CLIENT_UNREACHABLE", userId);
    }
  }
}
```

---

## 3. CẤU HÌNH VIRTUAL THREADS VÀ ASYNC TASK EXECUTOR

Khai báo trong cấu hình Spring Boot để mọi tác vụ bất đồng bộ `@Async` và luồng xử lý HTTP đều tận dụng Virtual Threads:

```java
package com.enterprise.app.config;

import java.util.concurrent.Executors;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.support.TaskExecutorAdapter;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Cấu hình thực thi bất đồng bộ tối ưu hóa bằng Java 21 Virtual Threads.
 */
@Configuration
@EnableAsync
public class AsyncVirtualThreadConfig {

  @Bean
  @ConditionalOnProperty(name = "spring.threads.virtual.enabled", havingValue = "true")
  public AsyncTaskExecutor applicationTaskExecutor() {
    return new TaskExecutorAdapter(Executors.newVirtualThreadPerTaskExecutor());
  }
}
```

---

## 4. BẢO VỆ CHỊU TẢI VỚI RESILIENCE4J CIRCUIT BREAKER & RATE LIMITER

```yaml
resilience4j:
  ratelimiter:
    instances:
      publicApiRateLimiter:
        limitForPeriod: 100
        limitRefreshPeriod: 1s
        timeoutDuration: 50ms
  circuitbreaker:
    instances:
      externalServiceBreaker:
        slidingWindowSize: 50
        minimumNumberOfCalls: 10
        failureRateThreshold: 50
        waitDurationInOpenState: 10000ms
        permittedNumberOfCallsInHalfOpenState: 5
```

---

## 5. BẮT BUỘC KIỂM THỬ TẢI & ĐỒNG THỜI BẰNG APACHE JMETER (MANDATORY HIGH-CONCURRENCY JMETER TESTING)

Hệ thống Real-time và Chịu tải công suất cao (Virtual Threads, Connection Pooling, Resilience4j) **BẮT BUỘC** phải được chứng minh năng lực phục vụ bằng **Apache JMeter Stress Test** trước khi bàn giao.

### 5.1. Kịch Bản Stress Test Cho Hệ Thống Real-time & High-Load
- **Kịch bản**: `src/test/jmeter/enterprise_rpac_stress_test.jmx`.
- **Thử nghiệm áp lực đồng thời**:
  1. Hàng chục phiên kết nối đồng thời và phát sóng thông báo thời gian thực (`/api/v1/realtime/notifications/broadcast`).
  2. Truy vấn dồn dập lịch sử thông báo gần nhất (`/api/v1/realtime/notifications/recent`).
  3. Đánh giá thẩm định quyền RPAC liên tục dưới tải cao (`/api/v1/iam/policy/evaluate`).
  4. Đăng nhập và xác thực PIN thu ngân đồng thời (`/api/v1/iam/credentials/verify-pin`).

### 5.2. Lệnh Chạy Bắt Buộc
```bash
mvn jmeter:jmeter jmeter:results
```

### 5.3. Checklist Nghiệm Thu Bắt Buộc
- [ ] **Tỷ lệ lỗi tuyệt đối bằng 0**: `Failures: 0.0% (0.0% accepted)`.
- [ ] **Virtual Threads hoạt động ổn định**: Không xảy ra nghẽn `OutOfMemoryError`, không rò rỉ bộ nhớ từ `SseEmitter`.
- [ ] **HikariCP Connection Pool**: Không bị cạn kiệt kết nối (`ConnectionTimeoutException`).
- [ ] **Báo cáo HTML**: Tự động sinh báo cáo chi tiết tại `target/jmeter/reports/*/index.html`.
- [ ] **Quy tắc cấm kỵ**: CẤM bàn giao mã nguồn nếu chưa chạy `mvn jmeter:jmeter jmeter:results` hoặc có bất kỳ mẫu thử nào thất bại!

