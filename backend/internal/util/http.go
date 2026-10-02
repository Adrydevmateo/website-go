package util

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/go-chi/jwtauth/v5"
	"website.com/backend/config"
	"website.com/backend/internal/constant"
)

func GetRequestBody(r *http.Request) ([]byte, error) {
	defer r.Body.Close()
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return []byte{}, errors.New(constant.MsgErrorReadingRequestBody)
	}
	return body, nil
}

func GenerateJWT(claims map[string]any, tokenAuth *jwtauth.JWTAuth) (string, error) {
	jwtauth.SetExpiry(claims, config.GetJWTExpTime())
	_, tokenString, err := tokenAuth.Encode(claims)
	if err != nil {
		return "", errors.New(constant.MsgErrorGeneratingJwt)
	}
	return tokenString, nil
}

func GenerateJSON(data any) ([]byte, error) {
	j, err := json.Marshal(data)
	if err != nil {
		return []byte{}, errors.New(constant.MsgErrorParsingData)
	}
	return j, nil
}

func ParseJSONEncodedData(body []byte, data any) error {
	err := json.Unmarshal(body, &data)
	if err != nil {
		return errors.New(constant.MsgErrorParsingData)
	}
	return nil
}
