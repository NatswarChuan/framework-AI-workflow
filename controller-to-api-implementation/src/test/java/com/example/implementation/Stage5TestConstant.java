package com.example.implementation;

import io.github.natswarchuan.common.constant.CommonConstant;
import java.util.List;

/**
 * Constants supporting Stage 5 consumer integration verification across Escape Hatch overrides,
 * Zod/Typed Client codegen, Code Ejection, 20-language Studio bundles, and production lockdown.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-15
 */
public final class Stage5TestConstant {

  private Stage5TestConstant() {
    throw new UnsupportedOperationException(CommonConstant.MSG_UTILITY_CLASS);
  }

  /** Showcase Stage 2 Escape Hatch endpoint on TagController. */
  public static final String URL_TAG_ESCAPE_STATS = "/api/v1/tags/showcase/escape-hatch-stats";

  /** Stage 4C Zod Schema endpoint on ProductCatalogController. */
  public static final String URL_PRODUCT_ZOD = "/api/v1/product-catalogs/schema/zod";

  /** Stage 4C Typed Fetch Client endpoint on ProductCatalogController. */
  public static final String URL_PRODUCT_CLIENT = "/api/v1/product-catalogs/schema/client";

  /** Stage 2 Code Ejection endpoint for ProductCatalog. */
  public static final String URL_EJECT_PRODUCT = "/system/studio/eject?target=ProductCatalog";

  /** Dev token generator URL used for ADMIN Bearer setup and prod lockdown assertions. */
  public static final String URL_TOKEN_ADMIN = "/api/v1/auth/token?username=s5-admin&role=ROLE_ADMIN";

  /** Developer Studio base URL. */
  public static final String URL_STUDIO = "/system/studio";

  /** Developer Studio URL template with language parameter. */
  public static final String URL_STUDIO_LANG_TEMPLATE = "/system/studio?lang=";

  /** Production test environment secret property override for prod profile lock verification. */
  public static final String PROD_JWT_PROPERTY =
      "JWT_SECRET=Enterprise-Prod-HS512-Signing-Key-Must-Be-At-Least-32-Bytes-2026!";

  /** Production active profile identifier. */
  public static final String PROFILE_PROD = "prod";

  /** Version badge expected on rendered Developer Studio HTML. */
  public static final String EXPECTED_VERSION_BADGE = "v0.0.3";

  /** Expected 38-endpoint badge label in English Studio HTML. */
  public static final String EXPECTED_BADGE_COUNT = "38";

  /** JSON path data field name. */
  public static final String JSON_FIELD_DATA = "data";

  /** JSON path token field name. */
  public static final String JSON_FIELD_TOKEN = "token";

  /** Missing-key diagnostic empty marker in Dev Studio script/header. */
  public static final String DIAG_MISSING_PREFIX = "data-missing-keys=\"";

  /** All 20 ISO language tags supported by Spring-NWVMC Developer Studio. */
  public static final List<String> ALL_TWENTY_LANGUAGES =
      List.of(
          "en", "zh", "hi", "es", "fr", "ar", "bn", "pt", "ru", "ur", "id", "de", "ja", "vi",
          "ko", "tr", "it", "th", "fa", "pl");
}
