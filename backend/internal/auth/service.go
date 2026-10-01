package auth

import (
	"errors"

	"website.com/backend/internal/constant"
)

func SignInCase(signInData SignIn) (User, error) {
	var user User
	if signInData.Email != "test@gmail.com" {
		return user, errors.New(constant.MsgErrorUserEmailNotExist)
	}
	if signInData.Password != "123" {
		return user, errors.New(constant.MsgErrorPasswordIncorrect)
	}
	user = User{Fullname: "Adry Mateo Ramon", Email: signInData.Email, Age: 26}
	return user, nil
}

func SignUpCase(signUpData SignUp) (User, error) {
	var newUserData User
	return newUserData, nil
}
