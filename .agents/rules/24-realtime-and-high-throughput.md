# Rule 24: Kiến Trúc Real-Time & Chịu Tải Công Suất Cao (High-Throughput)

Tài liệu này quy chuẩn bắt buộc về việc thiết kế, xây dựng các tính năng tương tác thời gian thực (**Real-Time Features**) và bảo đảm khả năng chịu tải ở công suất cực cao (**High-Throughput & High-Concurrency Architecture**) trong hệ thống Java Spring Boot.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Ứng Dụng Java 21 Virtual Threads (Project Loom)**:
   - Kích hoạt Virtual Threads trên toàn hệ thống thông qua `spring.threads.virtual.enabled: true`.
   - Xử lý hàng trăm nghìn tác vụ đồng thời (Concurrent Tasks) mà không gây cạn kiệt bộ nhớ hay nghẽn luồng nền tảng (Platform Thread starvation).
2. **Chuẩn Hóa Kênh Truyền Thời Gian Thực (Real-Time Channels)**:
   - **Server-Sent Events (SSE)** qua `SseEmitter`: Sử dụng cho luồng dữ liệu 1 chiều từ Server tới Client (Thông báo thời gian thực, bảng giá chứng khoán/crypto, cập nhật trạng thái đơn hàng).
   - **WebSocket / STOMP**: Sử dụng cho luồng giao tiếp 2 chiều tốc độ cao (Chat, bảng vẽ cộng tác, tương tác đa người dùng).
   - **Message Broker (Redis PubSub / Apache Kafka)**: Đóng vai trò xương sống phân tán (Distributed Backplane) để đồng bộ thông điệp giữa các node microservice trong cụm cluster.
3. **Quản Lý Vòng Đời Kết Nối Real-Time An Toàn (Anti-Memory Leak)**:
   - 100% kết nối `SseEmitter` và WebSocket Session phải đăng ký các callback: `onCompletion(...)`, `onTimeout(...)`, `onError(...)`.
   - Tự động dọn dẹp và loại bỏ các kết nối chết (Stale Connections) khỏi bộ nhớ nhằm triệt tiêu hiện tượng rò rỉ bộ nhớ (Memory Leak).
4. **Bảo Vệ Hệ Thống Khi Quá Tải (Resilience & Backpressure)**:
   - Bắt buộc áp dụng **Resilience4j** (Circuit Breaker, Rate Limiter, Bulkhead) bảo vệ các tài nguyên quan trọng (Database, External APIs).
   - Áp dụng kỹ thuật Batching và Streaming (Cursor-based paging / Stream API) thay vì nạp khối lượng bản ghi khổng lồ vào RAM.
5. **Tối Ưu Hóa Connection Pool & Cơ Sở Dữ Liệu**:
   - Cấu hình HikariCP với kích thước Connection Pool phù hợp, kích hoạt `leak-detection-threshold`.
   - Tránh nghẽn Transaction bằng cách giảm thiểu tối đa phạm vi khối `@Transactional`.

---

## 2. CẤU HÌNH HỆ THỐNG CHỊU TẢI CAO (`application.yml`)

```yaml
spring:
  # Bật Java 21 Virtual Threads cho toàn bộ Tomcat Request Handler và @Async
  threads:
    virtual:
      enabled: true
  datasource:
    hikari:
      pool-name: EnterpriseHikariPool
      maximum-pool-size: 50
      minimum-idle: 10
      idle-timeout: 300000
      max-lifetime: 1800000
      connection-timeout: 20000
      leak-detection-threshold: 5000 # Cảnh báo nếu giữ kết nối quá 5 giây

server:
  tomcat:
    threads:
      max: 200
      min-spare: 20
    accept-count: 1000
    connection-timeout: 20000ms
```

---

## 3. LỚP HẰNG SỐ REAL-TIME (`RealtimeConstant.java`)

```java
package com.enterprise.app.common.constant;

/**
 * Hằng số cấu hình phân hệ Real-time và truyền phát dữ liệu.
 */
public final class RealtimeConstant {

  private RealtimeConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final long SSE_TIMEOUT_MILLIS = 180000L; // 3 phút
  public static final String SSE_EVENT_NOTIFICATION = "notification";
  public static final String SSE_EVENT_HEARTBEAT = "heartbeat";
  public static final String CHANNEL_NOTIFICATIONS = "channel:notifications";
  public static final String WS_ENDPOINT_CONNECT = "/ws-connect";
  public static final String WS_TOPIC_PREFIX = "/topic";
  public static final String WS_APP_PREFIX = "/app";
}
```

---

## 4. DỊCH VỤ TRUYỀN PHÁT DỮ LIỆU REAL-TIME CHUẨN (`SseEmitterService.java`)

```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.CommonConstant;
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
 * Quản lý và điều phối các luồng truyền phát dữ liệu thời gian thực Server-Sent Events.
 */
@Slf4j
@Service
public class SseEmitterServiceImpl {

  private final Map<String, SseEmitter> emitterMap = new ConcurrentHashMap<>();

  public SseEmitter subscribe(final String clientId) {
    Objects.requireNonNull(clientId);
    log.info(LogConstant.LOG_START_WITH_PARAM, "SseSubscribe", clientId);

    final SseEmitter emitter = new SseEmitter(RealtimeConstant.SSE_TIMEOUT_MILLIS);

    emitter.onCompletion(() -> emitterMap.remove(clientId));
    emitter.onTimeout(() -> {
      emitter.complete();
      emitterMap.remove(clientId);
    });
    emitter.onError(throwable -> {
      emitter.complete();
      emitterMap.remove(clientId);
    });

    emitterMap.put(clientId, emitter);
    log.info(LogConstant.LOG_FINISH_WITH_RESULT, "SseSubscribe", clientId);
    return emitter;
  }

  public void broadcast(final String eventName, final Object payload) {
    Objects.requireNonNull(payload);
    emitterMap.forEach((clientId, emitter) -> {
      try {
        emitter.send(SseEmitter.event()
            .name(eventName)
            .data(payload));
      } catch (final IOException ex) {
        emitter.complete();
        emitterMap.remove(clientId);
        log.warn(LogConstant.LOG_WARN_BUSINESS, "SSE_CLIENT_DISCONNECTED", clientId);
      }
    });
  }
}
```

---

## 5. CHECKLIST ĐỐI SOÁT REAL-TIME & CHỊU TẢI CAO TRƯỚC KHI BÀN GIAO

- [ ] **Bật Virtual Threads**: Cấu hình `spring.threads.virtual.enabled: true` trong file YAML.
- [ ] **Chống Rò Rỉ Kết Nối Real-Time**: 100% `SseEmitter` có đăng ký `onCompletion`, `onTimeout`, `onError`.
- [ ] **Bảo Vệ Tài Nguyên**: Đã thiết lập giới hạn kết nối HikariCP và cấu hình Timeout rõ ràng.
- [ ] **Không Block Luồng Xử Lý**: Các tác vụ nặng, gửi mail, push notification đều đẩy sang `@Async` hoặc Message Broker.
- [ ] **Triệt Tiêu Magic String/Number**: Toàn bộ chuỗi timeout, event name trích xuất từ `RealtimeConstant`.
