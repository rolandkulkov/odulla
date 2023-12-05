package auth

import (
	"errors"
	"net/http"
	"time"

	"docker-deployer/models"
	database "docker-deployer/repositories/gorm"

	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

var secretKey = []byte("secret")

func Register(w http.ResponseWriter, r *http.Request) {
	var userInput models.User
	if err := render.DecodeJSON(r.Body, &userInput); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid input"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userInput.Password), bcrypt.DefaultCost)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	user := models.User{Username: userInput.Username, Password: string(hashedPassword)}
	err = database.GlobalDB.Create(&user).Error
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	render.JSON(w, r, map[string]interface{}{"message": "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var userInput models.User
	if err := render.DecodeJSON(r.Body, &userInput); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid input"})
		return
	}

	var user models.User
	if err := database.GlobalDB.Where("username = ?", userInput.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]interface{}{"error": "Invalid credentials"})
			return
		}
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Database error"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password)); err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid credentials"})
		return
	}

	token, err := generateToken(user.ID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	render.JSON(w, r, map[string]interface{}{"token": token})
}

func generateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
