package config

import (
	"time"
)

const MsgErrorGeneratingJwt = "error generating jwt"

func GetJWTExpTime() time.Time {
	return time.Now().Add(time.Minute * time.Duration(JWTExpirationMins.GetValueInt()))
}
