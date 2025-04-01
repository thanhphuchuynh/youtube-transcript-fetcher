import { YoutubeTranscript, formatErrorMessage } from '../src';

/**
 * Helper function to display transcript segments
 */
function displayTranscript(segments: any[], title: string) {
  console.log('\n' + formatErrorMessage(
    `🎯  ${title}\n\n` +
    segments.slice(0, 3).map(s => 
      `${s.offset}s → ${s.offset + s.duration}s  [${s.lang}]\n` +
      `  "${s.text}"`
    ).join('\n\n')
  ));
}

async function main() {
  try {
    console.log(formatErrorMessage('🎬  YouTube Transcript Examples\n\nDemonstrating various ways to fetch and handle transcripts'));

    // Example 1: Fetch transcript with default language
    const transcript1 = await YoutubeTranscript.fetchTranscript(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    displayTranscript(transcript1, 'Default Language Transcript');

    // Example 2: Fetch transcript in Spanish
    const transcript2 = await YoutubeTranscript.fetchTranscript(
      'dQw4w9WgXcQ', // Can use video ID directly
      { lang: 'es' }
    );
    displayTranscript(transcript2, 'Spanish Language Transcript');

    // Example 3: Error Handling Examples
    console.log('\n' + formatErrorMessage('🔍  Error Handling Examples\n'));

    // Invalid video ID
    try {
      await YoutubeTranscript.fetchTranscript('invalid-id');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    // Non-existent language
    try {
      await YoutubeTranscript.fetchTranscript('dQw4w9WgXcQ', { lang: 'xx' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('\n' + error.message);
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error('\n' + error.message);
    }
  }
}

// Run the examples
main().catch(error => {
  if (error instanceof Error) {
    console.error('\n' + error.message);
  }
});
