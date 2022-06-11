const AuctionHouse = require('../auction_house/AuctionHouse.model')

const GetAuctionHouse = async (storeOwnerWallet) => {
    const auction_house = await AuctionHouse.findOne({
        where: {creator_wallet: storeOwnerWallet}
    })

    const ah = JSON.parse(JSON.stringify(auction_house))
    if (ah) {
        return ah.auction_house_wallet
    }
    return null
}

module.exports = {
    GetAuctionHouse
}