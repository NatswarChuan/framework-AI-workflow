package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Author entity demonstrating standard 1-N relationships, UUIDv7 primary keys,
 * Jakarta Bean Validation and unique constraints via {@link UniqueField}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_AUTHORS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_AUTHORS_PEN_NAME,
            columnList = DatabaseSchemaConstant.COL_PEN_NAME,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_AUTHORS_COUNTRY,
            columnList = DatabaseSchemaConstant.COL_COUNTRY
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Author extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_100, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_PEN_NAME,
      nullable = false,
      unique = true,
      length = ValidationConstant.LENGTH_100
  )
  private String penName;

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Email(message = ValidationConstant.MSG_EMAIL_INVALID)
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_EMAIL,
      nullable = false,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String email;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_80, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_COUNTRY,
      nullable = false,
      length = ValidationConstant.LENGTH_80
  )
  private String country;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(name = DatabaseSchemaConstant.COL_REPUTATION_SCORE, nullable = false)
  private Integer reputationScore;

  @Column(name = DatabaseSchemaConstant.COL_VERIFIED, nullable = false)
  private Boolean verified;
}
