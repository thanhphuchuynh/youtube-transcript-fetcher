import { jest } from '@jest/globals';
import { formatErrorMessage } from '../format.js';

describe('formatErrorMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format error message with box border', () => {
    const message = 'Test error message';
    const formattedMessage = formatErrorMessage(message);
    
    expect(formattedMessage).toContain('╭─────────────── YouTube Transcript Error ───────────────╮');
    expect(formattedMessage).toContain('Test error message');
    expect(formattedMessage).toContain('╰────────────────────────────────────────────────────────╯');
  });

  it('should handle empty message', () => {
    const formattedMessage = formatErrorMessage('');
    
    expect(formattedMessage).toContain('╭─────────────── YouTube Transcript Error ───────────────╮');
    expect(formattedMessage).toContain('╰────────────────────────────────────────────────────────╯');
  });

  it('should handle multiline messages', () => {
    const message = 'Line 1\nLine 2';
    const formattedMessage = formatErrorMessage(message);
    
    expect(formattedMessage).toContain('Line 1\nLine 2');
    expect(formattedMessage.split('\n').length).toBeGreaterThan(3); // Header, content, footer
  });
});
