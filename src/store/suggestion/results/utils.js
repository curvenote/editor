export function getYouTubeId(url) {
    var s = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return s[2] !== undefined ? s[2].split(/[^0-9a-z_-]/i)[0] : s[0];
}
export function getMiroId(url) {
    var s = url.split(/(\/board\/|embed\/)/);
    return s[2] !== undefined ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}
export function getLoomId(url) {
    var s = url.split(/(\/share\/|\/embed\/)/);
    return s[2] !== undefined ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}
export function getVimeoId(url) {
    var s = url.replace(/\/video/, '').split(/(vimeo\.com\/)/);
    return s[2] !== undefined ? s[2].split(/[^0-9a-z_\-=]/i)[0] : s[0];
}
//# sourceMappingURL=utils.js.map