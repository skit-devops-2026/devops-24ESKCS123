# Every team fills in the commands for their own stack.
# The CI pipeline calls these targets, so the names must not change.
#
# Examples:
#   Node    install: npm ci          test: npm test        build: npm run build
#   Python  install: pip install -r requirements.txt
#                                    test: pytest          build: echo "no build step"
#   Java    install: ./mvnw -B dependency:go-offline
#                                    test: ./mvnw test     build: ./mvnw package

.PHONY: install test build run docker-build docker-up

install:
	npm ci
	cd frontend && npm ci
	cd backend && npm ci

test:
	node --test tests/validation.test.js
	node scripts/check-links.js

build:
	cd frontend && npm run build

run:
	docker compose up --build

docker-build:
	docker compose build

docker-up:
	docker compose up
