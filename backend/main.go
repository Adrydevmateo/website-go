package main

// TODO: Add JWT
// TODO: return data encrypted
// TODO: Create sign up and sign in endpoints
import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

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

var tokenAuth *jwtauth.JWTAuth

func init() {
	tokenAuth = jwtauth.New("HS256", []byte("secret"), nil)
}

func main() {
	http.ListenAndServe(":3000", router())
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
	// TODO: return the sign in success message and a jwt
	defer r.Body.Close()
	body, readErr := io.ReadAll(r.Body)
	if readErr != nil {
		w.Write([]byte("failed getting the request body"))
		return
	}
	signInData := SignIn{}
	jsonErr := json.Unmarshal(body, &signInData)
	if jsonErr != nil {
		w.Write([]byte("error parsing data"))
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
	user := User{Fullname: "Test Mateo Ramon", Email: signInData.Email, Age: 26}
	fmt.Println(signInData)
	w.Write([]byte("Sign In"))
}

func signUpHandler(w http.ResponseWriter, r *http.Request) {
	user := User{Fullname: "Adry Mateo Ramon", Email: "adry@gmail.com"}
	_, tokenString, err := tokenAuth.Encode(map[string]any{"name": user.Fullname, "email": user.Email})
	if err != nil {
		w.Write([]byte("error generating the jwt"))
		return
	}
	w.Write([]byte(tokenString))
}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: get projects from a list
	_, claims, _ := jwtauth.FromContext(r.Context())
	fmt.Fprintf(w, "protected area. hi %v", claims["name"])
	project := Project{Name: "Website", Banner: "Banner", LiveURL: "Live URL"}
	j, err := json.Marshal(project)
	if err != nil {
		w.Write([]byte("Error getting json"))
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
