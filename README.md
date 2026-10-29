# TrustLens

> Replace every angle-bracket placeholder below. The hygiene check in CI will
> fail until you do.

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS123 | EKANSH AGNIHOTRI | CodeMaster11000 |

## About

This will be a fullstack application which will detect recruitment scam posts through the provided job email / recruitment post by analyzing the content, finding specific -keywords,tone,requirements and company info.

## Tech stack

- Frontend: React/Vite (legacy HTML/CSS/JavaScript frontend retained during migration)
- Backend: Node.js
- Database: MongoDB (local or MongoDB Atlas)

## Running locally

```bash
make install
make run
```

### Backend environment setup (required for auth and CRUD APIs)

1. Copy [backend/.env.example](./backend/.env.example) to `backend/.env`.
2. For a local MongoDB installation, use:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/trustlens
   ```

   For MongoDB Atlas, replace it with your Atlas connection string.
3. Set a strong `JWT_SECRET`.

The backend also reads `backend/atlas-credentials.env` if present (local only).
Never commit real credentials.

### Frontend API configuration

The React frontend calls the backend through `/api` by default. Vite proxies
that path to `http://localhost:3000` during local development. The frontend
stores JWT sessions in browser storage and uses the selected login preference:
**Remember me** uses persistent storage, while an unchecked preference uses
session storage.

For Docker Compose, the frontend image is built with
`http://localhost:3000/api`, which matches the published backend port. For a
hosted deployment, set the Vite build variable to the public backend URL:

```bash
VITE_API_URL=https://your-backend.example.com/api npm run build
```

Signup and login now create real backend sessions, authenticated users are
redirected to the dashboard, and dashboard access redirects unauthenticated
visitors to the login page. Use the dashboard's **Log out** action to clear
the current session.

### Local MongoDB on Linux

The application expects MongoDB to be running on port `27017`. Verify it with:

```bash
sudo systemctl enable --now mongod
mongosh --quiet --eval 'db.adminCommand({ ping: 1 })'
```

The default Compose setup uses Linux host networking for the backend so it can
reach MongoDB listening on `127.0.0.1`. This is intended for local Linux
development; use a containerized MongoDB service or platform-specific
networking on non-Linux systems.

## Containerization

The React frontend and the minimal Node backend can be run together with Docker
Compose:

```bash
make docker-build
make docker-up
```

The React frontend is available at `http://localhost:8080` and the backend
health endpoint is available at `http://localhost:3000/health`. The legacy
frontend under `frontend/pages` remains separate and is not migrated or
containerized yet.

## Kubernetes

Kubernetes manifests for the React frontend and Node backend are in
[`k8s/`](./k8s/). Apply them to a cluster with:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

The frontend is exposed through NodePort `30080`. The backend remains an
internal ClusterIP service on port `3000`.

## Live URL

Live URL: https://trustlens-p5sv.onrender.com/

The deployment record is committed at
[`docs/deployment-screenshot.png`](./docs/deployment-screenshot.png).

## Health endpoint

`GET /health` returns a JSON readiness payload:

```json
{ "status": "ok" }
```

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/scans`
- `GET /api/scans`
- `GET /api/scans/:id`
- `PATCH /api/scans/:id`
- `DELETE /api/scans/:id`

The authenticated frontend also provides:

- `/dashboard` for searchable, filterable scan history and pinned reports.
- `/scans/:id` for a full saved report, including the original submitted text,
  flags, recommendations, and pin controls.
- `/settings` for updating the user's name, primary goal, and alert preference.

## Monitoring

Prometheus scrape settings are in
[`monitoring/prometheus.yml`](./monitoring/prometheus.yml), and the Grafana
dashboard definition is in
[`monitoring/grafana-dashboard.json`](./monitoring/grafana-dashboard.json).
