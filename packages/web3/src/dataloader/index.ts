import { IRequestQueue, RequestQueue } from './request'

const mapCache = new Map<string, any>()

export class DataLoader {
  static singleInstance: SingleFlight

  private static getSingleFlight(): SingleFlight {
    if (this.singleInstance) return this.singleInstance
    let newSingleFlight = new SingleFlight()
    this.singleInstance = newSingleFlight
    return newSingleFlight
  }

  static async load<T>(
    requestKey: string | object,
    callback: () => Promise<T>,
    force = false,
  ): Promise<T> {
    if (typeof requestKey === 'object') requestKey = JSON.stringify(requestKey)
    let singleFlight = DataLoader.getSingleFlight()
    const newRequest = new RequestQueue(requestKey)
    return singleFlight.load<T>(newRequest, callback, force)
  }
}

class SingleFlight {
  private mapRequestCalling = new Map<string, IRequestQueue>()

  async load<T>(
    newRequest: IRequestQueue,
    callback: () => Promise<T>,
    force: boolean,
  ) {
    const cacheData = mapCache.get(newRequest.key)
    if (cacheData && !force) return cacheData

    let isFetch = false
    let request = this.mapRequestCalling.get(newRequest.key)
    if (!request) {
      request = newRequest
      isFetch = true
      this.mapRequestCalling.set(request.key, request)
    }

    return new Promise((resolve, reject) => {
      if (!request) return reject('Not found request!')
      request.add(resolve, reject)
      if (isFetch) {
        this.fetch<T>(request, callback)
      }
    })
  }

  private fetch<T>(request: IRequestQueue, callback: () => Promise<T>) {
    callback()
      .then((response) => {
        mapCache.set(request.key, response)
        request.resolves(response)
      })
      .catch((error) => {
        mapCache.set(request.key, error)
        request.rejects(error)
      })
      .finally(() => {
        this.mapRequestCalling.delete(request.key)
      })
  }
}
