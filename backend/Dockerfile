FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server ./cmd/server

FROM gcr.io/distroless/base
WORKDIR /app
COPY --from=builder /app/server /server

EXPOSE 8000

CMD ["/server"]
