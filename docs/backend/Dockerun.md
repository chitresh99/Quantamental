# Backend – Docker Setup

This guide explains how to build and run the backend using **Docker**.

## Prerequisites

* [Docker](https://docs.docker.com/get-docker/) installed on your machine.
* A valid **News API key**. You can get one from [NewsAPI](https://newsapi.org/).

## Step 1: Build the Docker Image

Run the following command from the project root:

```bash
docker build -t backend ./backend
```

This command:

* Builds the image from the `./backend` directory.
* Tags the image with the name `backend`.

## Step 2: Run the Backend Container

Start the container with your API key:

```bash
docker run -p 8000:8000 -e NEWS_API_KEY=your_api_key_here backend
```

Explanation:

* `-p 8000:8000` → Maps container port `8000` to your local machine’s port `8000`.
* `-e NEWS_API_KEY=your_api_key_here` → Passes your API key as an environment variable.
* `backend` → The name of the image built in Step 1.

## Step 3: Verify the Backend is Running

Open your browser or use `curl` to check:

```bash
curl http://localhost:8000
```