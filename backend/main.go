package main

// TODO: separate into files
// TODO: return data encrypted
import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"time"

	"website.com/backend/config"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/go-chi/jwtauth/v5"
)

type Project struct {
	Name    string
	Banner  string
	LiveURL string
}

type User struct {
	Fullname string
	Email    string
	Age      int
}

type SignIn struct {
	Email    string
	Password string
}

type SignUp struct {
	Fullname string
	Email    string
	Password string
	Age      int
}

const MsgErrorParsingData = "error parsing data"

const MsgErrorInvalidEmail = "invalid email format"
const MsgErrorMatchingRegex = "error matching regex"

var tokenAuth *jwtauth.JWTAuth
var user User

func init() {
	tokenAuth = jwtauth.New(config.JWTAlgo.GetValue(), []byte(config.JWTSecret.GetValue()), nil)
}

func main() {
	http.ListenAndServe(fmt.Sprintf(":%s", config.PORT.GetValue()), router())
}

func router() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.ClientIPFromHeader("CF-Connecting-IP"))
	r.Use(httprate.LimitBy(10, time.Minute, rateLimitMiddlewareHandler))

	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator(tokenAuth))

		r.Get("/projects", projectsHandler)
	})

	r.Group(func(r chi.Router) {
		r.Get("/", welcomeHandler)
		r.Get("/health", healthHandler)

		r.Post("/signin", signInHandler)
		r.Post("/signup", signUpHandler)
	})

	r.NotFound(notFoundHandler)
	r.MethodNotAllowed(methodNotAllowedHandler)

	return r
}

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
		w.Write([]byte(config.MsgErrorReadingRequestBody))
		return
	}
	var signInData SignIn
	jsonErr := json.Unmarshal(body, &signInData)
	if jsonErr != nil {
		w.Write([]byte(MsgErrorParsingData))
		return
	}
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signInData.Email))
	if emailRegexError != nil {
		w.Write([]byte(MsgErrorMatchingRegex))
		return
	}
	if !emailRegexMatch {
		w.Write([]byte(MsgErrorInvalidEmail))
		return
	}
	if signInData.Email != "test@gmail.com" {
		w.Write([]byte("this user email does not exist"))
		return
	}
	if signInData.Password != "123" {
		w.Write([]byte("this password is incorrect"))
		return
	}
	user = User{Fullname: "Adry Mateo Ramon", Email: signInData.Email, Age: 26}
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
	var signUpData SignUp
	jsonErr := json.Unmarshal(body, &signUpData)
	if jsonErr != nil {
		w.Write([]byte(MsgErrorParsingData))
		return
	}
	emailRegexMatch, emailRegexError := regexp.Match("@", []byte(signUpData.Email))
	if emailRegexError != nil {
		w.Write([]byte(MsgErrorMatchingRegex))
		return
	}
	if !emailRegexMatch {
		w.Write([]byte(MsgErrorInvalidEmail))
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
	project := Project{Name: "Website", Banner: "Banner", LiveURL: "Live URL"}
	j, err := json.Marshal(project)
	if err != nil {
		w.Write([]byte(MsgErrorParsingData))
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
