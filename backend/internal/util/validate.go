package util

import (
	"errors"
	"regexp"

	"website.com/backend/internal/constant"
)

func ValidateEmail(email string, pattern string) (bool, error) {
	emailRegexMatch, err := regexp.Match(pattern, []byte(email))
	if err != nil {
		return false, errors.New(constant.MsgErrorMatchingRegex)
	}
	if !emailRegexMatch {
		return false, errors.New(constant.MsgErrorInvalidEmail)
	}
	return true, nil
}
