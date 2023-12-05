package deploy

import (
	"fmt"
	"encoding/json"
	"net/http"
)

type Image struct {
	Name string `json:"image"`
	Tag string `json:"tag"`
	Config map[string]interface{} `json:"config"`
	Port int `json:"port"`
	ID string `json:"id"`
	Token string `json:"token"`
	Error string `json:"error"`
}


func GetData(r *http.Request) (Image, error) {
	image := Image{}
	token := r.Header.Get("Authorization")
	err := json.NewDecoder(r.Body).Decode(&image)
	if err != nil {
		fmt.Println(err)
		return image, err
	}
	image.Token = token
	image.Port = GetPort()
	return image, nil
}

