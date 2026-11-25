package com.novamart.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Entry point for the NovaMart Multi-Merchant E-Commerce platform powered by Spring-NWVMC.
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class NovaMartApplication {

  /**
   * Launches the Spring Boot application.
   *
   * @param args command-line arguments
   */
  public static void main(final String[] args) {
    SpringApplication.run(NovaMartApplication.class, args);
  }
}
