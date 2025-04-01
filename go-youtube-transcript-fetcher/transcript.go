// Package ytfetcher provides functionality to fetch and parse YouTube video transcripts
package ytfetcher

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/thanhphuchuynh/go-youtube-transcript-fetcher/constants"
	"github.com/thanhphuchuynh/go-youtube-transcript-fetcher/errors"
)

// YoutubeTranscript provides methods to fetch YouTube video transcripts
type YoutubeTranscript struct{}

// FetchTranscript fetches the transcript for a YouTube video
// videoID can be a full URL or just the ID
// config is optional configuration options
func (yt *YoutubeTranscript) FetchTranscript(videoID string, config *TranscriptConfig) ([]TranscriptSegment, error) {
	identifier, err := yt.retrieveVideoID(videoID)
	if err != nil {
		return nil, err
	}

	pageContent, err := yt.fetchVideoPage(identifier, config)
	if err != nil {
		return nil, err
	}

	captionsData, err := yt.parseCaptionsData(pageContent, identifier)
	if err != nil {
		return nil, err
	}

	var lang string
	if config != nil {
		lang = config.Lang
	}

	transcriptURL, defaultLang, err := yt.getTranscriptURL(captionsData, identifier, lang)
	if err != nil {
		return nil, err
	}

	return yt.fetchAndParseTranscript(transcriptURL, lang, defaultLang, config)
}

// FetchTranscriptStatic is a static wrapper for FetchTranscript
func FetchTranscript(videoID string, config *TranscriptConfig) ([]TranscriptSegment, error) {
	yt := &YoutubeTranscript{}
	return yt.FetchTranscript(videoID, config)
}

// getHTTPClient creates an HTTP client with or without proxy based on config
func (yt *YoutubeTranscript) getHTTPClient(config *TranscriptConfig) *http.Client {
	// Check if custom client is provided
	if config != nil && config.Client != nil {
		if client, ok := config.Client.(*http.Client); ok {
			return client
		}
	}

	// Create default client
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Add proxy if specified
	if config != nil && config.Proxy != nil {
		proxyURL, err := url.Parse(config.Proxy.Host)
		if err == nil {
			// Add auth if provided
			if config.Proxy.Auth != nil {
				proxyURL.User = url.UserPassword(
					config.Proxy.Auth.Username,
					config.Proxy.Auth.Password,
				)
			}

			transport := &http.Transport{
				Proxy: http.ProxyURL(proxyURL),
			}
			client.Transport = transport
		}
	}

	return client
}

