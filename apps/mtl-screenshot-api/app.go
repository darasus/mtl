package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/chromedp/chromedp"
)

func screenshotHandler(w http.ResponseWriter, r *http.Request) {
	var postId = r.URL.Query().Get("id")
	var url = os.Getenv("BASE_URL") + "/p/" + postId + "/preview"
	var fileBytes = Screenshot(url, 1200, 627)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Write(fileBytes)
	return
}

func thumbnailHandler(w http.ResponseWriter, r *http.Request) {
	var postId = r.URL.Query().Get("id")
	var url = os.Getenv("BASE_URL") + "/p/" + postId + "/thumbnail"
	var fileBytes = Screenshot(url, 1200, 627)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Write(fileBytes)
	return
}

func Screenshot(urlstr string, w int64, h int64) []byte {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()
	var buf []byte
	if err := chromedp.Run(ctx, fullScreenshot(urlstr, w, h, &buf)); err != nil {
		log.Fatal(err)
	}
	return buf
}

func fullScreenshot(urlstr string, w int64, h int64, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.EmulateViewport(w, h, chromedp.EmulateScale(2)),
		chromedp.WaitReady(`img[alt="Avatar"]`),
		chromedp.Sleep(1 * time.Second),
		chromedp.FullScreenshot(res, 100),
	}
}

func sayHi(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is MTL Screenshot API\n")
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}

	http.HandleFunc("/api/screenshot", screenshotHandler)
	http.HandleFunc("/api/thumbnail", thumbnailHandler)
	http.HandleFunc("/", sayHi)
	log.Println("listening on", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
