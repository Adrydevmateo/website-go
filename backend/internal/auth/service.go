package auth

import (
	"errors"
	"regexp"

	internal "website.com/backend/internal"
)

func SignInCase(signInData SignIn) (User, error) {
	var user User
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signInData.Email))
	if emailRegexError != nil {
		return user, errors.New(internal.MsgErrorMatchingRegex)
	}
	if !emailRegexMatch {
		return user, errors.New(internal.MsgErrorInvalidEmail)
	}
	if signInData.Email != "test@gmail.com" {
		// TODO: turn into a constant msg
		return user, errors.New("this user email does not exist")
	}
	if signInData.Password != "123" {
		// TODO: turn into a constant msg
		return user, errors.New("this password is incorrect")
	}
	user = User{Fullname: "Adry Mateo Ramon", Email: signInData.Email, Age: 26}
	return user, nil
}
