package main

import (
	"fmt"
	"log"

	"example.com/greetings"
)

func main() {
	// fmt.Println(quote.Go())

	// Set properties of the predefined Logger, including
	// the log entry prefix and a flag to disable printing
	// the time, source file, and line number.
	log.SetPrefix("greetings: ")
	log.SetFlags(0)

	// A slice of names
	names := []string{"Cao Minh", "Si Nam", "Tuan Anh"}

	// Request a greeting message.
	// message, err := greetings.Hello("")
	// message, err := greetings.Hello("Tran Cao Minh")
	message, err := greetings.Hellos(names)
	// If an error was returned, print it to the console and
	// exit the program.
	if err != nil {
		log.Fatal(err)
	}

	// If no error was returned, print the returned message
	// to the console
	fmt.Println(message)
}
