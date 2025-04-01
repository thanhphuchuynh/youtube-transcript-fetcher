// Package utils provides utility functions for the YouTube transcript fetcher
package utils

import (
	"fmt"
	"strings"
)

// FormatErrorMessage formats an error message with a consistent, visually appealing style
func FormatErrorMessage(message string) string {
	// Replace newlines with aligned newlines to maintain box structure
	alignedMessage := strings.ReplaceAll(message, "\n", "\n  ")

	return fmt.Sprintf(`
╭─────────────── YouTube Transcript Error ───────────────╮
│                                                        │
  %s
│                                                        │
╰────────────────────────────────────────────────────────╯`, alignedMessage)
}
