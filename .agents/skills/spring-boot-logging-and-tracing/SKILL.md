---
name: spring-boot-logging-and-tracing
description: >-
  Kích hoạt kỹ năng này khi thiết lập hạ tầng ghi nhật ký (Logging Infrastructure),
  áp dụng cơ chế truy vết luồng xử lý (Trace Request ID / Correlation ID qua SLF4J MDC),
  hoặc thực hiện quy chuẩn ghi log bắt đầu và kết thúc (Entry & Exit Logging) trong Java Spring Boot.
---

# Kỹ Năng: Thiết Lập Hạ Tầng Logging & Giám Sát Truy Vết (Trace Request ID)

Kỹ năng này hướng dẫn quy trình từng bước xây dựng hạ tầng ghi nhật ký phân tầng hoàn chỉnh, thiết lập cơ chế Trace Request ID xuyên suốt luồng HTTP và thực thi chuẩn ghi log đầu/cuối hàm.

---

## 1. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

### Bước 1: Khởi tạo Hằng Số Truy Vết
Tạo lớp `TraceConstant.java` trong package `com.enterprise.app.common.constant`:
- Khai báo header `X-Request-ID`.
- Khai báo key MDC `traceId`.

### Bước 2: Thiết Lập `TraceIdFilter` Bắt Đầu Luồng
Tạo `TraceIdFilter.java` kế thừa `OncePerRequestFilter`:
- Đánh dấu `@Order(Ordered.HIGHEST_PRECEDENCE)`.
- Nhận từ Header hoặc sinh mới bằng `UuidUtil.generateUuidV7String()` (chuẩn UUIDv7 theo thời gian).
- Nạp vào `MDC.put("traceId", traceId)` và gắn vào Response Header.
- Xóa sạch trong khối `finally` bằng `MDC.remove("traceId")`.

### Bước 3: Đồng Bộ TraceId Sang Luồng Bất Đồng Bộ (`@Async`)
Khi sử dụng đa luồng hoặc `@Async`, thread con sẽ không tự động thừa kế `ThreadLocal` của MDC nếu không có `TaskDecorator`.
Tạo `MdcTaskDecorator.java`:
```java
package com.enterprise.app.config;

import java.util.Map;
import java.util.Objects;
import org.slf4j.MDC;
import org.springframework.core.task.TaskDecorator;

/**
 * Bộ trang trí tác vụ đồng bộ ngữ cảnh MDC giữa các luồng.
 */
public class MdcTaskDecorator implements TaskDecorator {

  @Override
  public Runnable decorate(final Runnable runnable) {
    final Map<String, String> contextMap = MDC.getCopyOfContextMap();
    return () -> {
      if (Objects.nonNull(contextMap)) {
        MDC.setContextMap(contextMap);
      }
      try {
        runnable.run();
      } finally {
        MDC.clear();
      }
    };
  }
}
```

### Bước 4: Thực Hiện Ghi Log Bằng Hằng Số (Triệt Tiêu 100% Magic String Trong Log)
Tại mọi method trong Controller, Service, Helper, Filter:
- **TUYỆT ĐỐI CẤM** viết chuỗi ký tự String literal trực tiếp vào hàm log.
- **100% Thông điệp log phải dùng hằng số** từ `LogConstant` (dùng chung) hoặc `*LogConstant` (theo domain):
  - **Dòng đầu tiên (Entry)**: `log.info(UserLogConstant.START_GET_USER, userId);`
  - **Trước khi return (Exit)**: `log.info(UserLogConstant.FINISH_GET_USER, response.getId());`
  - **Khối catch (Exception)**: `log.error(UserLogConstant.ERR_GET_USER, userId, ex.getMessage(), ex);`

---

## 2. CẤU HÌNH HẠ TẦNG LOGBACK HOÀN CHỈNH (`logback-spring.xml`)

Tạo tệp `src/main/resources/logback-spring.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds">

  <springProperty scope="context" name="appName" source="spring.application.name" defaultValue="enterprise-service"/>
  <property name="LOG_PATH" value="./logs"/>
  <property name="LOG_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{traceId}] %-5level %logger{36} - %msg%n"/>

  <!-- Console Appender -->
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>${LOG_PATTERN}</pattern>
      <charset>UTF-8</charset>
    </encoder>
  </appender>

  <!-- Rolling File Appender cho toàn bộ ứng dụng -->
  <appender name="APP_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOG_PATH}/${appName}.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
      <fileNamePattern>${LOG_PATH}/${appName}-%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
      <maxFileSize>50MB</maxFileSize>
      <maxHistory>30</maxHistory>
      <totalSizeCap>5GB</totalSizeCap>
    </rollingPolicy>
    <encoder>
      <pattern>${LOG_PATTERN}</pattern>
      <charset>UTF-8</charset>
    </encoder>
  </appender>

  <!-- Rolling File Appender chuyên biệt cho WARN & ERROR -->
  <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOG_PATH}/${appName}-error.log</file>
    <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
      <level>WARN</level>
    </filter>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
      <fileNamePattern>${LOG_PATH}/${appName}-error-%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
      <maxFileSize>50MB</maxFileSize>
      <maxHistory>60</maxHistory>
      <totalSizeCap>3GB</totalSizeCap>
    </rollingPolicy>
    <encoder>
      <pattern>${LOG_PATTERN}</pattern>
      <charset>UTF-8</charset>
    </encoder>
  </appender>

  <!-- Async Appender tối ưu hiệu năng ghi file -->
  <appender name="ASYNC_APP" class="ch.qos.logback.classic.AsyncAppender">
    <appender-ref ref="APP_FILE"/>
    <queueSize>1024</queueSize>
    <discardingThreshold>0</discardingThreshold>
  </appender>

  <appender name="ASYNC_ERROR" class="ch.qos.logback.classic.AsyncAppender">
    <appender-ref ref="ERROR_FILE"/>
    <queueSize>512</queueSize>
    <discardingThreshold>0</discardingThreshold>
  </appender>

  <!-- Môi trường Local / Dev -->
  <springProfile name="dev,local">
    <root level="INFO">
      <appender-ref ref="CONSOLE"/>
      <appender-ref ref="ASYNC_APP"/>
      <appender-ref ref="ASYNC_ERROR"/>
    </root>
  </springProfile>

  <!-- Môi trường Production -->
  <springProfile name="prod">
    <root level="INFO">
      <appender-ref ref="ASYNC_APP"/>
      <appender-ref ref="ASYNC_ERROR"/>
    </root>
  </springProfile>

</configuration>
```
