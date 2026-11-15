package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
 * Article post entity with automatic URL slug synthesis via {@link AutoSlug},
 * uniqueness validation via {@link UniqueField}, and view count tracking.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_POSTS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_POSTS_SLUG,
            columnList = DatabaseSchemaConstant.COL_SLUG,
            unique = true
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_POSTS_AUTHOR_ID,
            columnList = DatabaseSchemaConstant.COL_AUTHOR_ID
        ),
        @Index(
            name = DatabaseSchemaConstant.IDX_POSTS_VIEW_COUNT,
            columnList = DatabaseSchemaConstant.COL_VIEW_COUNT
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Post extends BaseAuditEntity {

  @UniqueField
  @AutoSlug(sourceField = BusinessDomainConstant.FIELD_TITLE)
  @Size(max = ValidationConstant.MAX_NAME_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_SLUG,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_NAME_LENGTH
  )
  private String slug;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_250, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_TITLE,
      nullable = false,
      length = ValidationConstant.LENGTH_250
  )
  private String title;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_2000, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_CONTENT,
      nullable = false,
      length = ValidationConstant.LENGTH_2000
  )
  private String content;

  @PositiveOrZero(message = ValidationConstant.MSG_VALUE_POSITIVE_OR_ZERO)
  @Column(name = DatabaseSchemaConstant.COL_VIEW_COUNT, nullable = false)
  private Long viewCount;

  @Column(name = DatabaseSchemaConstant.COL_PUBLISHED, nullable = false)
  private Boolean published;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = DatabaseSchemaConstant.COL_AUTHOR_ID)
  private Author author;
}
