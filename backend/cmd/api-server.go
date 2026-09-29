package main

// TODO: separate into files
// TODO: make sure to handle logging
// TODO: return data encrypted
import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"website.com/backend/config"
	v1 "website.com/backend/internal/api/v1"
)

func main() {
	r := chi.NewRouter()
	r.Mount("/api/v1", v1.Router())
	http.ListenAndServe(fmt.Sprintf(":%s", config.PORT.GetValue()), r)
}
