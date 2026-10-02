package v1

import (
	"net/http"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"

	"website.com/backend/internal/project"
	"website.com/backend/internal/util"

	auth "website.com/backend/internal/auth"
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
	_, validEmailErr := util.ValidateEmail(signInData.Email, "@")
	if validEmailErr != nil {
		w.Write([]byte(validEmailErr.Error()))
		return
	}
	user, err := auth.SignInCase(signInData)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	claims := map[string]any{"Fullname": user.Fullname, "Email": user.Email, "Age": user.Age}
	tokenString, jwtErr := util.GenerateJWT(claims, tokenAuth)
	if jwtErr != nil {
		w.Write([]byte(jwtErr.Error()))
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
	_, validEmailErr := util.ValidateEmail(signUpData.Email, "@")
	if validEmailErr != nil {
		w.Write([]byte(validEmailErr.Error()))
		return
	}
	newUser, errSignUpCase := auth.SignUpCase(signUpData)
	if errSignUpCase != nil {
		w.Write([]byte(errSignUpCase.Error()))
		return
	}
	claims := map[string]any{"Fullname": newUser.Fullname, "Email": newUser.Email, "Age": newUser.Age}
	tokenString, jwtErr := util.GenerateJWT(claims, tokenAuth)
	if jwtErr != nil {
		w.Write([]byte(jwtErr.Error()))
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
	j, jsonErr := util.GenerateJSON(projects)
	if jsonErr != nil {
		w.Write([]byte(jsonErr.Error()))
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
