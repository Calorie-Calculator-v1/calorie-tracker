# Gainly frontend

Responsive React frontend styled after the supplied landing page and dashboard references. The existing Spring backend is unchanged.

## Run locally

```powershell
cd "C:\Users\ASUS\Desktop\DBMS Project\calorie-tracker-main\frontend"
npm install
npm run dev
```

Open http://localhost:5173. Run your configured Spring backend on port 8080. Vite forwards `/api` requests to that server and includes session cookies. For a different backend address, copy `.env.example` to `.env`, set `BACKEND_URL`, and restart Vite.

The supplied backend checkout has no application resources/configuration and no backend was listening on port 8080 during frontend verification. Use your existing database, email, and authentication configuration to start it; this frontend does not change or replace that configuration.

## Features and API connections

| Feature | Existing backend route |
| --- | --- |
| Registration | POST `/api/v1.0/register` with username, email, password |
| Sign in | POST `/api/v1.0/login` with email, password |
| Current profile/session | GET `/api/v1.0/me` |
| Sign out | POST `/api/v1.0/logout` |
| Food search | GET `/api/v1.0/foods/search?q=...` |
| Add a meal | POST `/api/v1.0/me/foodlog` with foodId, quantity, mealType, loggedDate |
| Diary by date | GET `/api/v1.0/me/foodlog?date=YYYY-MM-DD` |
| Dashboard totals | GET `/api/v1.0/me/foodlog/summary` |
| Weekly chart and reports | GET `/api/v1.0/me/foodlog/history` |
| Remove a meal | DELETE `/api/v1.0/me/foodlog/{id}` |

Registration uses the existing backend's email verification link; verify before signing in. Profile details are read-only because the backend has no profile update endpoint. Daily calorie/protein goals are explicitly browser-local and stored per account, since there is no goals endpoint. Meal quantities are serving multipliers, matching the backend calculation, not grams. The landing summary is labeled as an example; authenticated screens use server data.

## Build and checks

```powershell
npm run build
npm test
```

Browser tests use installed Google Chrome and start/stop their own Vite server. They cover desktop/mobile overflow, registration, sign-in, food search, meal logging, refreshed totals, diary deletion, reports, local goals, sign-out, and connection errors. Screenshots are written under `test-results/`. API responses are mocked from the Java controller/DTO contracts; these tests do not establish a live database connection.

For production, deploy `dist/` and forward `/api` to the backend on the same origin. Vite's proxy is development/preview configuration only. A separate backend origin can be specified using `VITE_API_BASE_URL` at build time only if the existing backend CORS and cookie policy already allow that frontend origin.
