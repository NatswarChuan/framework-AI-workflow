import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE3_CONTENT } from '../data/pages/stage3Content';
import { STAGE6_CONTENT } from '../data/pages/stage6Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const DistributedLockPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="distributed-lock"
        currentLang={currentLang}
        badges={[
          { label: '@DistributedLock', tone: 'amber' },
          { label: 'DistributedLockAspect', tone: 'purple' },
          { label: pickText(STAGE6_CONTENT.dlBadgeCache, currentLang), tone: 'blue' },
        ]}
      />

      <h2 id="lock-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE6_CONTENT.dlGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="lock-attrs" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE3_CONTENT.ceThAttr, currentLang)}</th>
              <th>{pickText(STAGE6_CONTENT.dlThDef, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colDescription, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>key</code></td>
              <td><code>""</code></td>
              <td><RichDocText text={STAGE6_CONTENT.dlRowKey} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>waitTimeMs</code></td>
              <td><code>3000L</code> (<code>DEFAULT_WAIT_TIME_MS</code>)</td>
              <td><RichDocText text={STAGE6_CONTENT.dlRowWait} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>leaseTimeMs</code></td>
              <td><code>5000L</code> (<code>DEFAULT_LEASE_TIME_MS</code>)</td>
              <td><RichDocText text={STAGE6_CONTENT.dlRowLease} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="lock-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'lock-controller',
            label: 'InventoryStockController.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/InventoryStockController.java',
            highlightLines: [14, 15, 16, 17, 18, 19],
            code: `package com.example.implementation.controller;

import com.example.implementation.dto.InventoryReservationReceiptDto;
import com.example.implementation.entity.InventoryStock;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.CustomEndpoint;
import io.github.natswarchuan.core.controller.AutoApiController;
import org.springframework.web.bind.annotation.RequestParam;

@AutoRestController
public interface InventoryStockController extends AutoApiController<InventoryStock> {

  @CustomEndpoint(
      path = "/reserve",
      httpMethod = "POST",
      delegateBean = "inventoryReservationService",
      delegateMethod = "reserveStock")
  ApiResponse<InventoryReservationReceiptDto> reserveStock(
      @RequestParam("sku") String stockSkuCode,
      @RequestParam("qty") Integer quantity);
}`,
          },
          {
            id: 'lock-service-impl',
            label: 'InventoryReservationServiceImpl.java (@DistributedLock)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/service/impl/InventoryReservationServiceImpl.java',
            highlightLines: [14, 15, 22, 23, 24, 25, 26],
            code: `package com.example.implementation.service.impl;

import com.example.implementation.dto.InventoryReservationReceiptDto;
import com.example.implementation.entity.InventoryStock;
import com.example.implementation.helper.InventoryReservationHelper;
import com.example.implementation.service.InventoryReservationService;
import io.github.natswarchuan.module.lock.annotation.DistributedLock;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Lazy // Ensures DistributedLockAspect is registered before Spring creates this proxy
@Service("inventoryReservationService")
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class InventoryReservationServiceImpl implements InventoryReservationService {

  private final InventoryReservationHelper reservationHelper;

  @Override
  @Transactional(rollbackFor = Exception.class)
  @DistributedLock(
      key = "'SKU_STOCK_' + #stockSkuCode",
      waitTimeMs = 3000L,
      leaseTimeMs = 5000L)
  public InventoryReservationReceiptDto reserveStock(final String stockSkuCode, final Integer quantity) {
    reservationHelper.validateReservationInput(stockSkuCode, quantity);
    final InventoryStock stock = reservationHelper.loadStockOrThrow(stockSkuCode);
    return reservationHelper.deductAndBuildReceipt(stock, quantity);
  }
}`,
          },
          {
            id: 'lock-service-interface',
            label: 'InventoryReservationService.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/service/InventoryReservationService.java',
            code: `package com.example.implementation.service;

import com.example.implementation.dto.InventoryReservationReceiptDto;

public interface InventoryReservationService {
  InventoryReservationReceiptDto reserveStock(String stockSkuCode, Integer quantity);
}`,
          },
          {
            id: 'lock-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '10b-distributed-lock-inventory.sh',
            code: `# 1. Seed a warehouse InventoryStock record with 10 available units
curl -s -X POST "http://localhost:8080/api/v1/inventory-stocks" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"stockSkuCode":"STK-DOC-MAC-WH1","productSkuCode":"SKU-DOC-MAC-M3","warehouseCode":"WH-HCMC-01","availableQuantity":10,"reservedQuantity":0,"lowStockThreshold":2}' | jq

# 2. Reserve 3 units atomically under @DistributedLock(key = "'SKU_STOCK_' + #stockSkuCode") -> remainingAvailable: 7
curl -s -X POST "http://localhost:8080/api/v1/inventory-stocks/reserve?sku=STK-DOC-MAC-WH1&qty=3" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 3. Attempting to over-reserve 50 units -> HTTP 409 Conflict (InsufficientInventoryException)
curl -i -X POST "http://localhost:8080/api/v1/inventory-stocks/reserve?sku=STK-DOC-MAC-WH1&qty=50" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`,
          },
        ]}
      />

      <h2 id="distributed-lock-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE6_CONTENT.dlCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
