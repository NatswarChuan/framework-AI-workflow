import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE5_CONTENT } from '../data/pages/stage5Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const SECURITY_FLOW = `flowchart TD
  Req["HTTP Request"] --> Filter["TraceIdFilter + SecurityFilterChainBridge"]
  Filter --> Surface{"Studio / Eject / Metrics?"}
  Surface -->|Production Profile| Denied["404 Not Found or 401/403"]
  Surface -->|Dev Profile / ROLE_ADMIN| StudioOK["Allow Dev Studio + CORS Preflight"]
  Filter --> DB["Dynamic DB RBAC + @EntitySecurity\nStrict Precedence: DENY > ALLOW"]
  DB -->|Denied| Unwrap["ExceptionCauseUnwrapperUtil\nApiResponse 403"]
  DB -->|Granted| RLS["Row-Level Predicate\nownerField + tenantField"]
  RLS --> Mask["@FieldSecurity / @PermissionFieldMask\nMasking or Nullification"]`;

export const SecurityRbacPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="security-rbac"
        currentLang={currentLang}
      />

      <h2 id="security-decision" className="section-heading">
        {pickText(STAGE5_CONTENT.srH2Decision, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE5_CONTENT.srGoalBody} currentLang={currentLang} />
      </p>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE5_CONTENT.srDecThNeed, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.srDecThUse, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.srDecThNote, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><RichDocText text={STAGE5_CONTENT.srDecRow1Need} currentLang={currentLang} /></td>
              <td><code>@EntitySecurity</code></td>
              <td><code>readRoles</code>, <code>writeRoles</code>, <code>deleteRoles</code>, <code>ownerField</code></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE5_CONTENT.srDecRow2Need} currentLang={currentLang} /></td>
              <td><code>@FieldSecurity</code></td>
              <td><code>viewRoles</code>, <code>maskPattern</code>, <code>nullifyInsteadOfMask</code></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE5_CONTENT.srDecRow3Need} currentLang={currentLang} /></td>
              <td><code>@MultiTenant</code></td>
              <td><code>tenantField</code>, <code>bypassTenantRoles</code></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE5_CONTENT.srDecRow4Need} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE5_CONTENT.srDecRow4Use} currentLang={currentLang} /></td>
              <td><code>@SecurityRoleEntity</code>, <code>@SecurityPermissionEntity</code>, <code>@SecurityPolicyEntity</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="security-impl" className="section-heading">
        {pickText(STAGE5_CONTENT.srH2Impl, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'entity-rbac',
            label: pickText(STAGE5_CONTENT.srTabEntity, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/ProductCatalog.java',
            highlightLines: [12, 13, 14, 15, 25, 26, 27],
            code: `package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import jakarta.persistence.Entity;
import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN})
@Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  private String skuCode;
  private String productName;
  private BigDecimal retailPrice;

  // Nullified automatically whenever caller lacks ROLE_ADMIN or ROLE_SUPER_ADMIN
  @FieldSecurity(
      viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
      nullifyInsteadOfMask = true)
  private BigDecimal costPrice;
}`,
          },
          {
            id: 'db-rbac-entities',
            label: pickText(STAGE5_CONTENT.srTabDbEntities, currentLang),
            language: 'java',
            fileName: 'entity/AppSecurityRole.java + AppSecurityPermission.java + AppSecurityUserRole.java + AppSecurityPolicy.java',
            highlightLines: [2, 11, 21, 30],
            code: `// File 1: entity/AppSecurityRole.java
@Entity @SecurityRoleEntity @Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class AppSecurityRole extends BaseAuditEntity {
  @RoleCode private String code;
  @RoleName private String displayName;
  @RolePermissions private Set<String> permissions; // Invalidates cache via DatabaseRbacCacheInvalidationListener
}

// File 2: entity/AppSecurityPermission.java
@Entity @SecurityPermissionEntity @Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class AppSecurityPermission extends BaseAuditEntity {
  @PermissionCode private String code;
  @PermissionResource private String resource;
  @PermissionAction private String action;
  @PermissionFieldMask private String maskPattern;
}

// File 3: entity/AppSecurityUserRole.java
@Entity @SecurityUserRoleEntity @Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class AppSecurityUserRole extends BaseAuditEntity {
  @UserRoleSubject private String subject;
  @UserRoleCode private String roleCode;
  @UserRoleTenantId private String tenantId;
}

// File 4: entity/AppSecurityPolicy.java
@Entity @SecurityPolicyEntity @Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class AppSecurityPolicy extends BaseAuditEntity {
  @PolicyResource private String resource;
  @PolicyAction private String action;
  @PolicyAllowedRoles private Set<String> allowedRoles;
  @PolicyEffect private String effect; // Strict precedence: DENY overrides ALLOW
}`,
          },
          {
            id: 'security-spi',
            label: pickText(STAGE5_CONTENT.srTabSpi, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/customizer/EnterpriseSecurityIdentityCustomizer.java',
            highlightLines: [12, 16, 25, 36],
            code: `package com.example.implementation.customizer;

