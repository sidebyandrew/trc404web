
DROP TABLE IF EXISTS PinkSellOrder;
CREATE TABLE IF NOT EXISTS PinkSellOrder
(
    sellOrderId TEXT PRIMARY KEY,
    extBizId  INTEGER,
    sellerTgId  TEXT,
    sellerAddress  TEXT,
    sellerT404Address  TEXT,
    pinkMarketAddress  TEXT,
    totalAmount INTEGER,
    unitPriceInTon INTEGER,
    orderType TEXT,
    orderMode TEXT,
    status    TEXT,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_pink_sell_order_ext_id ON PinkSellOrder(extBizId);
CREATE INDEX IF NOT EXISTS idx_pink_sell_order_tg_id ON PinkSellOrder(sellerTgId);
CREATE INDEX IF NOT EXISTS idx_pink_sell_order_tg_id_address ON PinkSellOrder(sellerTgId, sellerAddress);
CREATE INDEX IF NOT EXISTS idx_pink_sell_order_tg_status ON PinkSellOrder(status);




DROP TABLE IF EXISTS PinkBuyOrder;
CREATE TABLE IF NOT EXISTS PinkBuyOrder(
    buyOrderId TEXT PRIMARY KEY,
    extBizId  INTEGER,
    sellOrderId  TEXT,
    buyerTgId  TEXT,
    buyerAddress  TEXT,
    buyerT404Address  TEXT,
    buyAmount INTEGER,
    unitPriceInTon INTEGER,
    orderType TEXT,
    orderMode TEXT,
    status    TEXT,
    extInfo   TEXT,
    traceId   TEXT,
    createBy  TEXT,
    createDt INTEGER,
    modifyBy  TEXT,
    modifyDt INTEGER
);
CREATE INDEX IF NOT EXISTS idx_pink_buy_order_ext_id ON PinkSellOrder(extBizId);
CREATE INDEX IF NOT EXISTS idx_pink_buy_order_sell_id ON PinkSellOrder(sellOrderId);
CREATE INDEX IF NOT EXISTS idx_pink_buy_order_buyer_id ON PinkSellOrder(buyerTgId);
CREATE INDEX IF NOT EXISTS idx_pink_buy_order_buyer_add_id ON PinkSellOrder(buyerTgId,buyerAddress);
CREATE INDEX IF NOT EXISTS idx_pink_buy_order_buyer_status ON PinkSellOrder(status);