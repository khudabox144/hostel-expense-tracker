# Hostel Monthly Expense Tracker

A full-stack app for tracking shared hostel expenses among members — who bought what, how much, and how spending breaks down by month and category.

- **Backend:** Java 21+ (Spring Boot 3.3, Maven, Spring Data JPA)
- **Frontend:** Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **Database:** PostgreSQL

> Note: the request specified Java 25 — this project targets Java 21 (the current LTS) for guaranteed compatibility with Spring Boot 3.3. If you have JDK 25 installed, you can bump `java.version` in `backend/pom.xml`; Spring Boot 3.3 should still build fine on it.

---

## 1. Prerequisites

- JDK 21+
- Maven 3.9+ (or use the included wrapper if you generate one via `mvn -N wrapper:wrapper`)
- Node.js 18.18+ and npm
- PostgreSQL 14+ running locally

---

## 2. Database setup

Create the database (tables are auto-created by Hibernate on first run, categories are seeded automatically):

```bash
psql -U postgres -c "CREATE DATABASE hostel_expenses;"
```

By default the backend connects with:

```
url:      jdbc:postgresql://localhost:5432/hostel_expenses
username: postgres
password: postgres
```

Update `backend/src/main/resources/application.properties` if your local Postgres credentials differ.

---

> **If you hit a "variable X not initialized in the default constructor" compile error:** this means Lombok's annotation processor isn't running. The `pom.xml` already pins an explicit `annotationProcessorPaths` entry in `maven-compiler-plugin` to fix this — make sure you're using the latest `pom.xml` from this project, then run `mvn clean spring-boot:run`. If it still happens, your IDE may also need "Enable annotation processing" turned on separately (IntelliJ: Settings → Build, Execution, Deployment → Compiler → Annotation Processors).

