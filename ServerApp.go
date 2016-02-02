/*
TODO:
---> Listen and Handler
---> Parse and Load Html-files
---> FileServer?
---> mgo-Database?
---> regexp?

*/

package main

import (
	"fmt"
	"html/template"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", loadPage)
	http.ListenAndServe(":8080", nil)
}

func loadPage(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("static/index.html")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println("Got It")
	}
	tmp.Execute(w, nil)
}
