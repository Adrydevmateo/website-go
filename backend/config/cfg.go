package config

import (
	"fmt"

	_ "github.com/joho/godotenv/autoload"
)

func init() {
	fmt.Println("INIT FROM CONFIGURATION")
	checkEnvConfiguration()
}
