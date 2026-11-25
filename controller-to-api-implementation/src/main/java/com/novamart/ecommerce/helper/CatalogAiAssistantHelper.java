package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.exception.InvalidIntegrationInputException;
import io.github.natswarchuan.common.dto.AiQueryExecutionResultDto;
import io.github.natswarchuan.common.dto.AiQueryRequestDto;
import io.github.natswarchuan.module.ai.helper.AiNaturalLanguageQueryParserHelper;
import io.github.natswarchuan.module.ai.helper.DynamicEntityAiMetadataProviderHelper;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Spring AI storefront catalog helper using ObjectProvider-deferred injection of framework beans.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class CatalogAiAssistantHelper {

  private final ObjectProvider<DynamicEntityAiMetadataProviderHelper> aiMetadataProvider;
  private final ObjectProvider<AiNaturalLanguageQueryParserHelper> nlQueryParserProvider;

  /**
   * Generates the LLM system prompt schema context for StorefrontProduct.
   *
   * @return system prompt string describing StorefrontProduct fields and operators
   */
  public String generateProductCatalogSystemPrompt() {
    log.info(NovaLogConstant.START_AI_SYSTEM_PROMPT);
    final String prompt =
        aiMetadataProvider.getObject().generateSystemContextPrompt(StorefrontProduct.class);
    final int length = resolvePromptLength(prompt);
    log.info(NovaLogConstant.FINISH_AI_SYSTEM_PROMPT, length);
    return prompt;
  }

  /**
   * Executes a natural-language catalog query against StorefrontProduct via Spring-NWVMC AI engine.
   *
   * @param naturalLanguagePrompt natural-language search expression
   * @return AI query execution result containing interpreted filters and matched page
   */
  public AiQueryExecutionResultDto<StorefrontProduct> queryCatalogByNaturalLanguage(
      final String naturalLanguagePrompt) {
    validatePrompt(naturalLanguagePrompt);
    log.info(NovaLogConstant.START_AI_NL_QUERY, naturalLanguagePrompt);
    final AiQueryRequestDto request =
        AiQueryRequestDto.builder()
            .prompt(naturalLanguagePrompt)
            .page(NovaNumericConstant.INT_ZERO)
            .size(NovaNumericConstant.AI_QUERY_PAGE_SIZE)
            .sort(NovaFieldConstant.FIELD_RETAIL_PRICE)
            .dir(NovaFieldConstant.SORT_DIR_ASC)
            .build();
    final AiQueryExecutionResultDto<StorefrontProduct> result =
        nlQueryParserProvider.getObject().executeNaturalLanguageQuery(StorefrontProduct.class, request);
    log.info(NovaLogConstant.FINISH_AI_NL_QUERY, result.getInterpretedQuery());
    return result;
  }

  /**
   * Validates that a natural-language prompt is non-null and non-blank.
   *
   * @param prompt candidate user prompt
   */
  public void validatePrompt(final String prompt) {
    if (Objects.isNull(prompt)) {
      throw new InvalidIntegrationInputException(NovaErrorConstant.MSG_PROMPT_REQUIRED);
    }
    if (prompt.isBlank()) {
      throw new InvalidIntegrationInputException(NovaErrorConstant.MSG_PROMPT_REQUIRED);
    }
  }

  /**
   * Computes safe character length of a generated prompt string.
   *
   * @param prompt generated prompt
   * @return character length or zero when null
   */
  public int resolvePromptLength(final String prompt) {
    if (Objects.isNull(prompt)) {
      return NovaNumericConstant.INT_ZERO;
    }
    return prompt.length();
  }
}
