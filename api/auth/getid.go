package auth

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	)

func GetID(token string) (int, error) {
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("secret"), nil
	})
	if err != nil {
		fmt.Println(err)
		return 0, err
	}
	id := claims["user_id"].(float64)
	return int(id), nil
}