package v1

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/go-chi/jwtauth/v5"

	"website.com/backend/config"
	"website.com/backend/internal"
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
	defer r.Body.Close()
	body, readErr := io.ReadAll(r.Body)
	if readErr != nil {
		// TODO: move this to constants
		w.Write([]byte(config.MsgErrorReadingRequestBody))
		return
	}
	var signInData auth.SignIn
	jsonErr := json.Unmarshal(body, &signInData)
	if jsonErr != nil {
		w.Write([]byte(internal.MsgErrorParsingData))
		return
	}
	user, err := auth.SignInCase(signInData)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
	claims := map[string]any{"Fullname": user.Fullname, "Email": user.Email, "Age": user.Age}
	jwtauth.SetExpiry(claims, config.GetJWTExpTime())
	_, tokenString, tokenErr := tokenAuth.Encode(claims)
	if tokenErr != nil {
		w.Write([]byte(config.MsgErrorGeneratingJwt))
		return
	}
	w.Write([]byte(tokenString))
}

func signUpHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	body, readErr := io.ReadAll(r.Body)
	if readErr != nil {
		w.Write([]byte(config.MsgErrorReadingRequestBody))
		return
	}
	var signUpData auth.SignUp
	jsonErr := json.Unmarshal(body, &signUpData)
	if jsonErr != nil {
		w.Write([]byte(internal.MsgErrorParsingData))
		return
	}
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signUpData.Email))
	if emailRegexError != nil {
		w.Write([]byte(internal.MsgErrorMatchingRegex))
		return
	}
	if !emailRegexMatch {
		w.Write([]byte(internal.MsgErrorInvalidEmail))
		return
	}
	claims := map[string]any{"Fullname": signUpData.Fullname, "Email": signUpData.Email, "Age": signUpData.Age}
	_, tokenString, err := tokenAuth.Encode(claims)
	jwtauth.SetExpiry(claims, config.GetJWTExpTime())
	if err != nil {
		w.Write([]byte(config.MsgErrorGeneratingJwt))
		return
	}
	w.Write([]byte(tokenString))
}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: get projects from a list
	_, claims, _ := jwtauth.FromContext(r.Context())
	fmt.Println(claims)
	project := auth.Project{Name: "Website", Banner: "Banner", LiveURL: "Live URL"}
	j, err := json.Marshal(project)
	if err != nil {
		w.Write([]byte(internal.MsgErrorParsingData))
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
