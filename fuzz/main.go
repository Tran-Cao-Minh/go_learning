package main

import (
	"errors"
	"fmt"
	"unicode/utf8"
)

func main() {
	input := "The quick brown fox jumped over the lazy dog"
	rev, revErr := Reverse(input)
	doubleRev, doubleRevErr := Reverse(rev)

	fmt.Printf("original: %q\n", input)
	fmt.Printf("reversed: %q, err: %v\n", rev, revErr)
	fmt.Printf("reversed again: %q, err: %v\n", doubleRev, doubleRevErr)
}

func Reverse(s string) (string, error) {
	/// => BUG when reverse by byte:
	/// The entire seed corpus used strings in which
	/// every character was a single byte.
	/// However, characters such as 泃 can require
	/// several bytes. Thus, reversing the string
	/// byte-by-byte will invalidate multi-byte characters.
	// b := []byte(s)
	// for i, j := 0, len(b)-1; i < len(b)/2; i, j = i+1, j-1 {
	// 	b[i], b[j] = b[j], b[i]
	// }
	// return string(b)

	// solution: by rune and check error
	if !utf8.ValidString(s) {
		return s, errors.New("input is not valid UTF-8")
	}
	r := []rune(s)
	for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r), nil
}
