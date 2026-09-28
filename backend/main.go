package main

// TODO: separate into files
// TODO: return data encrypted
import (
	"fmt"
	"net/http"

	"website.com/backend/config"
	httpModule "website.com/backend/internal/http"
)

func main() {
	http.ListenAndServe(fmt.Sprintf(":%s", config.PORT.GetValue()), httpModule.Router())
}
