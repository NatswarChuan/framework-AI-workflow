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

public class SampleDatasourceService {

  @Transactional(readOnly = true)
  public String getReadOnlyData() {
    return "read";
  }

  @Transactional
  public void saveWriteData() {
    // write operation
  }

  @TargetDataSource(DataSourceConstant.DATASOURCE_PRIMARY)
  @Transactional(readOnly = true)
  public String getForcedPrimaryData() {
    return "primary";
  }
}
