# Frontend – Running Locally and with Docker

This guide explains how to run the frontend application either with **Bun** or inside a **Docker container**.

## Prerequisites

* [Bun](https://bun.sh/) installed (for local runs).
* [Docker](https://docs.docker.com/get-docker/) installed (for containerized runs).

---

## Option 1: Run Locally with Bun

From the `frontend` directory, run:

```bash
bun run lint
bun run build
```

Explanation:

* `bun run lint` → Runs the linter to check for errors and enforce code style.
* `bun run build` → Builds the frontend for production.

---

## Option 2: Run with Docker

### Step 1: Build the Docker Image

```bash
docker build -t frontend .
```

This will build the image from the `frontend` directory and tag it as `frontend`.

### Step 2: Run the Container

```bash
docker run --rm -p 3000:3000 frontend
```

Explanation:

* `--rm` → Automatically removes the container when it exits.
* `-p 3000:3000` → Maps port `3000` from the container to port `3000` on your machine.
* `frontend` → The name of the image built in Step 1.

---

## Step 3: Verify the Frontend is Running

Open your browser and visit:

```
http://localhost:3000
```