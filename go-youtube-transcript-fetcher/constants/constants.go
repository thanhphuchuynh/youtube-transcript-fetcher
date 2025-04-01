// Package constants provides regular expressions and constants used for YouTube transcript fetching
package constants

import "regexp"

// Constants used for YouTube transcript fetching
var (
	// VideoIDRegex matches YouTube video URLs and extracts the video ID
	VideoIDRegex = regexp.MustCompile(`(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`)

	// UserAgent string for making requests
	UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)"

	// TranscriptXMLRegex matches transcript XML format and extracts timing and text
	TranscriptXMLRegex = regexp.MustCompile(`<text start="([^"]*)" dur="([^"]*)">([^<]*)</text>`)
)
