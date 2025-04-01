import { YoutubeTranscript } from '../dist/index.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function main() {
  try {
    // Basic usage without proxy
    // const transcript = await YoutubeTranscript.fetchTranscript('Ks-_Mh1QhMc');
    // console.log('First two segments of the transcript:', transcript.slice(0, 2));

    // Example with pre-configured proxy agent (recommended for custom proxy setups)
    /*
    const proxyAgent = new HttpsProxyAgent('https://username:password@proxy.example.com:8080');
    const transcriptWithAgent = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
      proxyAgent: proxyAgent
    });
    */
 
    // Alternative: Using proxy configuration object
    /*
    const transcriptWithProxy = await YoutubeTranscript.fetchTranscript('VIDEO_ID', {
      proxy: {
        host: 'http://proxy.example.com:8080',
        auth: {
          username: 'your-username',
          password: 'your-password'
        }
      }
    });
    */
    const transcriptWithProxy = await YoutubeTranscript.fetchTranscript('Ks-_Mh1QhMc', {
      proxyAgent: new HttpsProxyAgent(''),
      lang: 'en',
    });
      console.log('First two segments of the transcript:', transcriptWithProxy.slice(0, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
