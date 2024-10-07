import NodeCache from 'node-cache'

const cache = new NodeCache()

export const blacklist = token => {
  cache.set(token, true, 86400)
}

export const isBlacklisted = token => cache.has(token)
