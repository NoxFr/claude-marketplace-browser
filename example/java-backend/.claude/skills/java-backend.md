# java-backend

Développement Java/Spring Boot selon les préconisations Additi (DDD hexagonal, Spring Boot 4, Java 25).

## Usage

Ce skill détecte automatiquement le type de projet (API Web ou Worker) et charge les spécificités correspondantes.

```
/java-backend <description de la tâche>
```

## Principes appliqués

- **Architecture hexagonale** : séparation stricte domain / application / infrastructure
- **DDD** : agrégats, value objects, domain events
- **Spring Boot 4** : configuration par convention, actuator, observability
- **Java 25** : records, sealed classes, pattern matching

## Structure de projet attendue

```
src/
  main/
    java/
      com.example/
        domain/          # Entités, value objects, ports
        application/     # Use cases, command handlers
        infrastructure/  # Adapters, repositories, config
  test/
    java/
      com.example/
        domain/          # Tests unitaires du domaine
        application/     # Tests d'intégration use cases
```

## Conventions

- Les ports sont des interfaces dans le domaine
- Les adapters implémentent les ports dans l'infrastructure
- Les use cases ne dépendent que du domaine
- Tests unitaires sans Spring context pour le domaine
