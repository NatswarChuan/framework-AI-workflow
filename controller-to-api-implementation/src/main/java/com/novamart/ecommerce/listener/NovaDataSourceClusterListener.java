package com.novamart.ecommerce.listener;

import com.novamart.ecommerce.constant.NovaLogConstant;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import io.github.natswarchuan.module.datasource.helper.MultiPlatformDataSourceRegistryHelper;
import java.util.Objects;
import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * Registers PRIMARY and REPLICA pools with Spring-NWVMC multi-database telemetry upon boot.
 */
@Slf4j
@Component
public final class NovaDataSourceClusterListener
    implements ApplicationListener<ApplicationReadyEvent> {

  private final ObjectProvider<MultiPlatformDataSourceRegistryHelper> registryProvider;
  private final DataSource primaryDataSource;
  private final DataSource replicaDataSource;

  /**
   * Creates the listener with ObjectProvider-deferred access to framework registry helper.
   *
   * @param registryProvider provider for framework MultiPlatformDataSourceRegistryHelper
   * @param primaryDataSource primary read-write pool
   * @param replicaDataSource replica read-only pool
   */
  public NovaDataSourceClusterListener(
      final ObjectProvider<MultiPlatformDataSourceRegistryHelper> registryProvider,
      @Qualifier(DataSourceConstant.DATASOURCE_PRIMARY) final DataSource primaryDataSource,
      @Qualifier(DataSourceConstant.DATASOURCE_REPLICA) final DataSource replicaDataSource) {
    this.registryProvider = registryProvider;
    this.primaryDataSource = primaryDataSource;
    this.replicaDataSource = replicaDataSource;
  }

  /**
   * Registers both PRIMARY and REPLICA datasource clusters once Spring Boot is ready.
   *
   * @param event application ready event
   */
  @Override
  public void onApplicationEvent(final ApplicationReadyEvent event) {
    log.info(NovaLogConstant.START_DATASOURCE_INIT);
    final MultiPlatformDataSourceRegistryHelper registry = registryProvider.getIfAvailable();
    if (Objects.isNull(registry)) {
      log.info(NovaLogConstant.FINISH_DATASOURCE_INIT);
      return;
    }
    registry.registerCluster(
        DatabasePlatformConstant.CLUSTER_PRIMARY,
        primaryDataSource,
        DatabasePlatformConstant.PLATFORM_H2,
        false);
    registry.registerCluster(
        DatabasePlatformConstant.CLUSTER_REPLICA,
        replicaDataSource,
        DatabasePlatformConstant.PLATFORM_H2,
        true);
    log.info(NovaLogConstant.FINISH_DATASOURCE_INIT);
  }
}
