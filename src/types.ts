/** Configuration options for transcript fetching */
export interface TranscriptConfig {
  /** ISO language code (e.g., 'en', 'es', 'fr') */
  lang?: string;
}

/** Structure of a transcript segment */
export interface TranscriptSegment {
  /** The text content of the segment */
  text: string;
  /** Duration of the segment in seconds */
  duration: number;
  /** Start time of the segment in seconds */
  offset: number;
  /** Language code of the segment */
  lang?: string;
}

/** Internal structure of YouTube captions data */
export interface CaptionsData {
  playerCaptionsTracklistRenderer: {
    captionTracks: Array<{
      baseUrl: string;
      languageCode: string;
    }>;
  };
}
