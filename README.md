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
- Database: -

## Running locally

```bash
make install
make run
```

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

https://skit-devops-2026.github.io/devops-24ESKCS123/

The React frontend is deployed by
[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).
The deployment record is committed at
[`docs/deployment-screenshot.png`](./docs/deployment-screenshot.png).

## Health endpoint

`GET /health` returns the running commit SHA. See `Makefile` and the milestone
sheet for why this is required.

## Monitoring

Prometheus scrape settings are in
[`monitoring/prometheus.yml`](./monitoring/prometheus.yml), and the Grafana
dashboard definition is in
[`monitoring/grafana-dashboard.json`](./monitoring/grafana-dashboard.json).
