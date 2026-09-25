package config

import (
	"fmt"
	"os"
	"strconv"
)

type envKey string

const (
	PORT              envKey = "PORT"
	JWTAlgo           envKey = "JWT_ALGO"
	JWTSecret         envKey = "JWT_SECRET"
	JWTExpirationMins envKey = "JWT_EXPIRATION_MINS"
)

func checkEnvConfiguration() {
	if PORT.IsEmpty() {
		PORT.setValue("3000")
	}
	if JWTAlgo.IsEmpty() {
		JWTAlgo.setValue("HS256")
	}
	if JWTSecret.IsEmpty() {
		panic("jwt secret not found in environment")
	}
}

func (key envKey) setValue(value string) {
	os.Setenv(string(key), value)
}

func (key envKey) GetValue() string {
	return os.Getenv(string(key))
}

func (key envKey) GetValueInt() int {
	value, err := strconv.Atoi(os.Getenv(string(key)))
	if err != nil {
		panic(fmt.Sprintf("error parsing %s of type string to int", key))
	}
	return value
}

func (key envKey) IsEmpty() bool {
	found := os.Getenv(string(key))
	if found == "" {
		return true
	}
	return false
}
