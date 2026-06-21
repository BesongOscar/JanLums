export function snakeCase(str: string): string {
  return str
    .replace(/[A-Z]/g, (letter, index) => (index === 0 ? letter.toLowerCase() : '_' + letter.toLowerCase()))
    .replace(/[.\s]+/g, '_');
}
