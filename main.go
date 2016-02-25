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
	"github.com/lox/httpcache/httplog"
	"fmt"
)

const VERSION = "0.0.1"

func main() {

	bind := flag.String("bind", ":1313", "Web server bind address")
	debug := flag.Bool("verbose", false, "enable debug logging")
	ver := flag.Bool("v", false, "Print version and exit")
	flag.Parse()

	if *ver {
		fmt.Printf("%s", VERSION)
		os.Exit(0)
	}

	if *debug {
		log.Printf("DEBUG is enabled (%v)", *debug)
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
	mux.Handle("/", http.RedirectHandler("/ui/", http.StatusMovedPermanently))
	mux.Handle("/ui/", http.StripPrefix("/ui/", AddCacheHeaders(gziphandler.GzipHandler(staticFileServer))))

	//HTTP caching
	cacheMiddleware := httpcache.NewHandler(httpcache.NewMemoryCache(), mux)
	cacheMiddleware.Shared = true

	//HTTP logging
	loggingMiddleware := httplog.NewResponseLogger(cacheMiddleware)
	loggingMiddleware.DumpRequests = *debug
	loggingMiddleware.DumpResponses = *debug
	loggingMiddleware.DumpErrors = *debug

	for true {
		log.Printf("Listening on %s", *bind)
		err := http.ListenAndServe(*bind, loggingMiddleware)
		log.Printf("SERVER FAILED: %s", err.Error())
		time.Sleep(1 * time.Second) //retry in 1 second
	}
}

func AddCacheHeaders(next http.Handler) http.Handler {
	return &CacheHeaders{nextHandler: next}
}

type CacheHeaders struct {
	nextHandler http.Handler
}

func (c *CacheHeaders) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	rw.Header().Set("Cache-Control", "public, max-age=86400")
	c.nextHandler.ServeHTTP(rw, r)
}
