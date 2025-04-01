import { formatErrorMessage } from './utils/format';

/**
 * Base error class for YouTube transcript errors
 */
export class TranscriptError extends Error {
  constructor(message: string) {
    super(formatErrorMessage(message));
  }
}

/**
 * Error thrown when YouTube's rate limit is exceeded
 */
export class RateLimitError extends TranscriptError {
  constructor() {
    super(
      '⚠️  Rate Limit Exceeded\n' +
      '\n' +
      'YouTube is receiving too many requests from this IP.\n' +
      'Please try again later or use a different IP address.'
    );
  }
}

/**
 * Error thrown when the requested video does not exist or is private
 */
export class VideoUnavailableError extends TranscriptError {
  constructor(videoId: string) {
    super(
      '🚫  Video Unavailable\n' +
      '\n' +
      `The video "${videoId}" is no longer available.\n` +
      'It may have been removed or set to private.'
    );
  }
}

/**
 * Error thrown when transcripts are disabled for the video
 */
export class TranscriptDisabledError extends TranscriptError {
  constructor(videoId: string) {
    super(
      '❌  Transcripts Disabled\n' +
      '\n' +
      `Transcripts are disabled for video "${videoId}".\n` +
      'The video owner has not enabled transcripts for this content.'
    );
  }
}

/**
 * Error thrown when no transcripts exist for the video
 */
export class NoTranscriptError extends TranscriptError {
  constructor(videoId: string) {
    super(
      '📝  No Transcripts Available\n' +
      '\n' +
      `No transcripts were found for video "${videoId}".\n` +
      'This video may not have any transcripts generated yet.'
    );
  }
}

/**
 * Error thrown when the requested language is not available
 */
export class LanguageNotFoundError extends TranscriptError {
  constructor(lang: string, availableLangs: string[], videoId: string) {
    super(
      '🌐  Language Not Available\n' +
      '\n' +
      `Transcripts in "${lang}" are not available for video "${videoId}".\n` +
      '\n' +
      'Available languages:\n' +
      availableLangs.map(l => `  • ${l}`).join('\n')
    );
  }
}
