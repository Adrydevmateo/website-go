package main

// TODO: Add JWT or OAuth or both
// TODO: return data encrypted
import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

type Project struct {
	Name    string
	Banner  string
	LiveURL string
}

func welcomeHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: return more relevant information
	w.Write([]byte("Welcome to my website's REST API!"))
}
func healthHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: create a good health endpoint
	w.Write([]byte("Health"))
}

func projectsHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: get projects from a list
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

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.ClientIPFromHeader("CF-Connecting-IP"))
	r.Use(httprate.LimitBy(10, time.Minute, func(r *http.Request) (string, error) {
		return httprate.CanonicalizeIP(middleware.GetClientIP(r.Context())), nil
	}))
	r.Get("/", welcomeHandler)
	r.Get("/health", healthHandler)
	r.Get("/projects", projectsHandler)
	r.NotFound(notFoundHandler)
	r.MethodNotAllowed(methodNotAllowedHandler)
	http.ListenAndServe(":3000", r)
}
