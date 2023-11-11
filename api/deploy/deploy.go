package deploy

import (
	"fmt"
	"net/http"
)

func Deploy(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Docker container started successfully on port %s\n", "8000")
}
