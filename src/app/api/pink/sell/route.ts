import type {NextRequest} from 'next/server'
import {Result404, SellOrderInfo} from "@/utils/interface404";
import {createSellOrder} from "@/utils/db404";

export const runtime = 'edge'


export async function POST(request: NextRequest) {
    let result404: Result404 = {success: false, code: '', msg: '',};
    try {
        let orderInfo = await request.json<SellOrderInfo>();
        let resultDB = await createSellOrder(orderInfo);
        result404.success = resultDB.success;
        result404.code = resultDB.code;
    } catch (error) {
        result404.code = 'POST SellOrderInfo Error'
        result404.msg = "" + error;
    }
    return Response.json(result404);
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
