import {v4 as uuidv4} from "uuid";

export function uuid404(): string {
    return uuidv4().replace(/-/g, '');
}


export function log404(msg: any, logMsg404: string, setLogMsg404: any) {
    if (logMsg404) {
        setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
    } else {
        setLogMsg404(JSON.stringify(msg));
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


export function addressTrim(str: any): string {
    if (!str) {
        return "";
    }
    if (str.length <= 8) {
        return str;
    } else {
        const start = str.substring(0, 4);
        const end = str.substring(str.length - 4);
        return `${start}...${end}`;
    }
}


export function calculateTotal(amount: any, unit: any): string {
    if (!amount || !unit) {
        return "";
    }

    if (typeof amount == "number" && typeof unit == "number") {
        const result = amount * unit;
        return decimalFriendly(result);
    } else {
        return "";
    }
}

export function decimalFriendly(num: any): string {

    if (!num) {
        return '';
    }

    try {
        const decimalPlaces = num.toString().split('.')[1]?.length || 0;
        if (decimalPlaces === 0) {
            // 如果是整数，则直接返回整数部分
            return num.toString();
        } else if (decimalPlaces === 1) {
            // 如果只有1位小数，则只显示1位小数
            return parseFloat(num).toFixed(1);
        } else {
            // 如果有多于1位小数，则保留最多两位小数
            return parseFloat(num).toFixed(2);
        }

    } catch (e) {
        console.error("decimalFriendly error:", num);
        return '';
    }
}

