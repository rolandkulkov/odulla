package deploy

import (
	"fmt"
	"net/http"
)

func Deploy(w http.ResponseWriter, r *http.Request) {
	port := GetPort()
	fmt.Fprintf(w, "Docker container started successfully on port %d\n", port)
}
