package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/chromedp/chromedp"
)

func handler(w http.ResponseWriter, r *http.Request) {
	var postId = r.URL.Query().Get("id")
	var url = "https://www.mytinylibrary.com/p/" + postId + "/preview"
	var fileBytes = Screenshot(url)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Write(fileBytes)
	return
}

func Screenshot(urlstr string) []byte {
	ctx, cancel := chromedp.NewContext(
		context.Background(),
		// chromedp.WithDebugf(log.Printf),
	)
	defer cancel()
	var buf []byte
	if err := chromedp.Run(ctx, fullScreenshot(urlstr, 100, &buf)); err != nil {
		log.Fatal(err)
	}
	return buf
}

func fullScreenshot(urlstr string, quality int, res *[]byte) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(urlstr),
		chromedp.EmulateViewport(1200, 630, chromedp.EmulateScale(2)),
		chromedp.WaitVisible(`#logo`, chromedp.ByID),
		chromedp.FullScreenshot(res, quality),
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

	http.HandleFunc("/api/screenshot", handler)
	http.HandleFunc("/", sayHi)
	log.Println("listening on", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
	if err := http.ListenAndServe(port, nil); err != nil {
		panic(err)
	}
}
