import {queryListedSellOrder,} from '@/utils/db404';
import {Result404} from "@/utils/interface404";

export const runtime = 'edge'

export async function GET(request: Request) {
    let result404: Result404 = {success: false}
    try {
        const {searchParams} = new URL(request.url);
        let access404 = searchParams.get('access404');
        if (access404 != "error_code_404") {
            result404.code = "ERROR: 404";
            return Response.json(result404);
        }

        let queryRes = await queryListedSellOrder();
        return Response.json(queryRes);
    } catch (error) {
        if (error instanceof Error) {
            result404.msg = error.message;
        }
        return Response.json(result404);
    }
}
