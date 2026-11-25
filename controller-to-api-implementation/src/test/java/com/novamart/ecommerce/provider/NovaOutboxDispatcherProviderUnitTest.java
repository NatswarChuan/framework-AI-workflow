package com.novamart.ecommerce.provider;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.natswarchuan.common.constant.EventConstant;
import io.github.natswarchuan.module.event.OutboxEvent;
import java.util.Map;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for NovaOutboxDispatcherProvider covering happy path, null guard, and clear behavior.
 */
public class NovaOutboxDispatcherProviderUnitTest {

  @Test
  public void shouldRecordDispatchedEventsAndRejectNullEvent() {
    final NovaOutboxDispatcherProvider provider = new NovaOutboxDispatcherProvider();
    assertThat(provider.dispatch(null, Map.of())).isFalse();
    assertThat(provider.getDispatchedEvents()).isEmpty();

    final OutboxEvent event =
        OutboxEvent.builder()
            .aggregateType("CheckoutPayment")
            .aggregateId("pay-1")
            .eventType(EventConstant.EVENT_TYPE_CREATED)
            .payload("{}")
            .build();

    assertThat(provider.dispatch(event, Map.of("X-Request-ID", "trace-1"))).isTrue();
    assertThat(provider.getDispatchedEvents()).hasSize(1);
    assertThat(provider.getDispatchedEvents().get(0).getEventType())
        .isEqualTo(EventConstant.EVENT_TYPE_CREATED);

    provider.clearDispatchedEvents();
    assertThat(provider.getDispatchedEvents()).isEmpty();
  }
}
