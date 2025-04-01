# Go YouTube Transcript Fetcher

A Go library for fetching YouTube video transcripts with proxy support.

## Features

- 📝 Fetch transcripts from any YouTube video
- 🌐 Support for different languages
- 🔒 Proxy support for bypassing regional restrictions
- 💾 Simple and easy-to-use API

## Installation

```bash
go get github.com/thanhphuchuynh/go-youtube-transcript-fetcher
```

## Usage

### Basic Usage

```go
package main

import (
    "fmt"
    "log"
    
    ytfetcher "github.com/thanhphuchuynh/go-youtube-transcript-fetcher"
)

func main() {
    // Fetch transcript for a YouTube video (using video ID)
    transcript, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", nil)
    if err != nil {
        log.Fatalf("Error fetching transcript: %v", err)
    }
    
    // Print the first segment
    if len(transcript) > 0 {
        fmt.Printf("First segment: %s\n", transcript[0].Text)
    }
}
```

### Fetching Transcript in a Specific Language

```go
transcript, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
    Lang: "es", // Spanish
})
```

### Using a Proxy

```go
import (
    "net/http"
    "net/url"
    
    ytfetcher "github.com/thanhphuchuynh/go-youtube-transcript-fetcher"
)

// Method 1: Using a custom HTTP client with proxy
proxyURL, _ := url.Parse("http://proxy.example.com:8080")
transport := &http.Transport{
    Proxy: http.ProxyURL(proxyURL),
}
client := &http.Client{
    Transport: transport,
}

transcript, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
    Client: client,
})

// Method 2: Using the built-in proxy configuration
transcript, err := ytfetcher.FetchTranscript("Ks-_Mh1QhMc", &ytfetcher.TranscriptConfig{
    Proxy: &ytfetcher.ProxyConfig{
        Host: "http://proxy.example.com:8080",
        Auth: &ytfetcher.ProxyAuth{
            Username: "your-username",
            Password: "your-password",
        },
    },
})
```

### Transcript Segment Structure

```go
type TranscriptSegment struct {
    // The text content of the segment
    Text string
    // Duration of the segment in seconds
    Duration float64
    // Start time of the segment in seconds
    Offset float64
    // Language code of the segment
    Lang string
}
```

## Error Handling

The library provides detailed error types for different failure scenarios:

- `RateLimitError`: When YouTube's rate limit is exceeded
- `VideoUnavailableError`: When the video does not exist or is private
- `TranscriptDisabledError`: When transcripts are disabled for the video
- `NoTranscriptError`: When no transcripts exist for the video
- `LanguageNotFoundError`: When the requested language is not available

Example:

```go
import (
    "fmt"
    
    ytfetcher "github.com/thanhphuchuynh/go-youtube-transcript-fetcher"
    yterrors "github.com/thanhphuchuynh/go-youtube-transcript-fetcher/errors"
)

transcript, err := ytfetcher.FetchTranscript("INVALID_ID", nil)
if err != nil {
    switch err.(type) {
    case *yterrors.VideoUnavailableError:
        fmt.Println("Video is unavailable")
    case *yterrors.TranscriptDisabledError:
        fmt.Println("Transcripts are disabled for this video")
    case *yterrors.NoTranscriptError:
        fmt.Println("No transcripts exist for this video")
    default:
        fmt.Printf("Unknown error: %v\n", err)
    }
}
```

## License

MIT
