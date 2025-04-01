---
title: YouTube's transcript feature with proxy
published: true
description: Learn how to programmatically access YouTube video transcripts, handle multiple languages, and implement proxy support using TypeScript.
tags: typescript, youtube, api, webdev
---

# Unlocking YouTube's Hidden Transcript API

YouTube's transcript feature is a powerful but often overlooked resource. While there's no official API endpoint for accessing transcripts, we can programmatically fetch them. In this article, I'll show you how to work with YouTube's hidden transcript API and share insights from building a TypeScript library for this purpose.

## Understanding YouTube Transcripts

YouTube provides transcripts for many videos, either auto-generated or manually added. These transcripts include:
- Text content
- Timestamps for each segment
- Duration information
- Language information

## The Technical Implementation

Here's how to fetch transcripts using TypeScript:

```typescript
import { YoutubeTranscript } from 't-youtube-transcript-fetcher';

// Basic usage with video URL
const transcript = await YoutubeTranscript.fetchTranscript(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
);

// Using video ID with specific language
const spanishTranscript = await YoutubeTranscript.fetchTranscript(
  'dQw4w9WgXcQ',
  { lang: 'es' }
);
```

The response is an array of transcript segments:

```typescript
interface TranscriptSegment {
  text: string;     // The text content
  duration: number; // Duration in seconds
  offset: number;   // Start time in seconds
  lang: string;     // Language code
}
```

## Handling Edge Cases

When working with YouTube's transcript API, you'll need to handle various scenarios:

1. **Rate Limiting**: YouTube may rate-limit requests if too many are made in quick succession
2. **Private Videos**: Some videos may be private or unavailable
3. **Disabled Transcripts**: Content creators can disable transcripts
4. **Language Availability**: Not all languages may be available for every video

Here's how to implement robust error handling:

```typescript
try {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  // Process transcript
} catch (error) {
  if (error instanceof RateLimitError) {
    console.error('Too many requests, try again later');
  } else if (error instanceof VideoUnavailableError) {
    console.error('Video is private or doesn\'t exist');
  } else if (error instanceof TranscriptDisabledError) {
    console.error('Transcripts are disabled for this video');
  } else if (error instanceof NoTranscriptError) {
    console.error('No transcripts available');
  } else if (error instanceof LanguageNotFoundError) {
    console.error('Requested language not available');
  }
}
```

## Advanced Usage: Proxy Support

For scenarios requiring proxy support (e.g., handling geographic restrictions or load balancing), you can configure proxy settings:

```typescript
import { HttpsProxyAgent } from 'https-proxy-agent';

// Using a pre-configured proxy agent
const proxyAgent = new HttpsProxyAgent('https://username:password@proxy.example.com:8080');
const transcript = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
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

## Practical Applications

This API access enables various applications:

1. **Content Analysis**: Analyze video content programmatically
2. **Subtitle Generation**: Create custom subtitles or closed captions
3. **Search Indexing**: Make video content searchable
4. **Language Learning Tools**: Build tools for studying content in different languages
5. **Accessibility Features**: Improve video accessibility with text-based content

## Best Practices

When working with YouTube's transcript API:

1. **Implement Rate Limiting**: Add delays between requests to avoid hitting limits
2. **Cache Results**: Store transcripts to minimize API calls
3. **Handle Languages Gracefully**: Check language availability before requesting specific translations
4. **Validate Input**: Ensure video IDs/URLs are valid before making requests
5. **Consider Proxy Rotation**: For large-scale applications, rotate through multiple proxies

## Conclusion

YouTube's hidden transcript API offers powerful capabilities for developers. While not officially documented, it provides reliable access to video transcripts when handled properly. The TypeScript implementation shown here demonstrates how to access this functionality while handling edge cases and providing proxy support for more robust applications.

The complete implementation is available as an npm package: [t-youtube-transcript-fetcher](https://www.npmjs.com/package/t-youtube-transcript-fetcher). Check out the source code on [GitHub](https://github.com/thanhphuchuynh/youtube-transcript-fetcher) for more details and implementation examples.

Remember to respect YouTube's terms of service and implement proper rate limiting in your applications. Happy coding! 🚀
