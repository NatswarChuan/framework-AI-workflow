# Contributing to Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc`)

Thank you for contributing to **Spring-NWVMC**. Every pull request must preserve the zero-compile-time-Spring-coupling guarantee in the framework core and pass the automated verification gates.

## Local Development Prerequisites

- **Java Development Kit**: OpenJDK 21 (LTS) enforced via `maven-enforcer-plugin`
- **Maven**: 3.9+
- **Node.js**: 20+ (required when updating `docs/` or `controller-to-api-ui/`)

## Architectural Rules for Framework Contributors

1. **Pure Java Core Constraint**: Modules under `io.github.natswarchuan.core.helper`, `io.github.natswarchuan.module.*`, and bridge classes must not introduce compile-time `import org.springframework.*` dependencies outside permitted `config/` and `autoconfigure/` packages.
2. **Code Structure & Style**:
   - Follow [Google Java Style](https://google.github.io/styleguide/javaguide.html).
   - Keep methods `<= 40` lines, classes `<= 300` lines, and parameters `<= 3`.
   - Use top-level Java classes only (no inner, nested, or anonymous classes, `enum`, or `record` declarations).
   - Align filenames and packages strictly (`*Util` -> `util/`, `*Helper` -> `helper/`, `*Constant` -> `constant/`).
   - Place all literal strings and numbers inside `*Constant` classes.
3. **20-Language Studio Parity**: Any change adding or modifying `studio.*` UI message keys in `DevStudioI18nConstant` must update `messages.properties` and all 20 `messages_{lang}.properties` bundles in `controller-to-api-framework/src/main/resources/i18n/`.

## Verification Before Opening a Pull Request

```bash
# 1. Build and run framework unit & integration tests
mvn clean install -f controller-to-api-framework/pom.xml

# 2. Verify reference consumer integration tests
mvn clean verify -f controller-to-api-implementation/pom.xml

# 3. Run Apache JMeter stress test (0.0% error rate required)
mvn jmeter:jmeter jmeter:results -f controller-to-api-implementation/pom.xml

# 4. Build documentation site
npm --prefix docs run build
```
