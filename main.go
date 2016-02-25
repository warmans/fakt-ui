package main
import (
	_ "github.com/wader/disable_sendfile_vbox_linux"
	"net/http"
	"log"
	"flag"
	"os"
	"github.com/NYTimes/gziphandler"
	"github.com/lox/httpcache"
	"time"
)

func main() {

	bind := flag.String("bind", ":1313", "Web server bind address")
	verbose := flag.String("verbose", "", "enable debug logging")
	flag.Parse()

	if *verbose != "" {
		log.Printf("VERBOSE is enabled (%s)", *verbose)
	}

	//static assets
	var staticFileServer http.Handler
	if os.Getenv("DEV") == "true" {
		log.Print("DEV is enabled")
		staticFileServer = http.FileServer(http.Dir("ui/static"))
	} else {
		//in production use embedded files
		staticFileServer = http.FileServer(FS(false))
	}

	//routing
	mux := http.NewServeMux()
	mux.Handle("/", http.RedirectHandler("/ui", http.StatusMovedPermanently))
	mux.Handle("/ui/", http.StripPrefix("/ui/", gziphandler.GzipHandler(staticFileServer)))

	//HTTP caching
	cacheMiddleware := httpcache.NewHandler(httpcache.NewMemoryCache(), mux)
	cacheMiddleware.Shared = true
	if *verbose == "vvvv" {
		httpcache.DebugLogging = true
	}

	for true {
		log.Printf("Listening on %s", *bind)
		err := http.ListenAndServe(*bind, cacheMiddleware)
		log.Printf("SERVER FAILED: %s", err.Error())
		time.Sleep(1 * time.Second) //retry in 1 second
	}
}
