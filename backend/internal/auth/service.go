package auth

import (
	"errors"
	"regexp"

	constant "website.com/backend/internal/constant"
)

func SignInCase(signInData SignIn) (User, error) {
	var user User
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signInData.Email))
	if emailRegexError != nil {
		return user, errors.New(constant.MsgErrorMatchingRegex)
	}
	if !emailRegexMatch {
		return user, errors.New(constant.MsgErrorInvalidEmail)
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

func SignUpCase(signUpData SignUp) (User, error) {
	var newUserData User
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signUpData.Email))
	if emailRegexError != nil {
		return newUserData, errors.New(constant.MsgErrorMatchingRegex)
	}
	if !emailRegexMatch {
		return newUserData, errors.New(constant.MsgErrorInvalidEmail)
	}
	return newUserData, nil
}
