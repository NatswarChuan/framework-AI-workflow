package com.example.implementation;

import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.context.DataSourceContextHolder;
import io.github.natswarchuan.module.datasource.helper.DataSourceRoutingResolverHelper;
import io.github.natswarchuan.module.metrics.constant.MetricConstant;
import io.github.natswarchuan.module.metrics.helper.DynamicEntityMetricsHelper;
import io.micrometer.core.instrument.MeterRegistry;
import java.lang.reflect.Method;
import java.util.Objects;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enterprise integration tests validating Dynamic Multi-Datasource Routing SPI
 * and Micrometer APM Observability metrics.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MultiDatasourceAndMetricsIntegrationTest {

  @Autowired
  private DataSourceRoutingResolverHelper routingResolverHelper;

  @Autowired
  private DynamicEntityMetricsHelper metricsHelper;

  @Autowired
  private MeterRegistry meterRegistry;

  /**
   * Validates automatic read/write routing resolution:
   * Read operations route to REPLICA, write operations route to PRIMARY.
   */
  @Test
  @DisplayName("Verify automatic Primary/Replica datasource key resolution")
  public void testDataSourceRoutingResolution() throws Exception {
    final Method readMethod = SampleDatasourceService.class.getMethod("getReadOnlyData");
    final String resolvedReadDataSource = routingResolverHelper.resolveTargetDataSource(readMethod, true);
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_REPLICA, resolvedReadDataSource);

    final Method writeMethod = SampleDatasourceService.class.getMethod("saveWriteData");
    final String resolvedWriteDataSource = routingResolverHelper.resolveTargetDataSource(writeMethod, false);
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_PRIMARY, resolvedWriteDataSource);

    final Method forcedPrimaryMethod = SampleDatasourceService.class.getMethod("getForcedPrimaryData");
    final String resolvedForced = routingResolverHelper.resolveTargetDataSource(forcedPrimaryMethod, true);
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_PRIMARY, resolvedForced);
  }

  /**
   * Validates ThreadLocal datasource context lifecycle and clearing.
   */
  @Test
  @DisplayName("Verify DataSourceContextHolder lifecycle and clean isolation")
  public void testDataSourceContextHolderLifecycle() {
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_PRIMARY, DataSourceContextHolder.getDataSourceKey());
    Assertions.assertFalse(DataSourceContextHolder.isReplica());

    DataSourceContextHolder.setDataSourceKey(DataSourceConstant.DATASOURCE_REPLICA);
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_REPLICA, DataSourceContextHolder.getDataSourceKey());
    Assertions.assertTrue(DataSourceContextHolder.isReplica());

    DataSourceContextHolder.clear();
    Assertions.assertEquals(DataSourceConstant.DATASOURCE_PRIMARY, DataSourceContextHolder.getDataSourceKey());
  }

  /**
   * Validates Micrometer APM counters and timers for Outbox & Routing operations.
   */
  @Test
  @DisplayName("Verify APM Micrometer metrics recording for enterprise observability")
  public void testMetricsRecording() {
    metricsHelper.recordOutboxDispatched("ORDER_PLACED", "PUBLISHED");
    metricsHelper.recordDataSourceRouting(DataSourceConstant.DATASOURCE_REPLICA);

    final double outboxCount = meterRegistry.get(MetricConstant.METRIC_OUTBOX_DISPATCHED_TOTAL)
        .tag(MetricConstant.TAG_OPERATION, "ORDER_PLACED")
        .counter()
        .count();
    Assertions.assertTrue(outboxCount >= 1.0);

    final double routingCount = meterRegistry.get(MetricConstant.METRIC_DATASOURCE_ROUTING_TOTAL)
        .tag(MetricConstant.TAG_DATASOURCE, DataSourceConstant.DATASOURCE_REPLICA)
        .counter()
        .count();
    Assertions.assertTrue(routingCount >= 1.0);
  }

  /**
   * Sample service used to verify declarative datasource annotations.
   */

}

