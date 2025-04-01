import { jest } from '@jest/globals';
import { 
  TranscriptError, 
  RateLimitError,
  VideoUnavailableError,
  TranscriptDisabledError,
  NoTranscriptError,
  LanguageNotFoundError
} from '../errors.js';

// Set up mocks before importing modules that use them
const mockFetch = jest.fn();

jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch
}));

// Import after setting up mocks
const { YoutubeTranscript } = await import('../transcript.js');

describe('YoutubeTranscript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveVideoId', () => {
    const testCases = [
      {
        name: 'direct video ID',
        input: 'dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ'
      },
      {
        name: 'youtube.com/watch URL',
        input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ'
      },
      {
        name: 'youtu.be short URL',
        input: 'https://youtu.be/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ'
      },
      {
        name: 'youtube.com/embed URL',
        input: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ'
      }
    ];

    testCases.forEach(({ name, input, expected }) => {
      it(`should extract video ID from ${name}`, async () => {
        mockFetch.mockImplementationOnce(() => 
          Promise.resolve({
            text: () => Promise.resolve('Mock response'),
            ok: true
          } as any)
        );

        await expect(YoutubeTranscript.fetchTranscript(input)).rejects.toThrow();
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(expected),
          expect.any(Object)
        );
      });
    });

    it('should throw error for invalid video ID format', async () => {
      await expect(YoutubeTranscript.fetchTranscript('invalid-id'))
        .rejects
        .toThrow(TranscriptError);
    });
  });

  describe('fetchTranscript', () => {
    const validVideoId = 'dQw4w9WgXcQ';
    const mockCaptionsData = {
      playerCaptionsTracklistRenderer: {
        captionTracks: [
          {
            baseUrl: 'https://youtube.com/api/timedtext',
            languageCode: 'en'
          }
        ]
      }
    };

    const mockTranscriptXml = `
      <transcript>
        <text start="0" dur="2.5">First caption</text>
        <text start="2.5" dur="3.0">Second caption</text>
      </transcript>
    `;

    it('should fetch and parse transcript successfully', async () => {
      // Mock the video page response
      mockFetch
        .mockImplementationOnce(() => Promise.resolve({
          text: () => Promise.resolve(`"captions":${JSON.stringify(mockCaptionsData)},"videoDetails"`)
        } as any))
        // Mock the transcript XML response
        .mockImplementationOnce(() => Promise.resolve({
          text: () => Promise.resolve(mockTranscriptXml),
          ok: true
        } as any));

      const transcript = await YoutubeTranscript.fetchTranscript(validVideoId);

      expect(transcript).toHaveLength(2);
      expect(transcript[0]).toEqual({
        text: 'First caption',
        duration: 2.5,
        offset: 0,
        lang: 'en'
      });
    });

    it('should handle rate limit error', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        text: () => Promise.resolve('<div class="g-recaptcha"></div>')
      } as any));

      await expect(YoutubeTranscript.fetchTranscript(validVideoId))
        .rejects
        .toThrow(RateLimitError);
    });

    it('should handle video unavailable error', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        text: () => Promise.resolve('Video unavailable')
      } as any));

      await expect(YoutubeTranscript.fetchTranscript(validVideoId))
        .rejects
        .toThrow(VideoUnavailableError);
    });

    it('should handle transcript disabled error', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        text: () => Promise.resolve('"playabilityStatus":{"status":"OK"}')
      } as any));

      await expect(YoutubeTranscript.fetchTranscript(validVideoId))
        .rejects
        .toThrow(TranscriptDisabledError);
    });

    it('should handle language not found error', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        text: () => Promise.resolve(`"captions":${JSON.stringify(mockCaptionsData)},"videoDetails"`)
      } as any));

      await expect(YoutubeTranscript.fetchTranscript(validVideoId, { lang: 'fr' }))
        .rejects
        .toThrow(LanguageNotFoundError);
    });
  });
});
