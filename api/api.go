package api

import (
	"docker-deployer/api/auth"
	"docker-deployer/api/deploy"
	"docker-deployer/api/marketplace"

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
	r.Route("/marketplace", func(r chi.Router) {
		r.Get("/", marketplace.ReadAll)
		r.Delete("/app/{id}", marketplace.DeleteById)
		r.Post("/add", marketplace.Create)
	})
	return r
}
