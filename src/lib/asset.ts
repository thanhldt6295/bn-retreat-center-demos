/** URL of a file in /public, correct under any base path (GitHub Pages serves from /<repo>/). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
