package main

import (
	"backend/internal/router"
	"log"
)

func main() {
	r := router.SetupRouter()
	if err := r.Run(":8000"); err != nil {
		log.Fatal("Failed to run server: ", err)
	}
}
