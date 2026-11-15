package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.implementation.entity.ProductCatalog;
import io.github.natswarchuan.common.dto.EntityAuditRecordDto;
import io.github.natswarchuan.common.dto.EntityFieldDiffDto;
import io.github.natswarchuan.core.helper.AuditTrailDiffHelper;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Enterprise integration test validating Change Data Capture (CDC) audit trail
 * diffing engine on live marketplace entities.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@ActiveProfiles("test")
public class AuditTrailCDCIntegrationTest {

  @Autowired
  private AuditTrailDiffHelper auditTrailDiffHelper;

  @Test
  @DisplayName("Verify Change Data Capture (CDC) field-level delta calculation and audit trail creation")
  public void testFieldLevelCdcAuditing() {
    final ProductCatalog original = ProductCatalog.builder()
        .skuCode("SKU-CDC-01")
        .productName("Original Camera Pro")
        .category("CAMERAS")
        .vendorStoreCode("VENDOR-CDC")
        .retailPrice(new BigDecimal("1200.00"))
        .b2bWholesalePrice(new BigDecimal("1000.00"))
        .costPrice(new BigDecimal("800.00"))
        .active(true)
        .build();

    final ProductCatalog updated = ProductCatalog.builder()
        .skuCode("SKU-CDC-01")
        .productName("Original Camera Pro (Mark II)")
        .category("CAMERAS")
        .vendorStoreCode("VENDOR-CDC")
        .retailPrice(new BigDecimal("1350.00"))
        .b2bWholesalePrice(new BigDecimal("1000.00"))
        .costPrice(new BigDecimal("850.00"))
        .active(true)
        .build();

    // 1. Compute field-level diffs
    final List<EntityFieldDiffDto> diffs = auditTrailDiffHelper.computeFieldDiffs(original, updated);

    assertThat(diffs).hasSize(3);
    assertThat(diffs).anyMatch(d -> d.getFieldName().equals("productName")
        && d.getOldValue().equals("Original Camera Pro")
        && d.getNewValue().equals("Original Camera Pro (Mark II)"));
    assertThat(diffs).anyMatch(d -> d.getFieldName().equals("retailPrice")
        && d.getOldValue().equals("1200.00")
        && d.getNewValue().equals("1350.00"));
    assertThat(diffs).anyMatch(d -> d.getFieldName().equals("costPrice")
        && d.getOldValue().equals("800.00")
        && d.getNewValue().equals("850.00"));

    // 2. Generate immutable audit record
    final EntityAuditRecordDto auditRecord = auditTrailDiffHelper.createAuditRecord(
        original,
        updated,
        "UPDATE",
        "auditor@marketplace.com",
        "UUID-PRODUCT-99"
    );

    assertThat(auditRecord.getEntityId()).isEqualTo("UUID-PRODUCT-99");
    assertThat(auditRecord.getEntityType()).isEqualTo("ProductCatalog");
    assertThat(auditRecord.getAction()).isEqualTo("UPDATE");
    assertThat(auditRecord.getPerformedBy()).isEqualTo("auditor@marketplace.com");
    assertThat(auditRecord.getFieldDiffs()).hasSize(3);
    assertThat(auditRecord.getTimestamp()).isNotNull();
  }
}
