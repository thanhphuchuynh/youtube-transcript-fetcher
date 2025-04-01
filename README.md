# YouTube Transcript Fetcher

A TypeScript library for fetching transcripts from YouTube videos.

## Features

- Fetch transcripts from YouTube videos using URL or video ID
- Support for multiple languages
- Comprehensive error handling
- TypeScript support with full type definitions
- Promise-based API

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Running the Example

```bash
# Run the example script
npm run example
```

This will run the example in examples/fetch-transcript.ts which demonstrates:
1. Fetching a transcript in the default language
2. Fetching a transcript in Spanish
3. Error handling with an invalid video ID

For your own use case, you would need to copy the src/ directory into your project
and install the required dependencies.

## Usage

```typescript
import { YoutubeTranscript } from './src';

// Fetch transcript with default language
const transcript = await YoutubeTranscript.fetchTranscript(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

// Fetch transcript in specific language
const spanishTranscript = await YoutubeTranscript.fetchTranscript(
  'dQw4w9WgXcQ', // Can use video ID directly
  { lang: 'es' }
);
```

## Example

Check out [examples/fetch-transcript.ts](examples/fetch-transcript.ts) for a complete example showing:
- Fetching transcripts with default language
- Fetching transcripts in specific languages
- Error handling

## API

### `YoutubeTranscript.fetchTranscript(videoId: string, config?: TranscriptConfig)`

Fetches the transcript for a YouTube video.

#### Parameters

- `videoId`: Video URL or ID
- `config` (optional): Configuration options
  - `lang`: ISO language code (e.g., 'en', 'es', 'fr')

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
