import {Result404} from "@/utils/interface404";
import {updateSellOrderStatus} from "@/utils/db404";

export const runtime = 'edge'

export async function GET(request: Request) {
    let result404: Result404 = {success: false}
    try {
        const {searchParams} = new URL(request.url);
        const tgId = searchParams.get('tgId');
        const extBizId = searchParams.get('extBizId');
        const status = searchParams.get('status');
        let access404 = searchParams.get('access404');
        if (access404 != "error_code_404") {
            result404.code = "ERROR: 404";
            return Response.json(result404);
        }
        if (!tgId) {
            result404.code = "ERROR: tgId 404";
            return Response.json(result404);
        }
        if (!extBizId) {
            result404.code = "ERROR: extBizId 404";
            return Response.json(result404);
        }
        if (!status) {
            result404.code = "ERROR: status 404";
            return Response.json(result404);
        }

        let queryRes = await updateSellOrderStatus(tgId, extBizId, status);
        return Response.json(queryRes);
    } catch (error) {
        if (error instanceof Error) {
            result404.msg = error.message;
        }
        return Response.json(result404);
    }
}
