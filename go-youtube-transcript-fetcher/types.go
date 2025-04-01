package ytfetcher

// ProxyAuth contains authentication information for a proxy
type ProxyAuth struct {
	Username string
	Password string
}

// ProxyConfig contains proxy server configuration
type ProxyConfig struct {
	Host string
	Auth *ProxyAuth
}

// TranscriptConfig contains configuration options for transcript fetching
type TranscriptConfig struct {
	// ISO language code (e.g., 'en', 'es', 'fr')
	Lang string
	// Proxy configuration for HTTP requests
	Proxy *ProxyConfig
	// Custom HTTP client (takes precedence over proxy config)
	Client interface{}
}

// TranscriptSegment represents a single segment of a transcript
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

// CaptionTrack represents a single caption track from YouTube
type CaptionTrack struct {
	BaseURL      string `json:"baseUrl"`
	LanguageCode string `json:"languageCode"`
}

// CaptionsTracklistRenderer represents the structure of YouTube captions data
type CaptionsTracklistRenderer struct {
	CaptionTracks []CaptionTrack `json:"captionTracks"`
}

// CaptionsData represents the internal structure of YouTube captions data
type CaptionsData struct {
	PlayerCaptionsTracklistRenderer CaptionsTracklistRenderer `json:"playerCaptionsTracklistRenderer"`
}