> **If `mvn spring-boot:run` fails with `ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN`:** this is a [known Lombok bug on JDK 25](https://github.com/projectlombok/lombok/issues/3940) — full JDK 25 support only landed in **Lombok 1.18.40**, with a related Javadoc-parsing fix in **1.18.42**. The `pom.xml` pins `lombok.version` to `1.18.42`, which resolves it on JDK 25. If you're still on an older copy of this project, bump `<lombok.version>` in `backend/pom.xml` to `1.18.42` (or newer) and re-run `mvn clean spring-boot:run`.

## 3. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first boot, Hibernate creates the `members`, `categories`, and `expenses` tables, and `data.sql` seeds the five categories (Food, Utilities, Cleaning, Maintenance, Others).

### API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/members` | List all members |
| POST | `/api/members` | Create a member `{ name, joinDate }` |
| DELETE | `/api/members/{id}` | Delete a member (cascades their expenses) |
| GET | `/api/categories` | List all categories |
| GET | `/api/expenses?month=YYYY-MM&memberId=&categoryId=` | List expenses, optionally filtered |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET | `/api/expenses/summary?month=YYYY-MM` | Monthly summary: total, per-member, per-category |

---

## 4. Run the frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The app starts on **http://localhost:3000**. `.env.local` points the frontend at the backend:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

## 5. Using the app

1. Go to **Members** and add the people sharing the hostel.
2. Go to **Expenses** and log purchases — pick a member, category, item, amount, and date.
3. Check the **Dashboard** for the monthly total, average per person, top spender, most-bought category, a spending-by-member bar chart, and a category breakdown donut chart.
4. Use the month/member/category filters on the Expenses page to narrow things down, and edit or delete any entry inline.

---

## 6. Project structure

```
backend/
  Dockerfile
  src/main/java/com/hostel/expensetracker/
    controller/   REST endpoints (incl. HealthController for deploy health checks)
    service/      business logic (incl. summary aggregation)
    repository/   Spring Data JPA repositories
    model/        JPA entities
    dto/          request/response DTOs
    config/       CORS configuration (env-var driven)
    exception/    global exception handling
  src/main/resources/
    application.properties  (env-var driven for prod)
    data.sql       (category seed data)

frontend/
  src/app/         Dashboard, Expenses, Members pages (App Router)
  src/components/  Sidebar, tables, modal, charts, filters, ui/ primitives
  src/hooks/       useExpenses, useExpenseSummary, useMembers, useCategories
  src/lib/         api.ts (fetch wrapper), utils.ts (currency/date formatting)
  src/types/       shared TypeScript interfaces

render.yaml        Optional Render blueprint for the backend
```

---

## 8. Deploying to production (Supabase + Render + Vercel)

This repo is already set up for this stack:
- `backend/Dockerfile` — Render builds and runs the API from this
- `render.yaml` — optional one-click Render blueprint
- `application.properties` reads DB credentials, CORS origins, and port from env vars
- `CorsConfig` reads allowed origins from `APP_CORS_ALLOWED_ORIGINS`

Push this project to a GitHub (or GitLab) repo first — both Render and Vercel deploy from git.

### 8.1 Database — Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database → Connection string**.
3. **Important:** Supabase's *direct* connection (`db.<project-ref>.supabase.co:5432`) is IPv6-only unless you pay for the IPv4 add-on, and Render's network is IPv4. Use the **Session Pooler** connection instead — it's IPv4-compatible and works fine with a small Hikari pool like this app's. It looks like:
   ```
   Host:     aws-0-<region>.pooler.supabase.com
   Port:     5432
   Database: postgres
   User:     postgres.<project-ref>
   Password: <your database password>
   ```
4. From that, build the JDBC URL you'll paste into Render:
   ```
   jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require
   ```
5. You don't need to run any SQL manually — Hibernate creates `members`, `categories`, `expenses` on the app's first boot, and `data.sql` seeds the five categories automatically.

### 8.2 Backend — Render

1. In Render, click **New → Web Service**, connect your repo.
2. If Render detects `render.yaml`, it'll pre-fill the service — otherwise configure manually:
   - **Root Directory:** `backend`
   - **Runtime:** Docker (it will pick up `backend/Dockerfile` automatically)
   - **Health Check Path:** `/api/health`
   - **Instance Type:** Free is fine to start
3. Add these environment variables in the Render dashboard:
   | Key | Value |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | `postgres.<project-ref>` |
   | `SPRING_DATASOURCE_PASSWORD` | your Supabase database password |
   | `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:3000` for now — you'll update this to your Vercel URL in step 8.4 |
4. Deploy. Render assigns a URL like `https://hostel-expense-tracker-api.onrender.com`. Confirm it's live:
   ```bash
   curl https://hostel-expense-tracker-api.onrender.com/api/health
   # {"status":"UP"}
   ```
   > Free-tier Render services spin down when idle and take ~30–60s to wake on the next request — normal, not a bug.

### 8.3 Frontend — Vercel

1. In Vercel, click **Add New → Project**, import the same repo.
2. Set **Root Directory** to `frontend` (Vercel auto-detects Next.js).
3. Add an environment variable:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://hostel-expense-tracker-api.onrender.com/api` (your Render URL + `/api`) |
4. Deploy. Vercel gives you a URL like `https://your-app.vercel.app`.

### 8.4 Connect them: update CORS

Now that you have the real Vercel URL, go back to Render → your service → **Environment**, and update:
```
APP_CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```
(comma-separate multiple origins if you also want to allow `http://localhost:3000` for local testing against the prod API). Save — Render redeploys automatically. That's it, the full stack is live.

---

## 9. Notes & assumptions

- Currency is formatted as **BDT (৳)** — see `formatCurrency` in `frontend/src/lib/utils.ts` if you'd like to switch to INR or another locale.
- Charts are hand-rolled SVG (bar + donut) — no external charting library, per the spec.
- CORS origins are configurable via `APP_CORS_ALLOWED_ORIGINS` (comma-separated), read in `CorsConfig.java` — defaults to `http://localhost:3000` for local dev.
- Deleting a member cascades and removes their expenses (`ON DELETE CASCADE`), and the UI's confirmation dialog says so explicitly.
