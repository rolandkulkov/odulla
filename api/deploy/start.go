package deploy

import (
	"context"
	"fmt"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"

	"io"
	"os"
)

type ContainerConfig struct {
	ContainerConfig *container.Config
	HostConfig *container.HostConfig
	NetworkConfig *network.NetworkingConfig
	MountConfig *mount.Mount
}

type Client struct {
	client *client.Client
}

var cli Client

func init() {
	cl, err := client.NewClientWithOpts()
	if err != nil {
		panic(err)
	}

	cli = Client{
		client: cl,
	}
}


//TODO: after running the deploy, we need to monitoring the process of the deployment.
// with websocket or something like that.
// starting the deploy...
func StartDeploy(image Image) (string, error){
	imageExists := CheckImage(image.Name, image.Tag)
	if !imageExists {
		err := PullImage(image.Name, image.Tag)
		if err != nil {
			return "Something went wrong while pulling the image", err 
		}
	}
	containerID, err := StartContainer(image)
	if err != nil {
		return "Something went wrong while starting the container", err
	}

	return containerID, nil
}

// CheckImage check if the image with the given tag is exists
func CheckImage(image string, tag string) bool{
	var exist bool
	imageExists, _, err := cli.client.ImageInspectWithRaw(context.Background(), fmt.Sprintf("%s:%s", image, tag))
	if err != nil {
		exist = false
	}
	if imageExists.ID != ""{
		exist = true
	}
	return exist
}

// PullImage pull the image with the given tag
func PullImage(image string, tag string) error {
	out, err := cli.client.ImagePull(context.Background(), fmt.Sprintf("%s:%s", image, tag), types.ImagePullOptions{})
	if err != nil {
		return err
	}
	defer out.Close()
	io.Copy(os.Stdout, out)
	return nil
}

// StartContainer start the container with the given image
func StartContainer(image Image) (string, error){
	port := nat.Port(fmt.Sprintf("%v/tcp", image.Config["inside_port"]))
	var env []string
	for _, v := range image.Config["env"].([]interface{}) {
		env = append(env, fmt.Sprintf("%v", v))
	
	}
	containerConfig := &container.Config{
		Image: fmt.Sprintf("%s:%s", image.Name, image.Tag),
		ExposedPorts: nat.PortSet{
			port: struct{}{},
		},
		Env: env,
	}

	hostconfig := &container.HostConfig{
		PortBindings: nat.PortMap{
		port: []nat.PortBinding{
			{
				HostIP: "0.0.0.0",
				HostPort: fmt.Sprintf("%v", image.Port),
			},
		 },
	  },
   }

	resp, err := cli.client.ContainerCreate(context.Background(), containerConfig, hostconfig, nil, nil, "")
	if err != nil {
		return "", err
	}

	if err := cli.client.ContainerStart(context.Background(), resp.ID, types.ContainerStartOptions{}); err != nil {
		return "", err
	}

	return resp.ID, nil
}