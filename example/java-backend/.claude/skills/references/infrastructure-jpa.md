# Infrastructure JPA / PostgreSQL

Spécificités pour la persistance avec Spring Data JPA et PostgreSQL.

## Dépendances Maven

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

## Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
  flyway:
    locations: classpath:db/migration
```

## Entité JPA

```java
@Entity
@Table(name = "commandes")
public class CommandeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCommande statut;

    // Getters, setters ou record pattern
}
```

## Repository

```java
// Interface dans le domain
public interface CommandeRepository {
    Optional<Commande> findById(UUID id);
    Commande save(Commande commande);
}

// Implémentation dans l'infrastructure
@Repository
public class CommandeJpaRepository implements CommandeRepository {

    private final CommandeJpaSpringRepository springRepository;
    private final CommandeMapper mapper;

    @Override
    public Optional<Commande> findById(UUID id) {
        return springRepository.findById(id).map(mapper::toDomain);
    }
}
```

## Tests avec Testcontainers

```java
@SpringBootTest
@Testcontainers
class CommandeJpaRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}
```
