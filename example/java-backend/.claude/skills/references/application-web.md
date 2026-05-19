# Application Web (WebMVC)

Spécificités pour les projets exposant une API REST avec Spring WebMVC.

## Structure application/

```
application/
└── rest/
    ├── <Resource>Controller.java   # @RestController
    ├── <Resource>Request.java      # record (validation @jakarta)
    └── <Resource>Response.java     # record
```

## Controller

```java
@RestController
@RequestMapping("/api/v1/commandes")
@Validated
public class CommandeController {

    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping("/{id}")
    public CommandeResponse getById(@PathVariable UUID id) {
        return commandeService.findById(id)
            .map(CommandeResponse::from)
            .orElseThrow(() -> new CommandeNotFoundException(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommandeResponse create(@RequestBody @Valid CommandeRequest request) {
        return CommandeResponse.from(commandeService.create(request.toDomain()));
    }
}
```

## Gestion des erreurs

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CommandeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail handleNotFound(CommandeNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        final var detail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        detail.setProperty("errors", ex.getBindingResult().getFieldErrors()
            .stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).toList());
        return detail;
    }
}
```

## Configuration actuator

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      show-details: always
```
