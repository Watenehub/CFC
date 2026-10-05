// Feeds the blurred backdrop behind .fit-media images.
export const fitStyle = (src) => ({ '--fit-src': `url("${String(src).replace(/["\\\n]/g, '')}")` })
