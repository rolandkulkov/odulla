package api

import (
	"docker-deployer/api/auth"
	"docker-deployer/api/deploy"

	"github.com/go-chi/chi/v5"
)

func Routes() *chi.Mux {
	r := chi.NewRouter()
	r.Group(func(r chi.Router) {
		r.Mount("/deploy", deploy.AddRoutes())
	})
	r.Route("/login", func(r chi.Router) {
		r.Post("/", auth.Login)
	})
	r.Route("/signup", func(r chi.Router) {
		r.Post("/", auth.Register)
	})
	return r
}
