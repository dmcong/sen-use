import { useCallback, useEffect, useState } from 'react'
import { net, storage } from '@sentre/senhub'

import { useSortMints } from './useSortMints'
import { useMyMints } from './useMyMints'
import { SOL_ADDRESS } from '../solCard'

const LIMIT_ITEM = 64
const VIEW_PER_PAGE = 8
const LOCAL_STORAGE_ID = `${net}:selected_mints`

export const useRecommendedMints = () => {
  const [recommendedMints, setRecommendedMints] = useState<string[]>([])
  const myMints = useMyMints()
  const sortedMints = useSortMints(myMints)

  const getLimitMints = (mints: string[]) => {
    return mints.splice(0, VIEW_PER_PAGE)
  }

  const getRecommendedMints = useCallback(async () => {
    let mints: string[] = storage.get(LOCAL_STORAGE_ID) || []
    for (const mint of sortedMints) {
      if (mints.length >= VIEW_PER_PAGE) break
      if (mints.includes(mint)) continue
      mints.push(mint)
    }
    mints = mints.filter((mint) => mint !== SOL_ADDRESS)
    return setRecommendedMints(getLimitMints(mints))
  }, [sortedMints])

  const addRecommendMint = useCallback(async (mintAddress: string) => {
    if (mintAddress === SOL_ADDRESS) return

    let mints: string[] = storage.get(LOCAL_STORAGE_ID) || []
    mints = mints.filter((mint) => mint !== mintAddress)
    const newMints = [mintAddress, ...mints].slice(0, LIMIT_ITEM)
    storage.set(LOCAL_STORAGE_ID, newMints)
    return setRecommendedMints(getLimitMints(newMints))
  }, [])

  const removeRecommendMint = useCallback(
    (mintAddress: string) => {
      let mints: string[] = storage.get(LOCAL_STORAGE_ID) || []

      // Put recommendMints from sortedMints to storage mints when storage mints empty
      if (!mints.length) mints = [...recommendedMints]

      const indexOfMint = mints.indexOf(mintAddress)
      if (indexOfMint === -1) return

      mints.splice(indexOfMint, 1)
      storage.set(LOCAL_STORAGE_ID, [...mints])
      return setRecommendedMints(getLimitMints(mints))
    },
    [recommendedMints],
  )

  useEffect(() => {
    getRecommendedMints()
  }, [getRecommendedMints])

  return {
    recommendedMints,
    addRecommendMint,
    removeRecommendMint,
  }
}
