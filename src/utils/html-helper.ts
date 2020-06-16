/**
 * returns the code to be executed to assign a fallback source path on image loading error
 * @param src to assign on error event
 * @return {string}
 */
export function onSrcError(src: string): string {
  // sets the onerror to null to avoid infinite loop if original source is not valid
  return `this.setAttribute('onerror', null);this.setAttribute('src', '${src}');`;
}
