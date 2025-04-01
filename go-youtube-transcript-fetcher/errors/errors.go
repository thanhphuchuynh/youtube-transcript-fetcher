// Package errors provides custom error types for YouTube transcript fetching
package errors

import (
	"fmt"
	"strings"

	"github.com/thanhphuchuynh/go-youtube-transcript-fetcher/utils"
)

// TranscriptError is the base error type for YouTube transcript errors
type TranscriptError struct {
	Message string
}

// Error returns the formatted error message
func (e *TranscriptError) Error() string {
	return utils.FormatErrorMessage(e.Message)
}

// NewTranscriptError creates a new TranscriptError with the given message
func NewTranscriptError(message string) *TranscriptError {
	return &TranscriptError{Message: message}
}

// RateLimitError is thrown when YouTube's rate limit is exceeded
type RateLimitError struct {
	*TranscriptError
}

// NewRateLimitError creates a new RateLimitError
func NewRateLimitError() *RateLimitError {
	message := "⚠️  Rate Limit Exceeded\n" +
		"\n" +
		"YouTube is receiving too many requests from this IP.\n" +
		"Please try again later or use a different IP address."

	return &RateLimitError{
		TranscriptError: NewTranscriptError(message),
	}
}

// VideoUnavailableError is thrown when the requested video does not exist or is private
type VideoUnavailableError struct {
	*TranscriptError
	VideoID string
}

// NewVideoUnavailableError creates a new VideoUnavailableError
func NewVideoUnavailableError(videoID string) *VideoUnavailableError {
	message := fmt.Sprintf(
		"🚫  Video Unavailable\n"+
			"\n"+
			"The video \"%s\" is no longer available.\n"+
			"It may have been removed or set to private.",
		videoID)

	return &VideoUnavailableError{
		TranscriptError: NewTranscriptError(message),
		VideoID:         videoID,
	}
}

// TranscriptDisabledError is thrown when transcripts are disabled for the video
type TranscriptDisabledError struct {
	*TranscriptError
	VideoID string
}

// NewTranscriptDisabledError creates a new TranscriptDisabledError
func NewTranscriptDisabledError(videoID string) *TranscriptDisabledError {
	message := fmt.Sprintf(
		"❌  Transcripts Disabled\n"+
			"\n"+
			"Transcripts are disabled for video \"%s\".\n"+
			"The video owner has not enabled transcripts for this content.",
		videoID)

	return &TranscriptDisabledError{
		TranscriptError: NewTranscriptError(message),
		VideoID:         videoID,
	}
}

// NoTranscriptError is thrown when no transcripts exist for the video
type NoTranscriptError struct {
	*TranscriptError
	VideoID string
}

// NewNoTranscriptError creates a new NoTranscriptError
func NewNoTranscriptError(videoID string) *NoTranscriptError {
	message := fmt.Sprintf(
		"📝  No Transcripts Available\n"+
			"\n"+
			"No transcripts were found for video \"%s\".\n"+
			"This video may not have any transcripts generated yet.",
		videoID)

	return &NoTranscriptError{
		TranscriptError: NewTranscriptError(message),
		VideoID:         videoID,
	}
}

// LanguageNotFoundError is thrown when the requested language is not available
type LanguageNotFoundError struct {
	*TranscriptError
	Lang           string
	AvailableLangs []string
	VideoID        string
}

// NewLanguageNotFoundError creates a new LanguageNotFoundError
func NewLanguageNotFoundError(lang string, availableLangs []string, videoID string) *LanguageNotFoundError {
	langBullets := make([]string, len(availableLangs))
	for i, l := range availableLangs {
		langBullets[i] = fmt.Sprintf("  • %s", l)
	}

	message := fmt.Sprintf(
		"🌐  Language Not Available\n"+
			"\n"+
			"Transcripts in \"%s\" are not available for video \"%s\".\n"+
			"\n"+
			"Available languages:\n%s",
		lang, videoID, strings.Join(langBullets, "\n"))

	return &LanguageNotFoundError{
		TranscriptError: NewTranscriptError(message),
		Lang:            lang,
		AvailableLangs:  availableLangs,
		VideoID:         videoID,
	}
}
