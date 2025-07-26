package main

import (
	"backend/internal/router"
	"log"
)

func main() {
	r := router.SetupRouter()
	log.Println("Starting server on :8000")
	if err := r.Run(":8000"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
