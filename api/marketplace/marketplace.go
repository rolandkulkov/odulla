package marketplace

import (
	"net/http"

	"docker-deployer/models"
	database "docker-deployer/repositories/gorm"

	"github.com/go-chi/render"
)

func Create(w http.ResponseWriter, r *http.Request) {
	var appInput models.App
	if err := render.DecodeJSON(r.Body, &appInput); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid input"})
		return
	}

	err := database.GlobalDB.Create(&appInput).Error
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	render.JSON(w, r, map[string]interface{}{"message": "App created successfully"})
}

func ReadAll(w http.ResponseWriter, r *http.Request) {
	var existingApps []models.App
	if err := database.GlobalDB.Find(&existingApps).Error; err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	render.JSON(w, r, existingApps)
}
