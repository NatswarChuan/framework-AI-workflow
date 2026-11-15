package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.DatabaseSchemaConstant;
import io.github.natswarchuan.common.constant.ValidationConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Tag taxonomy entity supporting {@code @ManyToMany} associations with {@link Customer}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Entity
@Table(
    name = DatabaseSchemaConstant.TABLE_TAGS,
    indexes = {
        @Index(
            name = DatabaseSchemaConstant.IDX_TAGS_CODE,
            columnList = DatabaseSchemaConstant.COL_CODE,
            unique = true
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
public class Tag extends BaseAuditEntity {

  @UniqueField
  @NotBlank(message = ValidationConstant.MSG_CODE_NOT_BLANK)
  @Size(max = ValidationConstant.MAX_CODE_LENGTH, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_CODE,
      nullable = false,
      unique = true,
      length = ValidationConstant.MAX_CODE_LENGTH
  )
  private String code;

  @NotBlank(message = ValidationConstant.MSG_NAME_NOT_BLANK)
  @Size(max = ValidationConstant.LENGTH_100, message = ValidationConstant.MSG_SIZE_EXCEEDED)
  @Column(
      name = DatabaseSchemaConstant.COL_LABEL,
      nullable = false,
      length = ValidationConstant.LENGTH_100
  )
  private String label;
}