import io.github.natswarchuan.customization.customizer.SecurityIdentityCustomizer;
import io.github.natswarchuan.customization.dto.SecurityAuthorizationRequestDto;
import io.github.natswarchuan.customization.dto.SecurityCustomizerContextDto;
import java.util.Set;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.stereotype.Component;

@Component
public final class EnterpriseSecurityIdentityCustomizer implements SecurityIdentityCustomizer {

  @Override
  public void customizeSecurityFilterChain(final Object http) throws Exception {
    if (http instanceof HttpSecurity httpSecurity) {
      httpSecurity.requestCache(RequestCacheConfigurer::disable);
    }
  }

  @Override
  public void customizeSecurityIdentityContext(final SecurityCustomizerContextDto contextDto) {
    // Enrich audience or diagnostics metadata before authorization hooks run
  }

  @Override
  public Set<String> augmentSubjectAuthorities(
      final String subject, final Set<String> currentAuthorities) {
    return currentAuthorities; // Merge corporate IAM / LDAP claims dynamically
  }

  @Override
  public Boolean evaluateCustomAuthorization(final SecurityAuthorizationRequestDto requestDto) {
    return null; // Return TRUE (allow), FALSE (deny), or null (abstain to RBAC/DB policies)
  }
}`,
          },
          {
            id: 'security-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '09-verify-field-security.sh',
            code: `# Mint both ADMIN and USER tokens in dev profile
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN" | jq -r '.data.token')
USER_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=buyer&role=ROLE_USER" | jq -r '.data.token')

# ADMIN sees internal costPrice (1890.00)
curl -s "http://localhost:8080/api/v1/product-catalogs/$PRODUCT_ID" -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.data | {skuCode, retailPrice, costPrice}'

# USER receives costPrice: null automatically via @FieldSecurity(nullifyInsteadOfMask = true)
curl -s "http://localhost:8080/api/v1/product-catalogs/$PRODUCT_ID" -H "Authorization: Bearer $USER_TOKEN" | jq '.data | {skuCode, retailPrice, costPrice}'`,
          },
        ]}
      />

      <h2 id="security-owasp" className="section-heading">
        {pickText(STAGE5_CONTENT.srH2Owasp, currentLang)}
      </h2>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">01</span>
          <h3>{pickText(STAGE5_CONTENT.srOwaspBolaTitle, currentLang)}</h3>
          <p><RichDocText text={STAGE5_CONTENT.srOwaspBolaBody} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">02</span>
          <h3>{pickText(STAGE5_CONTENT.srOwaspDosTitle, currentLang)}</h3>
          <p><RichDocText text={STAGE5_CONTENT.srOwaspDosBody} currentLang={currentLang} /></p>
        </div>
      </div>

      <h2 id="security-annotations" className="section-heading">
        {pickText(STAGE5_CONTENT.srH2Annotations, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE5_CONTENT.srThComp, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.srThAttrs, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.srThEnforce, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@EntitySecurity</code></td>
              <td><code>readRoles</code>, <code>writeRoles</code>, <code>deleteRoles</code>, <code>permissions</code>, <code>permitAll</code>, <code>ownerField</code>, <code>bypassOwnerRoles</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowEntitySec} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>@FieldSecurity</code></td>
              <td><code>viewRoles</code>, <code>maskPattern ("******")</code>, <code>nullifyInsteadOfMask (false)</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowFieldSec} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>@MultiTenant</code></td>
              <td><code>tenantField</code>, <code>bypassTenantRoles</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowTenant} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>@SecurityRoleEntity</code> · <code>@SecurityPermissionEntity</code> · <code>@SecurityUserRoleEntity</code> · <code>@SecurityPolicyEntity</code></td>
              <td><code>@RoleCode</code>, <code>@RolePermissions</code>, <code>@PermissionFieldMask</code>, <code>@UserRoleSubject</code>, <code>@PolicyEffect (DENY &gt; ALLOW)</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowDbRbac} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>SecurityFilterChainBridge</code></td>
              <td><code>SecurityIdentityCustomizer</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowChain} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>SurfaceAccessGuardrailUtil</code></td>
              <td><code>studio.enabled=false</code></td>
              <td><RichDocText text={STAGE5_CONTENT.srRowSurface} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <details className="under-the-hood-details">
        <summary className="under-the-hood-summary">
          <span>{pickText(STAGE5_CONTENT.srUnderHoodSummary, currentLang)}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="under-the-hood-body">
          <MermaidDiagram
            theme={theme}
            currentLang={currentLang}
            caption={pickText(STAGE5_CONTENT.srMermaidCaption, currentLang)}
            chart={SECURITY_FLOW}
          />
        </div>
      </details>

      <h2 id="security-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="security" currentLang={currentLang}>
        <RichDocText text={STAGE5_CONTENT.srCalloutSec} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
