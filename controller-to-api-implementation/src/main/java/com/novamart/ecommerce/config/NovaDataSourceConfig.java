package com.novamart.ecommerce.config;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.properties.NovaDataSourceProperties;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.routing.DynamicRoutingDataSource;
import javax.sql.DataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Multi-datasource routing configuration binding PRIMARY and REPLICA pools into Spring-NWVMC.
 */
@Slf4j
@Configuration
public class NovaDataSourceConfig {

  /**
   * Builds the PRIMARY read-write HikariCP DataSource bean.
   *
   * @param properties NovaMart datasource properties
   * @return configured PRIMARY HikariDataSource
   */
  @Bean(name = DataSourceConstant.DATASOURCE_PRIMARY)
  public DataSource primaryDataSource(final NovaDataSourceProperties properties) {
    final HikariConfig config = new HikariConfig();
    config.setJdbcUrl(properties.getPrimaryUrl());
    config.setDriverClassName(properties.getDriverClassName());
    config.setUsername(properties.getUsername());
    config.setPassword(properties.getPassword());
    config.setMaximumPoolSize(properties.getMaximumPoolSize());
    config.setPoolName(NovaFieldConstant.POOL_NAME_PRIMARY);
    return new HikariDataSource(config);
  }

  /**
   * Builds the REPLICA read-only analytics HikariCP DataSource bean.
   *
   * @param properties NovaMart datasource properties
   * @return configured REPLICA HikariDataSource
   */
  @Bean(name = DataSourceConstant.DATASOURCE_REPLICA)
  public DataSource replicaDataSource(final NovaDataSourceProperties properties) {
    final HikariConfig config = new HikariConfig();
    config.setJdbcUrl(properties.getReplicaUrl());
    config.setDriverClassName(properties.getDriverClassName());
    config.setUsername(properties.getUsername());
    config.setPassword(properties.getPassword());
    config.setMaximumPoolSize(properties.getMaximumPoolSize());
    config.setPoolName(NovaFieldConstant.POOL_NAME_REPLICA);
    return new HikariDataSource(config);
  }

  /**
   * Creates the primary DynamicRoutingDataSource routing between PRIMARY and REPLICA pools.
   *
   * @param primaryDs primary read-write pool
   * @param replicaDs replica read-only pool
   * @return dynamic routing DataSource
   */
  @Bean
  @Primary
  public DataSource dataSource(
      @Qualifier(DataSourceConstant.DATASOURCE_PRIMARY) final DataSource primaryDs,
      @Qualifier(DataSourceConstant.DATASOURCE_REPLICA) final DataSource replicaDs) {
    log.info(NovaLogConstant.START_DATASOURCE_INIT);
    final DynamicRoutingDataSource routingDataSource = new DynamicRoutingDataSource();
    routingDataSource.registerDataSourceEntry(DataSourceConstant.DATASOURCE_PRIMARY, primaryDs);
    routingDataSource.registerDataSourceEntry(DataSourceConstant.DATASOURCE_REPLICA, replicaDs);
    routingDataSource.setDefaultTargetDataSource(primaryDs);
    log.info(NovaLogConstant.FINISH_DATASOURCE_INIT);
    return routingDataSource;
  }
}
