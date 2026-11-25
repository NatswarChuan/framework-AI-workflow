package com.novamart.ecommerce.properties;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Strongly-typed configuration properties for NovaMart PRIMARY and REPLICA JDBC pools.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = NovaFieldConstant.CONFIG_PREFIX_DATASOURCE)
public class NovaDataSourceProperties {

  /** JDBC URL for the PRIMARY read-write datasource. */
  private String primaryUrl;

  /** JDBC URL for the REPLICA read-only analytics datasource. */
  private String replicaUrl;

  /** JDBC driver class name. */
  private String driverClassName;

  /** Database username. */
  private String username;

  /** Database password. */
  private String password;

  /** Maximum HikariCP connection pool size per cluster. */
  private int maximumPoolSize = NovaNumericConstant.DEFAULT_MAX_POOL_SIZE;
}
