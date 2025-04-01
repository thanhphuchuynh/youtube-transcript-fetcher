import { YoutubeTranscript } from '../dist/index.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function main() {
  try {
    // Basic usage without proxy
    const transcript = await YoutubeTranscript.fetchTranscript('Ks-_Mh1QhMc');
    console.log('First two segments of the transcript:', transcript.slice(0, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
