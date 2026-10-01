package util

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"website.com/backend/internal/constant"
)

func GetRequestBody(r *http.Request) ([]byte, error) {
	defer r.Body.Close()
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return body, errors.New(constant.MsgErrorReadingRequestBody)
	}
	return body, nil
}

func ParseJSONEncodedData(body []byte, data any) error {
	jsonErr := json.Unmarshal(body, &data)
	if jsonErr != nil {
		return errors.New(constant.MsgErrorParsingData)
	}
	return nil
}
