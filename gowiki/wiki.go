package main

import (
	"log"
	"net/http"
	"os"
	"regexp"
	"text/template"
)

type Page struct {
	Title string
	Body  []byte
}

func (p *Page) save() error {
	filename := p.Title + ".txt"
	return os.WriteFile("data/"+filename, p.Body, 0600)
}

// func getTitle(w http.ResponseWriter, r *http.Request) (string, error) {
// 	m := validPath.FindStringSubmatch(r.URL.Path)
// 	if m == nil {
// 		http.NotFound(w, r)
// 		return "", errors.New("invalid Page Title")
// 	}
// 	return m[2], nil // The title is the second subexpression

// }
var templates = template.Must(template.ParseFiles("template/edit.html", "template/view.html"))

func renderTemplate(w http.ResponseWriter, tmpl string, p *Page) {
	// t, err := template.ParseFiles(tmpl + ".html")
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// err = t.Execute(w, p)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// }
	// t.Execute(w, p)

	err := templates.ExecuteTemplate(w, tmpl+".html", p)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func loadPage(title string) (*Page, error) {
	filename := title + ".txt"
	body, err := os.ReadFile("data/" + filename)
	if err != nil {
		return nil, err
	}
	return &Page{Title: title, Body: body}, nil
}

var validPath = regexp.MustCompile("^/(edit|save|view)/([a-zA-Z0-9\\-]+)$")
var hyphenReg = regexp.MustCompile("\\-")

func makeHandler(fn func(http.ResponseWriter, *http.Request, string)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path)

		// Here we will extract the page title from the Request,
		// and call the provided handler 'fn'
		m := validPath.FindStringSubmatch(r.URL.Path)
		if m == nil {
			http.NotFound(w, r)
			return
		}
		var finalTitle = string(hyphenReg.ReplaceAll([]byte(m[2]), []byte("$1W")))
		log.Println(finalTitle)
		fn(w, r, finalTitle)
	}
}

func viewHandler(w http.ResponseWriter, r *http.Request, title string) {
	// title := r.URL.Path[len("/view/"):]
	p, err := loadPage(title)
	// // fmt.Fprintf(w, "<h1>%s</h1><div>%s</div>", p.Title, p.Body)

	// // t, _ := template.ParseFiles("view.html")
	// // t.Execute(w, p)

	if err != nil {
		http.Redirect(w, r, "/edit/"+title, http.StatusFound)
		return
	}

	renderTemplate(w, "view", p)

	// title, err := getTitle(w, r)
	// if err != nil {
	// 	return
	// }
	// p, err := loadPage(title)
	// if err != nil {
	// 	http.Redirect(w, r, "/edit/"+title, http.StatusFound)
	// 	return
	// }
	// renderTemplate(w, "view", p)
}

func editHandler(w http.ResponseWriter, r *http.Request, title string) {
	// title := r.URL.Path[len("/edit/"):]
	p, err := loadPage(title)
	if err != nil {
		p = &Page{Title: title}
	}
	// fmt.Fprintf(
	// 	w, "<h1>Editing %s</h1>"+
	// 		"<form action=\"/save/%s\" method=\"POST\">"+
	// 		"<textarea name=\"body\">%s</textarea><br>"+
	// 		"<input type=\"submit\" value=\"Save\">"+
	// 		"</form>",
	// 	p.Title, p.Title, p.Body,
	// )

	// t, _ := template.ParseFiles("edit.html")
	// t.Execute(w, p)

	renderTemplate(w, "edit", p)

	// title, err := getTitle(w, r)
	// if err != nil {
	// 	return
	// }
	// p, err := loadPage(title)
	// if err != nil {
	// 	p = &Page{Title: title}
	// }
	// renderTemplate(w, "edit", p)
}

func saveHandler(w http.ResponseWriter, r *http.Request, title string) {
	// title := r.URL.Path[len("/save/"):]
	body := r.FormValue("body")
	p := &Page{Title: title, Body: []byte(body)}
	err := p.save()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	http.Redirect(w, r, "/view/"+title, http.StatusFound)

	// title, err := getTitle(w, r)
	// if err != nil {
	// 	return
	// }
	// body := r.FormValue("body")
	// p := &Page{Title: title, Body: []byte(body)}
	// err = p.save()
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// http.Redirect(w, r, "/view/"+title, http.StatusFound)
}

func toFrontPage(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/view/front-page", http.StatusFound)
}

func main() {
	// p1 := &Page{Title: "TestPage", Body: []byte("This is a sample Page.")}
	// p1.save()
	// p2, _ := loadPage("TestPage")
	// fmt.Println(string(p2.Body))

	http.HandleFunc("/", toFrontPage)
	http.HandleFunc("/view/", makeHandler(viewHandler))
	http.HandleFunc("/edit/", makeHandler(editHandler))
	http.HandleFunc("/save/", makeHandler(saveHandler))
	log.Fatal(http.ListenAndServe(":8080", nil))
}
