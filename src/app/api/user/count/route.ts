import {Result404, USER_COUNT_FOUND} from '@/utils/static404';
import {queryUserCount,} from '@/utils/util404';

export const runtime = 'edge'

export async function GET(request: Request) {
    let result404: Result404 = {success: false}
    try {
        const {searchParams} = new URL(request.url);
        let access404 = searchParams.get('access404');
        if (access404 != "error_code_404") {
            throw new Error("access denied.");
        }

        let queryRes = await queryUserCount();
        if (queryRes.success && USER_COUNT_FOUND == queryRes.code) {
            result404.success = true;
            result404.code = USER_COUNT_FOUND;
            let userCount = queryRes.result as number;
            result404.success = true;
            result404.code = USER_COUNT_FOUND;
            result404.result = {count: userCount};
        }

        return Response.json(result404);
    } catch (error) {
        if (error instanceof Error) {
            result404.msg = error.message;
        }
        return Response.json(result404);
    }
}
