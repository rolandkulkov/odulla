package api

import (
	"docker-deployer/api/deploy"

	"github.com/go-chi/chi/v5"
)

func Routes() *chi.Mux {
	r := chi.NewRouter()
	r.Group(func(r chi.Router) {
		r.Mount("/deploy", deploy.AddRoutes())
	})
	return r
}
