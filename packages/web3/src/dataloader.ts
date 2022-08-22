const mapCache = new Map<string, any>()

export class DataLoader {
  static load<T extends any>(
    requestKey: string | object,
    callback: () => T,
    force = false,
  ): T {
    const instantId = JSON.stringify(requestKey)
    const cache = mapCache.get(instantId)
    if (cache && !force) return cache

    mapCache.set(instantId, callback())
    return mapCache.get(instantId)
  }
}
