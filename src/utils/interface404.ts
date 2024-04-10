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
    sellOrderId?: string;
    pinkMarketAddress?: string;
    sellerAddress?: string;
    sellerT404Address?: string;
    pinkOrderSaleAddress?: string;
    
    sellAmount?: number;
    unitPriceInTon?: number;
    extBizId?: string;
    sellerTgId?: string;
    sellerTgUsername?: string;
    feeNumerator?: number;
    feeDenominator?: number;
    orderType?: string;
    orderMode?: string;
    status?: string;
    extInfo?: string;
    traceId?: string;
    createBy?: string;
    createDt?: number;
    modifyBy?: string;
    modifyDt?: number;
}
