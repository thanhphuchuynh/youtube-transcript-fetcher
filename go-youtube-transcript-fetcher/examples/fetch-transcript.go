package main

import (
	"fmt"
	"log"

	ytfetcher "github.com/thanhphuchuynh/go-youtube-transcript-fetcher"
)

func main() {
	// Basic usage without proxy
	transcript, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", nil)
	if err != nil {
		log.Fatalf("Error fetching transcript: %v", err)
	}

	// Print first two segments of the transcript
	if len(transcript) >= 2 {
		fmt.Println("First two segments of the transcript:")
		for i, segment := range transcript[:2] {
			fmt.Printf("%d. [%.2f-%.2f] %s\n", i+1, segment.Offset, segment.Offset+segment.Duration, segment.Text)
		}
	}

	// Example with language preference
	/*
	   transcriptInSpanish, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
	   Lang: "es",
	   })
	   if err != nil {
	   log.Fatalf("Error fetching Spanish transcript: %v", err)
	   }
	   fmt.Println("First segment in Spanish:", transcriptInSpanish[0].Text)
	*/

	// Example with proxy configuration
	/*
	   proxyURL, err := url.Parse("http://proxy.example.com:8080")
	   if err != nil {
	   log.Fatalf("Invalid proxy URL: %v", err)
	   }

	   // Create a custom HTTP transport with the proxy
	   transport := &http.Transport{
	   Proxy: http.ProxyURL(proxyURL),
	   }

	   // Create a custom HTTP client with the transport
	   client := &http.Client{
	   Transport: transport,
	   }

	   // Use the custom client for transcript fetching
	   transcriptWithProxy, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
	   Client: client,
	   })
	   if err != nil {
	   log.Fatalf("Error fetching transcript with proxy: %v", err)
	   }
	   fmt.Println("First segment with proxy:", transcriptWithProxy[0].Text)
	*/

	// Alternative: Using proxy configuration object
	/*
	   transcriptWithProxyConfig, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
	   Proxy: &ytfetcher.ProxyConfig{
	   Host: "http://proxy.example.com:8080",
	   Auth: &ytfetcher.ProxyAuth{
	   Username: "your-username",
	   Password: "your-password",
	   },
	   },
	   })
	   if err != nil {
	   log.Fatalf("Error fetching transcript with proxy config: %v", err)
	   }
	   fmt.Println("First segment with proxy config:", transcriptWithProxyConfig[0].Text)
	*/
}
