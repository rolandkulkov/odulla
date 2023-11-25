package auth

import (
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/gorm"
)

// User model
type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique"`
	Password string
}

var db *gorm.DB

var secretKey = []byte("secret13456")

func Register(w http.ResponseWriter, r *http.Request) {
	var userInput User
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

	user := User{Username: userInput.Username, Password: string(hashedPassword)}
	err = db.Create(&user).Error
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	render.JSON(w, r, map[string]interface{}{"message": "User registered successfully"})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var userInput User
	if err := render.DecodeJSON(r.Body, &userInput); err != nil {
		render.Status(r, http.StatusBadRequest)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid input"})
		return
	}

	// Step 1: Check if the user exists

	var user User
	if err := db.Where("username = ?", userInput.Username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]interface{}{"error": "Invalid credentials"})
			return
		}
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Database error"})
		return
	}

	// Step 2: Compare hashed password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userInput.Password)); err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, map[string]interface{}{"error": "Invalid credentials"})
		return
	}

	// Step 3: Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		render.Status(r, http.StatusInternalServerError)
		render.JSON(w, r, map[string]interface{}{"error": "Internal server error"})
		return
	}

	// Step 4: Send token in the response
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
