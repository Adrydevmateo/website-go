package config

import (
	"fmt"
	"os"
)

type config struct {
	JWTSecret string
}

var Shared *config

func loadConfig() {
	Shared = &config{
		JWTSecret: os.Getenv("JWT_SECRET"),
	}
	if Shared.JWTSecret == "" {
		panic("jwt secret not found in environment")
	}
}

func init() {
	fmt.Println("INIT FROM CONFIGURATION")
	loadConfig()
}
