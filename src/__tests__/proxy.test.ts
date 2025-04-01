import { jest } from '@jest/globals';
// Set up mocks before importing modules that use them
const mockFetch = jest.fn();
const mockHttpsProxyAgent = jest.fn().mockImplementation(() => ({ 
  // Mock proxy agent instance
  constructor: { name: 'HttpsProxyAgent' } 
}));

jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch
}));

jest.unstable_mockModule('https-proxy-agent', () => ({
  HttpsProxyAgent: mockHttpsProxyAgent
}));

// Import after setting up mocks
const { YoutubeTranscript } = await import('../transcript.js');

describe('Proxy Configuration', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockImplementation(() => 
      Promise.resolve({
        text: () => Promise.resolve(`"captions":${JSON.stringify(mockCaptionsData)},"videoDetails"`),
        ok: true
      } as any)
    );
  });

  it('should use provided proxy configuration', async () => {
    const proxyConfig = {
      host: 'http://proxy.example.com:8080',
      auth: {
        username: 'user',
        password: 'pass'
      }
    };

    await YoutubeTranscript.fetchTranscript(validVideoId, { proxy: proxyConfig });

    expect(mockHttpsProxyAgent).toHaveBeenCalledWith(
      expect.stringContaining('user:pass@proxy.example.com:8080')
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        agent: expect.objectContaining({ constructor: { name: 'HttpsProxyAgent' } })
      })
    );
  });

  it('should use proxy without authentication', async () => {
    const proxyConfig = {
      host: 'http://proxy.example.com:8080'
    };

    await YoutubeTranscript.fetchTranscript(validVideoId, { proxy: proxyConfig });

    expect(mockHttpsProxyAgent).toHaveBeenCalledWith(
      expect.stringContaining('proxy.example.com:8080')
    );
  });

  it('should use pre-configured proxy agent', async () => {
    const mockProxyAgent = mockHttpsProxyAgent('http://proxy.example.com:8080');

    await YoutubeTranscript.fetchTranscript(validVideoId, { proxyAgent: mockProxyAgent });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        agent: mockProxyAgent
      })
    );
  });

  it('should make request without proxy when no proxy config provided', async () => {
    await YoutubeTranscript.fetchTranscript(validVideoId);

    expect(mockHttpsProxyAgent).not.toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.objectContaining({
        agent: expect.objectContaining({ constructor: { name: 'HttpsProxyAgent' } })
      })
    );
  });
});
