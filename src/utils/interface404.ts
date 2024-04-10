export interface User404 {
    tgId: string;
    tgUsername: string;
    refCode: string;
    refTgId: string;
    refTgUsername: string;
    refCount?: string;
}


export interface Result404 {
    success: boolean;
    code?: string;
    msg?: string;
    result?: any;
}


export interface SellOrderInfo {
    isFullData: boolean;
    pinkMarketAddress?: string;
    sellerWalletAddress?: string;
    sellerT404WalletAddress?: string;
    pinkOrderSaleAddress?: string;
    orderGasFee?: number;
    sellT404Amount?: number;
    sellUnitPrice?: number;
    extBizId?: string;
    sellerTgId?: string;
    sellerTgUsername?: string;
    feeNumerator?: number;
    feeDenominator?: number;
}
