import { CONSTANTS } from './constants';
import {
  TranscriptError,
  RateLimitError,
  VideoUnavailableError,
  TranscriptDisabledError,
  NoTranscriptError,
  LanguageNotFoundError,
} from './errors';
import { TranscriptConfig, TranscriptSegment, CaptionsData } from './types';

/**
 * Service class for fetching YouTube video transcripts
 */
export class YoutubeTranscript {
  /**
   * Fetches the transcript for a YouTube video
   * @param videoId Video URL or ID
   * @param config Configuration options
   * @returns Array of transcript segments
   */
  public static async fetchTranscript(
    videoId: string,
    config?: TranscriptConfig
  ): Promise<TranscriptSegment[]> {
    const identifier = this.retrieveVideoId(videoId);
    const pageContent = await this.fetchVideoPage(identifier, config?.lang);
    const captionsData = this.parseCaptionsData(pageContent, videoId);
    const transcriptUrl = this.getTranscriptUrl(captionsData, videoId, config?.lang);
    return this.fetchAndParseTranscript(transcriptUrl, config?.lang, captionsData.playerCaptionsTracklistRenderer.captionTracks[0].languageCode);
  }

  /**
   * Fetches the video page content
   */
  private static async fetchVideoPage(videoId: string, lang?: string): Promise<string> {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        ...(lang && { 'Accept-Language': lang }),
        'User-Agent': CONSTANTS.USER_AGENT,
      },
    });
    return response.text();
  }

  /**
   * Extracts and validates captions data from the video page
   */
  private static parseCaptionsData(pageContent: string, videoId: string): CaptionsData {
    const htmlParts = pageContent.split('"captions":');

    if (htmlParts.length <= 1) {
      this.handlePageErrors(pageContent, videoId);
    }

    const captionsData = this.extractCaptionsJson(htmlParts[1]);
    
    if (!captionsData) {
      throw new TranscriptDisabledError(videoId);
    }

    if (!('captionTracks' in captionsData.playerCaptionsTracklistRenderer)) {
      throw new NoTranscriptError(videoId);
    }

    return captionsData;
  }

  /**
   * Extracts captions JSON data from the page content
   */
  private static extractCaptionsJson(captionsSection: string): CaptionsData | undefined {
    try {
      const jsonStr = captionsSection.split(',"videoDetails')[0].replace('\n', '');
      return JSON.parse(jsonStr);
    } catch {
      return undefined;
    }
  }

  /**
   * Handles various error cases from the video page
   */
  private static handlePageErrors(pageContent: string, videoId: string): never {
    if (pageContent.includes('class="g-recaptcha"')) {
      throw new RateLimitError();
    }
    if (!pageContent.includes('"playabilityStatus":')) {
      throw new VideoUnavailableError(videoId);
    }
    throw new TranscriptDisabledError(videoId);
  }

  /**
   * Gets the URL for the transcript in the requested language
   */
  private static getTranscriptUrl(captionsData: CaptionsData, videoId: string, requestedLang?: string): string {
    if (requestedLang) {
      this.validateLanguageAvailability(captionsData, requestedLang, videoId);
    }

    const tracks = captionsData.playerCaptionsTracklistRenderer.captionTracks;
    const track = requestedLang
      ? tracks.find((track) => track.languageCode === requestedLang)
      : tracks[0];

    if (!track) {
      throw new NoTranscriptError(videoId);
    }

    return track.baseUrl;
  }

  /**
   * Validates that the requested language is available
   */
  private static validateLanguageAvailability(captionsData: CaptionsData, lang: string, videoId: string): void {
    const tracks = captionsData.playerCaptionsTracklistRenderer.captionTracks;
    const isLanguageAvailable = tracks.some(
      (track) => track.languageCode === lang
    );

    if (!isLanguageAvailable) {
      const availableLanguages = tracks.map(
        (track) => track.languageCode
      );
      throw new LanguageNotFoundError(lang, availableLanguages, videoId);
    }
  }

  /**
   * Fetches and parses the transcript XML
   */
  private static async fetchAndParseTranscript(
    transcriptUrl: string,
    requestedLang?: string,
    defaultLang?: string
  ): Promise<TranscriptSegment[]> {
    const response = await fetch(transcriptUrl, {
      headers: {
        ...(requestedLang && { 'Accept-Language': requestedLang }),
        'User-Agent': CONSTANTS.USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new NoTranscriptError(transcriptUrl);
    }

    const transcriptText = await response.text();
    const matches = [...transcriptText.matchAll(CONSTANTS.TRANSCRIPT_XML_REGEX)];

    return matches.map(match => ({
      text: match[3],
      duration: parseFloat(match[2]),
      offset: parseFloat(match[1]),
      lang: requestedLang ?? defaultLang,
    }));
  }

  /**
   * Extracts the video ID from either a full URL or direct ID
   */
  private static retrieveVideoId(videoId: string): string {
    if (videoId.length === 11) {
      return videoId;
    }

    const match = videoId.match(CONSTANTS.VIDEO_ID_REGEX);
    if (match?.[1]) {
      return match[1];
    }

    throw new TranscriptError('Could not extract YouTube video ID from the provided string');
  }
}
