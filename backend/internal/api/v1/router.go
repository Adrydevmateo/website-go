package v1

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/go-chi/jwtauth/v5"

	"website.com/backend/config"
)

var tokenAuth *jwtauth.JWTAuth

func init() {
	fmt.Println("Init from v1")
	tokenAuth = jwtauth.New(config.JWTAlgo.GetValue(), []byte(config.JWTSecret.GetValue()), nil)
}

func Router() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	// TODO: finish this ip setup
	r.Use(middleware.ClientIPFromHeader("CF-Connecting-IP"))
	// TODO: create an env var to manage number of request
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
