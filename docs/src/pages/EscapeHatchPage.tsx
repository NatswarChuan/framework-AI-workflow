import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

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
        Zero-lock-in extensibility operates at two levels: inline per-method override via <code>@ServiceOverride</code> inside an <code>AutoApiController&lt;E&gt;</code> interface, and full scaffold ejection via <code>DevEjectionController</code> (<code>GET /system/studio/eject</code>) backed by <code>ControllerEjectionHelper</code>.
      </p>

      <h2 id="escape-attributes" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>@ServiceOverride Attribute</th>
              <th>Type / Default</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>targetBean</code></td>
              <td><code>Class&lt;?&gt;</code> (<code>Void.class</code>)</td>
              <td>Resolves the Spring target bean by Java type</td>
            </tr>
            <tr>
              <td><code>beanName</code></td>
              <td><code>String</code> (<code>""</code>)</td>
              <td>Resolves target bean by explicit Spring container name</td>
            </tr>
            <tr>
              <td><code>methodName</code></td>
              <td><code>String</code> (<code>""</code>)</td>
              <td>Target method on the custom bean (defaults to interface method name)</td>
            </tr>
            <tr>
              <td><code>bypassAutoDispatch</code></td>
              <td><code>boolean</code> (<code>true</code>)</td>
              <td>Short-circuits generic CRUD proxy execution when enabled</td>
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
            label: 'Controller Interface',
            language: 'java',
            fileName: 'controller/TagController.java',
            highlightLines: [4, 5, 6, 7],
            code: `@AutoRestController(path = "/api/v1/tags")
public interface TagController extends AutoApiController<Tag> {

  @ServiceOverride(
      beanName = "tagCustomOverrideService",
      methodName = "getCustomTagStats",
      bypassAutoDispatch = true
  )
  @AutoGet("/showcase/escape-hatch-stats")
  ApiResponse<String> getCustomTagStats();
}`,
          },
          {
            id: 'custom-service',
            label: 'Custom Service Bean',
            language: 'java',
            fileName: 'service/impl/TagCustomOverrideServiceImpl.java',
            code: `@AutoService("tagCustomOverrideService")
public class TagCustomOverrideServiceImpl implements TagCustomOverrideService {

  @Override
  public ApiResponse<String> getCustomTagStats() {
    return ApiResponse.success("Custom Escape Hatch Stats Response");
  }
}`,
          },
          {
            id: 'eject-cmd',
            label: 'MVC Ejection CLI',
            language: 'bash',
            fileName: 'GET /system/studio/eject',
            code: `# Eject standalone Controller, Service, ServiceImpl, and Repository source
curl -X GET "http://localhost:8080/system/studio/eject?target=ProductCatalog" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"`,
          },
        ]}
      />

      <h2 id="escape-verify" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Calling <code>GET /api/v1/tags/showcase/escape-hatch-stats</code> bypasses dynamic entity queries and invokes <code>TagCustomOverrideServiceImpl.getCustomTagStats()</code> through cached <code>MethodHandleCacheUtil</code>. Calling <code>GET /system/studio/eject?target=ProductCatalog</code> returns serialized Java source templates ready to copy into custom packages whenever full framework detachment is required.
      </p>

      <h2 id="escape-security" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="security" currentLang={currentLang}>
        <code>DevEjectionController</code> enforces <code>SurfaceAccessGuardrailUtil.assertStudioAndAdminAccess(...)</code>. In production profiles where <code>app.framework.studio.enabled=false</code>, ejection requests immediately reject with HTTP <code>401 Unauthorized</code>.
      </Callout>
    </article>
  );
};
