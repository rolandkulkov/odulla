package deploy

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)


func Deploy(w http.ResponseWriter, r *http.Request) {
	data, err := GetData(r)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	
	id, err := StartDeploy(data) //TODO: finish the deployment
	if err != nil {
		fmt.Println(err)
		data.Error = err.Error()
	} else {
		data.ID = id
	}
	json, _ := json.Marshal(data)
	// just return the requested data with the port and the container id, if everything is ok. 
	// If not, return the error with the requested data.
	fmt.Fprintf(w, "%+v", bytes.NewBuffer(json)) 
}
