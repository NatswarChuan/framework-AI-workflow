# Rule 28: Kiến Trúc Mô-Đun & Sẵn Sàng Tách Microservices (Modular Architecture & Microservice Readiness)

Tài liệu này xác lập quy chuẩn thiết kế mã nguồn theo kiến trúc Mô-đun hóa (Modular Monolith / Bounded Contexts), đảm bảo hệ thống có khả năng mở rộng lâu dài và sẵn sàng phân rã thành Microservices mà không gây ảnh hưởng dây chuyền (Blast Radius = 0).

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Phân Tách Theo Miền Nghiệp Vụ Độc Lập (Bounded Contexts Isolation)**:
   - Hệ thống phải được phân chia thành các module nghiệp vụ riêng biệt (`user`, `order`, `payment`, `inventory`, `notification`).
   - Mỗi module đóng vai trò như một "Microservice nội bộ": chỉ công khai các **Public Interfaces** và **Contract DTOs** ra bên ngoài. Toàn bộ JPA Entities, Repositories, Helpers và Service Impl nội bộ của module phải được bảo vệ kín, các module khác không được truy cập trực tiếp.
2. **Chuẩn Bị Sẵn Cơ Sở Dữ Liệu Riêng (Database-Per-Service Readiness - CẤM JOIN CHÉO DOMAIN)**:
   - **TUYỆT ĐỐI CẤM** viết câu lệnh SQL `JOIN` chéo giữa các bảng thuộc hai domain độc lập khác nhau (ví dụ: cấm `JOIN orders o JOIN users u ON o.user_id = u.id`).
   - **Ràng buộc khóa ngoại logic**: Giữa các module độc lập, chỉ lưu trữ mã định danh ID (UUIDv7) dạng logic, không sử dụng Foreign Key cứng hay `@ManyToOne`/`@OneToMany` trỏ trực tiếp sang Entity của domain khác.
   - Khi cần dữ liệu giữa các domain, bắt buộc truy xuất thông qua Service Interface công khai, DTO Projection hoặc đồng bộ qua Events. Nhờ đó, khi tách CSDL vật lý độc lập cho từng Microservice, không có câu lệnh SQL nào bị vỡ.
3. **Giao Tiếp Bất Đồng Bộ Bằng Domain Events (Decoupling via Spring Events)**:
   - Khi một hành động ở Domain A hoàn tất và cần kích hoạt xử lý ở Domain B (ví dụ: Đơn hàng tạo thành công -> Gửi thông báo, Giảm tồn kho), Domain A không được gọi trực tiếp Service của Domain B.
   - Domain A phát sinh Domain Event qua Spring `ApplicationEventPublisher`. Domain B lắng nghe qua `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`.
   - Khi chuyển sang Microservices, chỉ cần thay Event Bus nội bộ thành Kafka/RabbitMQ mà không cần sửa đổi bất kỳ dòng mã nghiệp vụ nào.
4. **Cô Lập Vùng Tác Động Khi Nâng Cấp (Zero Blast Radius & OCP)**:
   - Mọi thay đổi nội bộ của một module (sửa đổi query DB, đổi thuật toán, tối ưu cache) đều được đóng gói kín trong module đó, tác động ảnh hưởng sang các module khác bằng 0.
   - Phụ thuộc duy nhất vào hợp đồng Interface trừu tượng (DIP). Khi nâng cấp API/DTO, bắt buộc tuân thủ nguyên tắc tương thích ngược (Backward Compatibility).

---

## 2. BẢNG ĐỐI CHIẾU KIẾN TRÚC MONOLITH DÍNH CHẶT VS MICROSERVICE-READY

| Tiêu chí | ❌ Kiến trúc Dính Chặt (Khó tách, Dễ vỡ) | ✅ Kiến trúc Mô-Đun (Sẵn sàng Microservices) |
| :--- | :--- | :--- |
| **Quan hệ Entity** | `@ManyToOne UserEntity` trong `OrderEntity` | Chỉ lưu `UUID userId` trong `OrderEntity` |
| **Truy vấn CSDL** | `SELECT * FROM orders o JOIN users u` | Truy vấn độc lập theo domain, ghép dữ liệu ở tầng DTO |
| **Giao tiếp luồng** | `OrderService` gọi trực tiếp `NotificationService` | Phát sinh `OrderCreatedEvent`, Notification tự bắt sự kiện |
| **Phụ thuộc gói** | Gọi trực tiếp `UserRepository` của domain khác | Chỉ giao tiếp qua Public `UserServiceClient` / Event |
| **Khi bảo trì DB** | Đổi cấu trúc bảng User làm hỏng Order | Chỉ module User bị ảnh hưởng, Order hoàn toàn an toàn |

---

## 3. CODE MẪU CHUẨN MỰC

### 3.1. Entity Lưu Khóa Ngoại Logic UUIDv7 Thay Vì Quan Hệ Trực Tiếp
```java
package com.enterprise.app.order.entity;

import com.enterprise.app.common.entity.BaseAuditEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Thực thể đơn hàng độc lập, không join cứng sang thực thể người dùng của domain khác.
 */
@Entity
@Table(name = "tbl_orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity extends BaseAuditEntity {

  @Column(name = "user_id", nullable = false)
  private UUID customerId; // Khóa ngoại logic UUIDv7, không dùng @ManyToOne UserEntity

  @Column(name = "total_amount", nullable = false)
  private BigDecimal totalAmount;
}
```

### 3.2. Giao Tiếp Bất Đồng Bộ Qua Domain Event Triệt Tiêu Dính Chặt
```java
package com.enterprise.app.order.service.impl;

import com.enterprise.app.order.event.OrderPlacementCompletedEvent;
import com.enterprise.app.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderProcessingServiceImpl implements OrderProcessingService {

  private final OrderRepository orderRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public OrderResponse placeOrder(final OrderCreateRequest request) {
    final OrderEntity savedOrder = orderRepository.save(request.toEntity());

    // Phát sinh Event thay vì gọi trực tiếp sang module Notification/Payment
    final OrderPlacementCompletedEvent event = OrderPlacementCompletedEvent.builder()
        .orderId(savedOrder.getId())
        .customerId(savedOrder.getCustomerId())
        .totalAmount(savedOrder.getTotalAmount())
        .build();
    eventPublisher.publishEvent(event);

    return OrderResponse.fromEntity(savedOrder);
  }
}
```
