package com.novamart.ecommerce.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.novamart.ecommerce.listener.NovaDataSourceClusterListener;
import com.novamart.ecommerce.properties.NovaDataSourceProperties;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import io.github.natswarchuan.module.datasource.helper.MultiPlatformDataSourceRegistryHelper;
import io.github.natswarchuan.module.datasource.routing.DynamicRoutingDataSource;
import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.context.event.ApplicationReadyEvent;

/**
 * Isolated unit tests for NovaDataSourceProperties, NovaDataSourceConfig, and cluster listener.
 */
public class NovaDataSourceConfigUnitTest {

  @Test
  @SuppressWarnings("unchecked")
  public void shouldBuildRoutingDataSourceAndRegisterClustersWhenRegistryAvailable() {
    final NovaDataSourceProperties props = new NovaDataSourceProperties();
    props.setPrimaryUrl("jdbc:h2:mem:unitprimary;DB_CLOSE_DELAY=-1");
    props.setReplicaUrl("jdbc:h2:mem:unitreplica;DB_CLOSE_DELAY=-1");
    props.setDriverClassName("org.h2.Driver");
    props.setUsername("sa");
    props.setPassword("");
    props.setMaximumPoolSize(5);

    final NovaDataSourceConfig config = new NovaDataSourceConfig();
    final DataSource primary = config.primaryDataSource(props);
    final DataSource replica = config.replicaDataSource(props);
    final DataSource routing = config.dataSource(primary, replica);
    assertThat(routing).isInstanceOf(DynamicRoutingDataSource.class);

    final ObjectProvider<MultiPlatformDataSourceRegistryHelper> provider =
        mock(ObjectProvider.class);
    final MultiPlatformDataSourceRegistryHelper registry =
        mock(MultiPlatformDataSourceRegistryHelper.class);
    when(provider.getIfAvailable()).thenReturn(registry);

    final NovaDataSourceClusterListener listener =
        new NovaDataSourceClusterListener(provider, primary, replica);
    listener.onApplicationEvent(mock(ApplicationReadyEvent.class));
    verify(registry)
        .registerCluster(
            DatabasePlatformConstant.CLUSTER_PRIMARY,
            primary,
            DatabasePlatformConstant.PLATFORM_H2,
            false);
    verify(registry)
        .registerCluster(
            DatabasePlatformConstant.CLUSTER_REPLICA,
            replica,
            DatabasePlatformConstant.PLATFORM_H2,
            true);

    when(provider.getIfAvailable()).thenReturn(null);
    listener.onApplicationEvent(mock(ApplicationReadyEvent.class));
  }
}
