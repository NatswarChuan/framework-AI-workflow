import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const EscapeHatchPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="escape-hatch"
        currentLang={currentLang}
        badges={[
          { label: '@ServiceOverride', tone: 'purple' },
          { label: 'EscapeHatchDispatchHelper', tone: 'blue' },
          { label: 'GET /system/studio/eject', tone: 'emerald' },
        ]}
      />

      <h2 id="escape-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.ehGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="escape-attributes" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE2_CONTENT.ehThAttr, currentLang)}</th>
              <th>{pickText(STAGE2_CONTENT.ehThType, currentLang)}</th>
              <th>{pickText(STAGE2_CONTENT.ehThBehavior, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>targetBean</code></td>
              <td><code>Class&lt;?&gt;</code> (<code>Void.class</code>)</td>
              <td><RichDocText text={STAGE2_CONTENT.ehRowTargetBean} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>beanName</code></td>
              <td><code>String</code> (<code>""</code>)</td>
              <td><RichDocText text={STAGE2_CONTENT.ehRowBeanName} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>methodName</code></td>
              <td><code>String</code> (<code>""</code>)</td>
              <td><RichDocText text={STAGE2_CONTENT.ehRowMethodName} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>bypassAutoDispatch</code></td>
              <td><code>boolean</code> (<code>true</code>)</td>
              <td><RichDocText text={STAGE2_CONTENT.ehRowBypass} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="escape-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'controller-override',
            label: pickText(STAGE2_CONTENT.ehTabCtrl, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/TagController.java',
            highlightLines: [18, 19, 20, 21, 25, 26],
            code: `package com.example.implementation.controller;

import com.example.implementation.entity.Tag;
import com.example.implementation.service.helper.TagEscapeHatchHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoApiController;
import java.util.Map;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@AutoRestController
public interface TagController extends AutoApiController<Tag> {

  @AutoGet("/showcase/escape-hatch-stats")
  @ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
  ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();

  // Standard Spring MVC @PostMapping / @PathVariable / @RequestParam / @RequestBody also work natively!
  @PostMapping("/showcase/echo-params/{code}")
  @ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "echoStandardParams")
  ApiResponse<Map<String, String>> echoStandardParams(
      @PathVariable("code") String code,
      @RequestParam("mode") String mode,
      @RequestBody Tag payload);
}`,
          },
          {
            id: 'custom-service',
            label: pickText(STAGE2_CONTENT.ehTabService, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/service/helper/TagEscapeHatchHelper.java',
            code: `package com.example.implementation.service.helper;

import com.example.implementation.entity.Tag;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.common.util.UuidUtil;
import jakarta.persistence.EntityManager;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public final class TagEscapeHatchHelper {

  private final EntityManager entityManager;

  public ApiResponse<Map<String, String>> buildTaxonomyStats() {
    final Long countValue =
        entityManager.createQuery("SELECT COUNT(t) FROM Tag t", Long.class).getSingleResult();
    final Map<String, String> payload = new LinkedHashMap<>();
    payload.put("entity", "Tag");
    payload.put("totalTags", String.valueOf(countValue));
    payload.put("dispatchMode", "STAGE_2_SERVICE_OVERRIDE_SPRING_DI");
    payload.put("evaluationId", UuidUtil.generateUuidV7().toString());
    return ApiResponse.success(payload);
  }

  public ApiResponse<Map<String, String>> echoStandardParams(
      final String code, final String mode, final Tag payload) {
    final Map<String, String> result = new LinkedHashMap<>();
    result.put("code", code);
    result.put("mode", mode);
    if (Objects.nonNull(payload)) {
      result.put("label", payload.getLabel());
    }
    return ApiResponse.success(result);
  }
}`,
          },
          {
            id: 'eject-cmd',
            label: 'Try Live (curl) + Code Eject',
            language: 'bash',
            fileName: '03-escape-hatch-and-eject.sh',
            code: `# 1. Create a marketplace taxonomy Tag
curl -s -X POST "http://localhost:8080/api/v1/tags" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"code":"DOC-FEATURED","label":"Featured Flagship"}' | jq

# 2. Call the @ServiceOverride escape-hatch route
curl -s "http://localhost:8080/api/v1/tags/showcase/escape-hatch-stats" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 3. Call the standard Spring MVC parameter-binding route
curl -s -X POST "http://localhost:8080/api/v1/tags/showcase/echo-params/DOC-01?mode=strict" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"code":"DOC-01","label":"Flagship Tag"}' | jq

# 4. Eject 5 standalone Java files (DTO, Repository, Service, ServiceImpl, Controller)
curl -s "http://localhost:8080/system/studio/eject?target=ProductCatalog" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`,
          },
        ]}
      />

      <h2 id="escape-verify" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.ehVerifyBody} currentLang={currentLang} />
      </p>

      <h2 id="escape-security" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="security" currentLang={currentLang}>
        <RichDocText text={STAGE2_CONTENT.ehCalloutSecurity} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
