package main
import (
	_ "github.com/wader/disable_sendfile_vbox_linux"
	"net/http"
	"log"
	"flag"
	"os"
)

func main() {
	bind := flag.String("bind", ":1313", "Web server bind address")

	//static assets
	var staticFileServer http.Handler
	if os.Getenv("DEV") == "true" {
		log.Print("Running in DEV mode")
		staticFileServer = http.FileServer(http.Dir("ui/static"))
	} else {
		//in production use embedded files
		staticFileServer = http.FileServer(FS(false))
	}
	http.Handle("/ui/", http.StripPrefix("/ui/", staticFileServer))
	log.Fatal(http.ListenAndServe(*bind, nil))
}
