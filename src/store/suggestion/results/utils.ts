// https://gist.github.com/takien/4077195

export function getYouTubeId(url: string) {
  const s = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (s[2] !== undefined) ? s[2].split(/[^0-9a-z_-]/i)[0] : s[0];
}

export function getMiroId(url: string) {
  const s = url.split(/(\/board\/|embed\/)/);
  return (s[2] !== undefined) ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}

export function getLoomId(url: string) {
  const s = url.split(/(\/share\/|\/embed\/)/);
  return (s[2] !== undefined) ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}

export function getVimeoId(url: string) {
  const s = url.replace(/\/video/, '').split(/(vimeo\.com\/)/);
  return (s[2] !== undefined) ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}
