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
