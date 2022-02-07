/** Removes nobreak and zero-width spaces */
export function cleanWhitespaceChars(text: string, nbsp = ' '): string {
  return text.replace(/\u00A0/g, nbsp).replace(/[\u200B-\u200D\uFEFF]/g, '');
}
