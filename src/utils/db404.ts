import {getRequestContext} from '@cloudflare/next-on-pages'
import {
    PINK_SELL_ORDER_CREATE,
    REF_USER_LIST_FOUND,
    USER_COUNT_FOUND,
    USER_CREATED,
    USER_CREATED_WITH_REF
} from './static404';
import {USER_FOUND} from "@/utils/static404";
import {generateRefCode, uuid404} from "@/utils/util404";
import {Result404, SellOrderInfo, User404} from "@/utils/interface404";


function db404() {
    if (process.env.NODE_ENV === "development") {
        const {env} = getRequestContext();
        return env.DB;
    }
    // Production
    return process.env.DB;
}


export async function queryUser(tgId: string): Promise<Result404> {
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    // @ts-ignore
    let d1Response = await db404().prepare('select * from TrcUser where tgId=?').bind(tgId).all();
    if (d1Response.success) {
        result.success = d1Response.success;
        if (d1Response.results.length >= 1) {
            result.code = USER_FOUND;
            let {tgId, tgUsername, refCode} = d1Response.results[0];
            result.result = {tgId, tgUsername, refCode} as User404;
        }
    }
    return result;
}


export async function queryUserCount(): Promise<Result404> {
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    // @ts-ignore
    let d1Response = await db404().prepare('select count(tgId) as userCount from TrcUser').all();
    if (d1Response.success) {
        result.success = d1Response.success;
        if (d1Response.results.length >= 1) {
            result.code = USER_COUNT_FOUND;
            let {userCount} = d1Response.results[0];
            result.result = userCount as number;
        }
    }
    return result;
}

export async function queryUserByRefCode(refCode: string): Promise<Result404> {
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    if (!refCode || refCode.length < 3) {
        return result;
    }

    // @ts-ignore
    let d1Response = await db404().prepare(
        'select * from TrcUser where refCode=?')
        .bind(refCode).all();
    if (d1Response.success) {
        result.success = d1Response.success;
        if (d1Response.results.length >= 1) {
            result.code = USER_FOUND;
            let {tgId, tgUsername} = d1Response.results[0];
            result.result = {tgId, tgUsername} as User404;
        }
    }
    return result;
}

export async function queryUserListByRefTgId(
    refTgId: string,
): Promise<Result404> {
    let result: Result404 = {
        success: false,
        code: "",
        msg: "",
    };
    if (!refTgId || refTgId.length < 3) {
        return result;
    }

    // @ts-ignore
    let d1Response = await db404()
        .prepare(
            "select * from TrcUser where refTgId=?",
        )
        .bind(refTgId)
        .all();
    if (d1Response.success) {
        result.success = d1Response.success;
        if (d1Response.results.length >= 1) {
            result.code = REF_USER_LIST_FOUND;
            let user404List: User404[] = [];
            for (const record of d1Response.results) {
                let {tgId, tgUsername} = record;
                user404List.push({tgId, tgUsername} as User404);
            }
            result.result = user404List;
        }
    }
    return result;
}

export async function createUser(tgId: string, tgUsername: string, ref?: User404): Promise<Result404> {

    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    let userId = uuid404();
    let refCode = generateRefCode(tgUsername);
    let current = Date.now();

    if (ref) {
        // @ts-ignore
        let d1Response: D1Response = await db404().prepare(
            'INSERT INTO TrcUser (userId, tgId, tgUsername, refCode, refTgId, refTgUsername,createBy,createDt) VALUES (?, ?,?,?,?, ?, ?, ?)')
            .bind(userId, tgId, tgUsername, refCode, ref.tgId, ref.tgUsername, tgId, current).run();
        result.success = d1Response.success;
        result.code = USER_CREATED_WITH_REF;
        result.result = {
            tgId,
            tgUsername,
            refCode,
            refTgId: ref.tgId,
            refTgUsername: ref.tgUsername,
        } as User404;
    } else {
        // @ts-ignore
        let d1Response: D1Response = await db404().prepare(
            'INSERT INTO TrcUser (userId, tgId, tgUsername, refCode, createBy,createDt) VALUES (?, ?,?, ?, ?, ?)')
            .bind(userId, tgId, tgUsername, refCode, tgId, current).run();
        result.success = d1Response.success;
        result.code = USER_CREATED;
        result.result = {tgId, tgUsername, refCode} as User404;
    }


    return result;
}

export async function log2db(tgId: string, opCode: string, logs: string) {
    try {
        // @ts-ignore
        const {results} = await db404().prepare(
            "SELECT * FROM Customers WHERE CompanyName = ?"
        )
            .bind("Bs Beverages")
            .all();
    } catch (error) {
    }
}


// ================  Pink Market  =========================


export async function createSellOrder(order: SellOrderInfo): Promise<Result404> {
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };

    let sellOrderId = uuid404();
    let current = Date.now();
    let orderType = "SEPARABLE"; //SEPARABLE, INSEPARABLE
    let orderMode = "FREE";//FREE, CUTOFF
    let status = "INIT"; // INIT, SUBMITTED, PENDING, ONSALE, SOLD, CANCEL

    let d1Response: D1Response = await db404().prepare(
        'INSERT INTO PinkSellOrder (sellOrderId,extBizId,sellerTgId,sellerAddress,sellerT404Address,pinkMarketAddress,pinkOrderSaleAddress,sellAmount,unitPriceInTon,feeNumerator,feeDenominator,orderType,orderMode,status,createBy,createDt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        .bind(sellOrderId, order.extBizId, order.sellerTgId, order.sellerWalletAddress, order.sellerT404WalletAddress, order.pinkMarketAddress, order.pinkOrderSaleAddress, order.sellT404Amount, order.sellUnitPrice, order.feeNumerator, order.feeDenominator, orderType, orderMode, status, order.sellerTgId, current).run();
    result.success = d1Response.success;
    result.code = PINK_SELL_ORDER_CREATE;
    return result;
}

// ================  Pink Market End  =====================
