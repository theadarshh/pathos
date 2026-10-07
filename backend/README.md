# PathOS backend (V2.0 Foundation)

A Spring Boot **modular monolith** — not microservices — providing exactly
the persistence and authentication V2.0 needs: user accounts, JWT
authentication, and profile storage. Organized by Java package
(`auth`, `profile`, `user`, `shared`, `config`), all in one deployable.

## Stack

Java 21, Spring Boot 3.3.4 (Web, Data JPA, Security, Validation),
PostgreSQL 16, Flyway, JWT via `io.jsonwebtoken` (JJWT) — isolated behind
a `TokenService` interface so the concrete JWT implementation can later be
swapped for sessions or OAuth without touching `AuthService` or
`ProfileService`.

## Domain scope (V2.0 only)

Two entities: `User` (email, BCrypt password hash) and `Profile`
(`role`, `experience`, `skills`, `goal`, `complete` — the same fields V1's
profile object had). `Profile.skills` is stored as a JSON-text column via
a temporary `SkillListConverter` — **this is explicitly not the final
design**. The normalized, queryable skill-graph model is deferred to
V2.1/V2.2 and is not implemented here.

## API

| Method | Path                | Auth | Notes |
|--------|---------------------|------|-------|
| POST   | `/api/auth/register`| no   | 201, returns `{ token, userId, email }` |
| POST   | `/api/auth/login`    | no   | 200, returns `{ token, userId, email }` |
| GET    | `/api/profile`       | yes  | returns the caller's own profile |
| PUT    | `/api/profile`       | yes  | updates the caller's own profile |

Profile endpoints take the user id **only** from the verified JWT subject
(`SecurityContext` / `Authentication.getName()`) — there is no endpoint
shape that accepts a client-supplied user/profile id. Errors are a
uniform JSON shape (`timestamp`, `status`, `code`, `message`, `details`);
unhandled exceptions are logged server-side and never leak a stack trace
to the client.

## Local setup

### 1. PostgreSQL

```bash
sudo service postgresql start   # or your platform's equivalent
sudo -u postgres psql -c "CREATE ROLE pathos WITH LOGIN PASSWORD 'change-me-locally';"
sudo -u postgres psql -c "CREATE DATABASE pathos OWNER pathos;"
sudo -u postgres psql -c "CREATE DATABASE pathos_test OWNER pathos;"   # used by the integration tests
```

### 2. Environment variables

Copy `../.env.example` to `.env` (or export the variables some other way)
and fill in real local values — **never commit a real secret or
password**. Required variables:

| Variable | Purpose | Local-dev default (insecure, see `application.yml`) |
|---|---|---|
| `DB_URL` | JDBC URL | `jdbc:postgresql://localhost:5432/pathos` |
| `DB_USERNAME` | DB role | `pathos` |
| `DB_PASSWORD` | DB role password | `pathos` — **local-dev placeholder only, never a real credential** |
| `JWT_SECRET` | HMAC signing key, ≥32 bytes | an insecure fixed string — must be overridden outside local dev |
| `JWT_EXPIRATION_MINUTES` | token lifetime | `60` |
| `SERVER_PORT` | HTTP port | `8080` |
| `CORS_ALLOWED_ORIGINS` | comma-separated allowed origins | `http://localhost:5173` (never `*`) |

### 3. Migrations (Flyway)

Migrations live in `src/main/resources/db/migration/` and run
automatically on application startup (`spring.flyway.enabled: true`).
There is no separate CLI step — `./mvnw spring-boot:run` applies them.

### 4. Run

```bash
./mvnw spring-boot:run
```

### 5. Tests

```bash
./mvnw test
```

Covers: registration, BCrypt hashing, duplicate-email rejection
(409), login success/failure (401), unauthenticated profile access (401),
tampered-JWT rejection (401), profile get/update, **one user unable to
read or modify another user's profile**, and validation failures (400) —
see `src/test/java/com/pathos/auth/` and `.../profile/`.
`AuthFlowTest`/`ProfileFlowTest` run against a real local `pathos_test`
database (via Flyway `clean()`+`migrate()` in `@BeforeEach`), not mocks;
`SecurityComponentsTest` is pure unit tests with no Spring context.

## ⚠️ Known limitation in this development environment

This backend **could not be compiled, run, or have its tests executed**
in the sandbox this was built in: `mvn compile` fails resolving the
Spring Boot parent POM from Maven Central with an HTTP 403, caused by an
organizational egress policy that blocks that host from this environment
(confirmed via direct `curl` tests and the proxy's own status endpoint).
This is **not a code defect** — no workaround, mirror substitution, or
policy bypass was attempted, per explicit instruction.

As a partial, honestly-scoped substitute:
- The Flyway migration SQL (`V1__create_users_table.sql`,
  `V2__create_profiles_table.sql`) was applied directly via `psql` against
  a real local PostgreSQL database and the resulting schema (columns,
  types, defaults, primary/unique/foreign keys, check constraints) was
  inspected and confirmed correct. **This is a SQL-validity check only —
  it is not Flyway and not an application-driven migration.**
- All backend source and test code is written and internally consistent,
  but **has not been compiled or executed** anywhere in this process.

Do not treat anything backend-related as "passing" beyond what's stated
above — see the root README / final implementation report for the exact
VERIFIED / PARTIALLY VERIFIED / NOT VERIFIED — ENVIRONMENT BLOCKED
breakdown. In any normal environment with Maven Central access, the setup
steps above are expected to work as described.
