package deploy

import (
	"github.com/go-chi/chi/v5"
)

func AddRoutes() chi.Router {
	r := chi.NewRouter()
	r.Route("/", func(r chi.Router) {
		//r.Use(apimiddleware.ValidateToken)
		r.Post("/", Deploy)
	})
	return r
}
