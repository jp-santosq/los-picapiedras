package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"runtime"
)

func main() {
	switch runtime.GOOS {
	case "windows":
		fmt.Println("Windows BUUUU")

	case "darwin", "linux":
		fmt.Println("MacOs :p y o Linux")

		cmd := exec.Command("./run.sh")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Stdin = os.Stdin

		if err := cmd.Run(); err != nil {
			log.Fatal(err)
		}

	default:
		fmt.Printf("BRO QUE HACES USA ALGO NORMAL XD: %s\n", runtime.GOOS)
	}
}
