package com.example.implementation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

/**
 * Data transfer object representing incoming transaction request or SIM-swap verification event.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Jacksonized
@ToString
public class SimSwapFraudEvaluationRequestDto implements Serializable {
@JsonProperty("accountId")
  private String accountId;

  @JsonProperty("transactionAmount")
  private Double transactionAmount;

  @JsonProperty("action")
  private String action;

  @JsonProperty("verificationToken")
  private String verificationToken;

  @JsonProperty("hoursSinceSimSwap")
  private Double hoursSinceSimSwap;
}

