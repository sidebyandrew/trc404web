import type {NextRequest} from 'next/server'
import {createUser, LoginInfo, queryUser, Result404, USER_FOUND} from "@/utils/util404";

export const runtime = 'edge'


export async function POST(request: NextRequest) {
    let result: Result404 = {
        success: false,
        code: '',
        msg: '',
    };
    try {
        let requestJson = await request.json<LoginInfo>();
        let tgId = requestJson.tgId;
        if (tgId) {
            let queryRes = await queryUser(tgId);
            if (queryRes.success && USER_FOUND == queryRes.code) {
                result.success = true;
                result.code = 'login with existing user'
                result.msg = `tgId ${tgId} founded.`;
            } else {
                result = await createUser(tgId);
            }
        } else {
            result.code = 'login error'
            result.msg = "tgId not found.";
        }
    } catch (error) {
        result.code = 'login error'
        result.msg = "" + error;
    }
    return Response.json(result);
}


// if (requestJson instanceof Array) {
//     console.info("Get a JSONArray...........................");
// }

// In the edge runtime you can use Bindings that are available in your application
// (for more details see:
//    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
//    - https://developers.cloudflare.com/pages/functions/bindings/
// )

// KV Example:
// const myKv = getRequestContext().env.MY_KV
// await myKv.put('suffix', ' from a KV store!')
// const suffix = await myKv.get('suffix')
// responseText += suffix
