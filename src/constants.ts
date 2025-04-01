/**
 * Regular expressions and constants used for YouTube transcript fetching
 */
export const CONSTANTS = {
  /** Matches YouTube video URLs and extracts the video ID */
  VIDEO_ID_REGEX: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
  
  /** User agent string for making requests */
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)',
  
  /** Matches transcript XML format and extracts timing and text */
  TRANSCRIPT_XML_REGEX: /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g
};