// fetchVideoPage gets the HTML content of the YouTube video page
func (yt *YoutubeTranscript) fetchVideoPage(videoID string, config *TranscriptConfig) (string, error) {
	client := yt.getHTTPClient(config)
	url := fmt.Sprintf("https://www.youtube.com/watch?v=%s", videoID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}

	// Set headers
	req.Header.Set("User-Agent", constants.UserAgent)
	if config != nil && config.Lang != "" {
		req.Header.Set("Accept-Language", config.Lang)
	}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// parseCaptionsData extracts and validates captions data from the video page
func (yt *YoutubeTranscript) parseCaptionsData(pageContent string, videoID string) (*CaptionsData, error) {
	// Split by captions marker
	parts := strings.Split(pageContent, "\"captions\":")
	if len(parts) <= 1 {
		return nil, yt.handlePageErrors(pageContent, videoID)
	}

	// Extract JSON
	captionsJSON := yt.extractCaptionsJSON(parts[1])
	if captionsJSON == nil {
		return nil, errors.NewTranscriptDisabledError(videoID)
	}

	// Check if caption tracks exist
	if len(captionsJSON.PlayerCaptionsTracklistRenderer.CaptionTracks) == 0 {
		return nil, errors.NewNoTranscriptError(videoID)
	}

	return captionsJSON, nil
}

// extractCaptionsJSON attempts to parse the captions JSON data
func (yt *YoutubeTranscript) extractCaptionsJSON(captionsSection string) *CaptionsData {
	// Find the end of the captions object
	jsonStr := strings.Split(captionsSection, ",\"videoDetails")[0]
	jsonStr = strings.ReplaceAll(jsonStr, "\n", "")

	var captionsData CaptionsData
	err := json.Unmarshal([]byte(jsonStr), &captionsData)
	if err != nil {
		return nil
	}

	return &captionsData
}

// handlePageErrors checks for various error conditions on the page
func (yt *YoutubeTranscript) handlePageErrors(pageContent string, videoID string) error {
	if strings.Contains(pageContent, "class=\"g-recaptcha\"") {
		return errors.NewRateLimitError()
	}
	if !strings.Contains(pageContent, "\"playabilityStatus\":") {
		return errors.NewVideoUnavailableError(videoID)
	}
	return errors.NewTranscriptDisabledError(videoID)
}

// getTranscriptURL gets the URL for the transcript in the requested language
func (yt *YoutubeTranscript) getTranscriptURL(captionsData *CaptionsData, videoID string, requestedLang string) (string, string, error) {
	tracks := captionsData.PlayerCaptionsTracklistRenderer.CaptionTracks

	// Validate language availability if a specific language is requested
	if requestedLang != "" {
		err := yt.validateLanguageAvailability(captionsData, requestedLang, videoID)
		if err != nil {
			return "", "", err
		}
	}

	// Find the appropriate track
	var track *CaptionTrack
	defaultLang := ""

	if requestedLang != "" {
		// Find track matching requested language
		for _, t := range tracks {
			if t.LanguageCode == requestedLang {
				track = &t
				break
			}
		}
	} else if len(tracks) > 0 {
		// Use first track if no language specified
		track = &tracks[0]
	}

	if track != nil {
		defaultLang = track.LanguageCode
		return track.BaseURL, defaultLang, nil
	}

	return "", "", errors.NewNoTranscriptError(videoID)
}

// validateLanguageAvailability checks if the requested language is available
func (yt *YoutubeTranscript) validateLanguageAvailability(captionsData *CaptionsData, lang string, videoID string) error {
	tracks := captionsData.PlayerCaptionsTracklistRenderer.CaptionTracks
	isLanguageAvailable := false

	// Check if language is available
	for _, track := range tracks {
		if track.LanguageCode == lang {
			isLanguageAvailable = true
			break
		}
	}

	if !isLanguageAvailable {
		// Collect available languages
		availableLanguages := make([]string, len(tracks))
		for i, track := range tracks {
			availableLanguages[i] = track.LanguageCode
		}
		return errors.NewLanguageNotFoundError(lang, availableLanguages, videoID)
	}

	return nil
}

// fetchAndParseTranscript fetches and parses the transcript XML
func (yt *YoutubeTranscript) fetchAndParseTranscript(
	transcriptURL string,
	requestedLang string,
	defaultLang string,
	config *TranscriptConfig,
) ([]TranscriptSegment, error) {
	client := yt.getHTTPClient(config)

	req, err := http.NewRequest("GET", transcriptURL, nil)
	if err != nil {
		return nil, err
	}

	// Set headers
	req.Header.Set("User-Agent", constants.UserAgent)
	if requestedLang != "" {
		req.Header.Set("Accept-Language", requestedLang)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.NewNoTranscriptError(transcriptURL)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	transcriptText := string(body)

	// Parse the XML with regex
	matches := constants.TranscriptXMLRegex.FindAllStringSubmatch(transcriptText, -1)
	if matches == nil {
		return nil, errors.NewNoTranscriptError(transcriptURL)
	}

	// Create transcript segments
	segments := make([]TranscriptSegment, len(matches))
	for i, match := range matches {
		// Parse offset and duration
		var offset, duration float64
		fmt.Sscanf(match[1], "%f", &offset)
		fmt.Sscanf(match[2], "%f", &duration)

		// Create segment
		segments[i] = TranscriptSegment{
			Text:     match[3],
			Duration: duration,
			Offset:   offset,
			Lang:     requestedLang,
		}

		// Set default language if requested language is empty
		if segments[i].Lang == "" {
			segments[i].Lang = defaultLang
		}
	}

	return segments, nil
}

// retrieveVideoID extracts the video ID from either a full URL or direct ID
func (yt *YoutubeTranscript) retrieveVideoID(videoID string) (string, error) {
	// Check if already an ID (11 characters)
	if len(videoID) == 11 {
		return videoID, nil
	}

	// Try to extract from URL
	matches := constants.VideoIDRegex.FindStringSubmatch(videoID)
	if len(matches) > 1 {
		return matches[1], nil
	}

	return "", errors.NewTranscriptError("Could not extract YouTube video ID from the provided string")
}
