package v1

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/go-chi/jwtauth/v5"

	"website.com/backend/config"
	"website.com/backend/internal/project"
	"website.com/backend/internal/util"

	auth "website.com/backend/internal/auth"
	constant "website.com/backend/internal/constant"
)

func rateLimitMiddlewareHandler(r *http.Request) (string, error) {
	return httprate.CanonicalizeIP(middleware.GetClientIP(r.Context())), nil
}

func welcomeHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: return more relevant information
	w.Write([]byte("Welcome to my website's REST API!"))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: create a good health endpoint
	w.Write([]byte("Health"))
}

func signInHandler(w http.ResponseWriter, r *http.Request) {
	body, bodyErr := util.GetRequestBody(r)
	if bodyErr != nil {
		w.Write([]byte(bodyErr.Error()))
		return
	}
	var signInData auth.SignIn
	jsonErr := util.ParseJSONEncodedData(body, &signInData)
	if jsonErr != nil {
		w.Write([]byte(jsonErr.Error()))
		return
	}
	_, validEmailError := util.ValidateEmail(signInData.Email, "@")
	if validEmailError != nil {
		w.Write([]byte(validEmailError.Error()))
		return
	}
	user, err := auth.SignInCase(signInData)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	// TODO: create a util for jwt generation
	claims := map[string]any{"Fullname": user.Fullname, "Email": user.Email, "Age": user.Age}
	jwtauth.SetExpiry(claims, config.GetJWTExpTime())
	_, tokenString, tokenErr := tokenAuth.Encode(claims)
	if tokenErr != nil {
		w.Write([]byte(constant.MsgErrorGeneratingJwt))
		return
	}
	w.Write([]byte(tokenString))
}

func signUpHandler(w http.ResponseWriter, r *http.Request) {
	body, bodyErr := util.GetRequestBody(r)
	if bodyErr != nil {
		w.Write([]byte(bodyErr.Error()))
		return
	}
	var signUpData auth.SignUp
	jsonErr := util.ParseJSONEncodedData(body, &signUpData)
	if jsonErr != nil {
		w.Write([]byte(jsonErr.Error()))
		return
	}
	_, validEmailError := util.ValidateEmail(signUpData.Email, "@")
	if validEmailError != nil {
		w.Write([]byte(validEmailError.Error()))
		return
	}
	newUser, errSignUpCase := auth.SignUpCase(signUpData)
	if errSignUpCase != nil {
		w.Write([]byte(errSignUpCase.Error()))
		return
	}
	claims := map[string]any{"Fullname": newUser.Fullname, "Email": newUser.Email, "Age": newUser.Age}
	_, tokenString, err := tokenAuth.Encode(claims)
	jwtauth.SetExpiry(claims, config.GetJWTExpTime())
	if err != nil {
		w.Write([]byte(constant.MsgErrorGeneratingJwt))
		return
	}
	w.Write([]byte(tokenString))
}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	projects, errProjects := project.ListProjectsCase()
	if errProjects != nil {
		w.Write([]byte(errProjects.Error()))
		return
	}
	j, err := json.Marshal(projects)
	if err != nil {
		w.Write([]byte(constant.MsgErrorParsingData))
		return
	}
	w.Write(j)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(404)
	w.Write([]byte("route does not exist"))
}

func methodNotAllowedHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(405)
	w.Write([]byte("method is not valid"))
}
