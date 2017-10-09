export function stripHtml(str) {
  return str.replace(/<(?:.|\n)*?>/gm, '');
}
