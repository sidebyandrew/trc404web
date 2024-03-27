import {getRequestContext} from '@cloudflare/next-on-pages'
import {v4 as uuidv4} from 'uuid';

export const USER_FOUND = 'USER_FOUND';

export interface Result404 {
    success: boolean;
    code?: string;
    msg?: string;
    result?: any;
}


export interface LoginInfo {
    tgId: string;
}


export interface RefInfo {
    tgId: string;
    refCode: string;
}


export function uuid404(): string {
    return uuidv4().replace(/-/g, '');
}


export function db404() {
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
            result.msg = `tgId:${tgId}`;
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
    // @ts-ignore
    let d1Response = await db404().prepare(
        'select * from TrcUser where refCode=?')
        .bind(refCode).all()
    if (d1Response.success) {
        result.success = d1Response.success;
        if (d1Response.results.length >= 1) {
            result.code = USER_FOUND;
            result.result = d1Response.results[0]["tgId"] as string;
        }
    }
    return result;
}

export async function createUser(tgId: string, refByTgId?: string): Promise<Result404> {
    console.info("createUser", tgId, refByTgId);
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    let userId = uuid404();
    let refCode = generateRefCode(tgId);
    let current = Date.now();

    if (refByTgId) {
        // @ts-ignore
        let d1Response: D1Response = await db404().prepare(
            'INSERT INTO TrcUser (userId, tgId, refCode, refByTgId, createBy,createDt) VALUES (?, ?,?, ?, ?, ?)')
            .bind(userId, tgId, refCode, refByTgId, tgId, current).run();
        result.success = d1Response.success;
        result.code = ` new user with ref by ${refByTgId}`;
        result.msg = `tgId:${tgId}, refCode:${refCode}`;
    } else {
        // @ts-ignore
        let d1Response: D1Response = await db404().prepare(
            'INSERT INTO TrcUser (userId, tgId, refCode, createBy,createDt) VALUES (?, ?, ?, ?, ?)')
            .bind(userId, tgId, refCode, tgId, current).run();
        result.success = d1Response.success;
        result.code = 'new user';
        result.msg = `tgId:${tgId}, refCode:${refCode}`;
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


/**
 * 根据用户名生成一个唯一推荐码，将用户名的每个字母向后移动2位来得到推荐码，非字母不变
 */
export function generateRefCode(username: string): string {
    const uppercaseUsername = username.toUpperCase();
    let refCode = '';

    for (let i = 0; i < uppercaseUsername.length; i++) {
        const char = uppercaseUsername[i];
        let newChar = char;
        if (char >= 'A' && char <= 'Z') {
            const newCharCode = ((char.charCodeAt(0) - 65 + 2) % 26) + 65;
            newChar = String.fromCharCode(newCharCode);
        }

        refCode += newChar;
    }

    return "T404_" + refCode;
}
