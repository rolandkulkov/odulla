package deploy

import (
	"fmt"
	"net"
)


// TODO: maybe its better if separate the code, and can be used for check the 127.0.0.1 and the 0.0.0.0 separately
// and also the check port is able to check one port if needed. So the whole code has to be separated into 3 script.
func CheckPort(port int) bool {
	protocol := "tcp"
	conn, err := net.ListenTCP(protocol, &net.TCPAddr{IP: []byte{0, 0, 0, 0}, Port: port, Zone: ""})
	if err != nil {
		fmt.Println(err)
		return false
	}

	defer conn.Close()
	return true
}

func GetPort() int {
	// Find an open port to run the container on
	var port int
	for i := 8000; i < 8100; i++ {
		fmt.Println("Checking port", i)
		if CheckPort(i) {
			port = i
			break
		}
	}
	return port
}
