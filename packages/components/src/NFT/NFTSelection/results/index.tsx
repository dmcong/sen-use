import { searchNFTType } from '../../NFTSelection'
import ListCollections from './listCollections'
import ListNFTs from './listNFTs'

export type ResultsProps = {
  searchNFTby: searchNFTType
  searchText: string
  hiddenUnknownNFTs?: boolean
  onSelect: (mintAddress: string) => void
  collectionAddress?: string[]
  selectedNFTs?: string[]
}
const Results = ({
  searchNFTby,
  searchText,
  hiddenUnknownNFTs,
  onSelect,
  collectionAddress,
  selectedNFTs,
}: ResultsProps) => {
  return searchNFTby === searchNFTType.nfts ? (
    <ListNFTs
      hiddenUnknownNFTs={hiddenUnknownNFTs}
      searchText={searchText}
      onSelect={onSelect}
      collectionAddress={collectionAddress}
      selectedNFTs={selectedNFTs}
    />
  ) : (
    <ListCollections searchText={searchText} onSelect={onSelect} />
  )
}

export default Results
