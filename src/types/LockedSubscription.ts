export interface LockedSubscription {
    positionId: string,
    purchaseId: number,
    time: string,
    endTime: string,
    coinCode: string,
    amount: string,
    lockPeriod: string,
    type: string,
    sourceAccount: string,
    amtFromSpot: string,
    amtFromFunding: string,
    status: string,
    finished: false,
    priceWhenLocked: null,
    priceWhenFinished: null
}

