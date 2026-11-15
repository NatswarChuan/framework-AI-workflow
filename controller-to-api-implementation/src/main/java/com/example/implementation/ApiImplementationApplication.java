package com.example.implementation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Enterprise verification application showcasing the zero-boilerplate Controller-To-API framework.
 *
 * <p>Consumes {@code controller-to-api-framework-0.0.1.jar} declaring only {@code controller/}
 * and {@code entity/} packages across standard enterprise production scenarios.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootApplication
public class ApiImplementationApplication {

  /**
   * Main entrypoint bootstrapping the Spring Boot application container.
   *
   * @param args command-line arguments
   */
  public static void main(final String[] args) {
    SpringApplication.run(ApiImplementationApplication.class, args);
  }
}

