import lunr, { Index } from 'lunr'
import { MetadataDataType } from '../../metaplex'

class SearchEngine {
  nfts: MetadataDataType[]
  index: Index

  constructor(nfts: MetadataDataType[]) {
    this.nfts = nfts
    this.index = lunr(function () {
      // Document id
      this.ref('mint')
      // Indexed document
      this.field('mint')
      this.field('name')
      this.field('symbol')

      // Add data
      nfts.map((nft) => {
        return this.add({
          mint: nft.mint,
          name: nft.data.name,
          symbol: nft.data.symbol,
        })
      })
    })
  }

  search = (keyword: string, limit = 100) => {
    let filterNFTs: string[] = []
    if (!keyword) return []
    const fuzzy = `${keyword} *${keyword}*`
    this.index.search(fuzzy).forEach(({ ref }) => {
      if (!filterNFTs.includes(ref)) return filterNFTs.push(ref)
    })
    return this.nfts
      .filter((nft) => filterNFTs.includes(nft.mint))
      .slice(0, limit)
  }
}

export default SearchEngine
