package main

// TODO: Add JWT or OAuth or both
import (
	"encoding/json"
	"fmt"
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

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.ClientIPFromHeader("CF-Connecting-IP"))
	r.Use(httprate.LimitBy(1, time.Minute, func(r *http.Request) (string, error) {
		return httprate.CanonicalizeIP(middleware.GetClientIP(r.Context())), nil
	}))
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	r.Get("/projects", func(w http.ResponseWriter, r *http.Request) {
		project := Project{Name: "Website", Banner: "Banner", LiveURL: "Live URL"}
		j, err := json.Marshal(project)
		if err != nil {
			w.Write([]byte("Error getting json"))
			return
		}
		fmt.Println("Got JSON")
		w.Write(j)
	})
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(404)
		w.Write([]byte("route does not exist"))
	})
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(405)
		w.Write([]byte("method is not valid"))
	})
	http.ListenAndServe(":3000", r)
}
