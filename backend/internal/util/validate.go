package util

import (
	"errors"
	"regexp"

	"website.com/backend/internal/constant"
)

func ValidateEmail(email string, pattern string) (bool, error) {
	emailRegexMatch, emailRegexError := regexp.Match(pattern, []byte(email))
	if emailRegexError != nil {
		return false, errors.New(constant.MsgErrorMatchingRegex)
	}
	if !emailRegexMatch {
		return false, errors.New(constant.MsgErrorInvalidEmail)
	}
	return true, nil
}
