package config

import (
	"time"
)

func GetJWTExpTime() time.Time {
	return time.Now().Add(time.Minute * time.Duration(JWTExpirationMins.GetValueInt()))
}
