package com.novamart.ecommerce.dto;

import com.novamart.ecommerce.entity.StorefrontProduct;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Public read-only storefront product card DTO intentionally omitting internal supplierCost.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PublicProductCardDto {

  private UUID id;
  private String sku;
  private String name;
  private String slug;
  private String categoryCode;
  private String brand;
  private BigDecimal retailPrice;
  private Boolean active;

  /**
   * Maps a StorefrontProduct entity to a public projection card DTO.
   *
   * @param entity source product entity
   * @return projected PublicProductCardDto, or null if entity is null
   */
  public static PublicProductCardDto fromEntity(final StorefrontProduct entity) {
    if (Objects.isNull(entity)) {
      return null;
    }
    return PublicProductCardDto.builder()
        .id(entity.getId())
        .sku(entity.getSku())
        .name(entity.getName())
        .slug(entity.getSlug())
        .categoryCode(entity.getCategoryCode())
        .brand(entity.getBrand())
        .retailPrice(entity.getRetailPrice())
        .active(entity.getActive())
        .build();
  }

  /**
   * Converts this public card DTO into a detached StorefrontProduct shell without supplierCost.
   *
   * @return detached StorefrontProduct entity
   */
  public StorefrontProduct toEntity() {
    return StorefrontProduct.builder()
        .id(id)
        .sku(sku)
        .name(name)
        .slug(slug)
        .categoryCode(categoryCode)
        .brand(brand)
        .retailPrice(retailPrice)
        .active(active)
        .build();
  }
}
