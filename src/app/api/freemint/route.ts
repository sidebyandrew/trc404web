import type {NextRequest} from 'next/server'

export const runtime = 'edge'


export async function GET(request: NextRequest) {
    let responseText = 'Hello World'


    // In the edge runtime you can use Bindings that are available in your application
    // (for more details see:
    //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
    //    - https://developers.cloudflare.com/pages/functions/bindings/
    // )
    //
    // KV Example:
    // const myKv = getRequestContext().env.MY_KV
    // await myKv.put('suffix', ' from a KV store!')
    // const suffix = await myKv.get('suffix')
    // responseText += suffix

    const client = new TonClient(
        {
            endpoint: "https://sandbox.tonhubapi.com/jsonRPC",
        });

    const master_tx = await client.runMethod(
        Address.parse(t404_jetton_master_address), 'get_jetton_data');

    let master_result = master_tx.stack;
    let total_supply = master_result.readBigNumber();
    let mintable = master_result.readBoolean();
    let owner = master_result.readAddress();
    let content = master_result.readCell();
    let jetton_wallet_code = master_result.readCell();
    let nft_collection_address = master_result.readAddress();
    let freemint_flag = master_result.readNumber();
    let freemint_current_supply = master_result.readBigNumber();
    let freemint_max_supply = master_result.readBigNumber();
    let freemint_price = master_result.readBigNumber();

    console.log('get_jetton_data freemint_current_supply:', freemint_current_supply,
        ',freemint_max_supply:', freemint_max_supply, ",freemint_price", freemint_price,
        ',freemint_flag:', freemint_flag);

    return new Response(responseText)
}
