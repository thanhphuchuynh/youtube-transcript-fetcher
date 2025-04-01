# t-youtube-transcript-fetcher

A TypeScript library for fetching transcripts from YouTube videos.

This is an enhanced version of [youtube-transcript](https://github.com/Kakulukian/youtube-transcript) with added proxy support and improved TypeScript integration.

## Features

- Fetch transcripts from YouTube videos using URL or video ID
- Support for multiple languages
- Proxy support with flexible configuration options
- Comprehensive error handling
- TypeScript support with full type definitions
- Promise-based API

## Installation

```bash
npm install t-youtube-transcript-fetcher
```

## Usage

```typescript
import { YoutubeTranscript } from 't-youtube-transcript-fetcher';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Basic usage: Fetch transcript with default language
const transcript = await YoutubeTranscript.fetchTranscript(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

// Fetch transcript in specific language
const spanishTranscript = await YoutubeTranscript.fetchTranscript(
  'dQw4w9WgXcQ', // Can use video ID directly
  { lang: 'es' }
);

// Using pre-configured proxy agent
const proxyAgent = new HttpsProxyAgent('https://username:password@proxy.example.com:8080');
const transcriptWithProxy = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
  proxyAgent: proxyAgent
});

// Alternative: Using proxy configuration object
const transcriptWithProxyConfig = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
  proxy: {
    host: 'http://proxy.example.com:8080',
    auth: {
      username: 'your-username',
      password: 'your-password'
    }
  }
});
```

## Example

Check out [examples/fetch-transcript.ts](examples/fetch-transcript.ts) for a complete example showing:
- Fetching transcripts with default language
- Fetching transcripts in specific languages
- Using proxy configuration
- Error handling

## API

### `YoutubeTranscript.fetchTranscript(videoId: string, config?: TranscriptConfig)`

Fetches the transcript for a YouTube video.

#### Parameters

- `videoId`: Video URL or ID
- `config` (optional): Configuration options
  - `lang`: ISO language code (e.g., 'en', 'es', 'fr')
  - `proxyAgent`: Pre-configured HttpsProxyAgent instance (takes precedence over proxy config)
  - `proxy`: Proxy configuration object
    - `host`: Proxy server URL (e.g., 'http://proxy.example.com:8080')
    - `auth`: Optional proxy authentication
      - `username`: Proxy username
      - `password`: Proxy password

#### Returns

Promise resolving to an array of transcript segments:

```typescript
interface TranscriptSegment {
  text: string;     // The text content
  duration: number; // Duration in seconds
  offset: number;   // Start time in seconds
  lang: string;     // Language code
}
```

#### Errors

The library throws specific errors for different cases:

- `TranscriptError`: Base error class
- `RateLimitError`: YouTube's rate limit exceeded
- `VideoUnavailableError`: Video doesn't exist or is private
- `TranscriptDisabledError`: Transcripts disabled for the video
- `NoTranscriptError`: No transcripts available
- `LanguageNotFoundError`: Requested language not available

## Testing

This project uses Jest for testing. The test suite includes:

- Unit tests for core functionality
- Error message formatting tests
- Proxy configuration tests

To run tests:

```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

Test reports and coverage information are generated in the `coverage` directory:
- Test Report: `coverage/test-report.html`
- Coverage Report: `coverage/index.html`

## Project Structure

```
.
├── src/
│   ├── constants.ts    # Constants and regex patterns
│   ├── errors.ts       # Error classes
│   ├── types.ts        # TypeScript interfaces
│   ├── transcript.ts   # Main YoutubeTranscript class
│   └── index.ts        # Public exports
└── examples/
    └── fetch-transcript.ts  # Usage examples
```

## Error Handling

```typescript
try {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  // Process transcript
} catch (error) {
  if (error instanceof RateLimitError) {
    // Handle rate limiting
  } else if (error instanceof VideoUnavailableError) {
    // Handle unavailable video
  } else if (error instanceof TranscriptDisabledError) {
    // Handle disabled transcripts
  } else {
    // Handle other errors
  }
}
```

## Proxy Support

The library provides two ways to configure proxy support:

1. Using a pre-configured proxy agent (recommended for custom setups):
```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxyAgent = new HttpsProxyAgent('https://username:password@proxy.example.com:8080');
const transcript = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
  proxyAgent: proxyAgent
});
```

2. Using the proxy configuration object:
```typescript
const transcript = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
  proxy: {
    host: 'http://proxy.example.com:8080',
    auth: {  // Optional
      username: 'your-username',
      password: 'your-password'
    }
  }
});
```

The `proxyAgent` option takes precedence over the `proxy` configuration if both are provided. Both methods will apply the proxy to all HTTP requests made by the library.

## Credits

This project is an enhanced version of [youtube-transcript](https://github.com/Kakulukian/youtube-transcript) by [Kakulukian](https://github.com/Kakulukian), with added features including:

- Proxy support with flexible configuration
- Enhanced TypeScript support
- Improved error handling
- More detailed documentation

## License

MIT
