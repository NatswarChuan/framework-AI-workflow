package com.novamart.ecommerce.provider;

import com.novamart.ecommerce.constant.NovaLogConstant;
import io.github.natswarchuan.module.event.OutboxEvent;
import io.github.natswarchuan.module.event.provider.OutboxEventDispatcherProvider;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Custom Transactional Outbox SPI dispatcher recording committed NovaMart domain events.
 */
@Slf4j
@Component
public final class NovaOutboxDispatcherProvider implements OutboxEventDispatcherProvider {

  private final List<OutboxEvent> dispatchedEvents = new CopyOnWriteArrayList<>();

  /**
   * Records committed OutboxEvent records along with W3C tracing headers for downstream relay.
   *
   * @param event committed outbox event record
   * @param headers propagated tracing and correlation headers
   * @return true when event is accepted for delivery; false when event is null
   */
  @Override
  public boolean dispatch(final OutboxEvent event, final Map<String, String> headers) {
    if (Objects.isNull(event)) {
      return false;
    }
    log.info(NovaLogConstant.START_OUTBOX_DISPATCH, event.getAggregateType(), event.getEventType());
    dispatchedEvents.add(event);
    log.info(
        NovaLogConstant.FINISH_OUTBOX_DISPATCH, event.getAggregateId(), dispatchedEvents.size());
    return true;
  }

  /**
   * Returns an unmodifiable snapshot of all recorded dispatched outbox events.
   *
   * @return immutable list of dispatched OutboxEvent instances
   */
  public List<OutboxEvent> getDispatchedEvents() {
    return Collections.unmodifiableList(dispatchedEvents);
  }

  /**
   * Clears recorded outbox events between isolated test executions.
   */
  public void clearDispatchedEvents() {
    dispatchedEvents.clear();
  }
}
