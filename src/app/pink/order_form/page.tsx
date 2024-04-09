'use client';
import React, {useState} from "react";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {SendTransactionRequest} from "@tonconnect/sdk";
import {Address, toNano,} from "@ton/core";
import {beginCell, TonClient, TupleItem} from "@ton/ton";
import {
    ENDPOINT_MAINNET_RPC,
    ENDPOINT_TESTNET_RPC,
    isMainnet,
    pink_market_address,
    pink_mkt_create_sell_order_gas_fee,
    t404_jetton_master_address
} from "@/constant/trc404_config";
import {v4 as uuidv4} from "uuid";
import {log404} from "@/utils/util404";

function generateUnique64BitInteger(): bigint {
    // 生成 UUID，并去除横杠
    const uuid: string = uuidv4().replace(/-/g, '');
    // 取 UUID 的前 64 位
    const uuid64Bit: string = uuid.substr(0, 16);
    // 将 16 进制字符串转换为 BigInt
    return BigInt('0x' + uuid64Bit);
}

function buildTx(order: SellOrderInfo): SendTransactionRequest {
    let op_transfer_ft = 0xf8a7ea5;
    let op_deploy_pink_order_sale = 0x86c24f54;
    let forward_amount = "0.085";

    if (order.isFullData
        && order.sellUnitPrice
        && order.extBizId
        && order.sellT404Amount
        && order.sellerT404WalletAddress
        && order.orderGasFee
    ) {
        let forward_payload = beginCell()
            .storeUint(op_deploy_pink_order_sale, 32)
            .storeCoins(toNano(order.sellUnitPrice)) //token_price
            .storeUint(order.extBizId, 64) //必须确保 external_order_id 全局唯一
            .endCell().beginParse();

        let body = beginCell()
            .storeUint(op_transfer_ft, 32)  //op_code
            .storeUint(order.extBizId, 64)  //query_id
            .storeCoins(toNano(order.sellT404Amount)) // the T404 jetton_amount you want to transfer
            .storeAddress(order.pinkMarketAddress)    //to_address, pink_market_address
            .storeAddress(order.sellerWalletAddress)  //response_destination
            .storeBit(false)    //no custom payload
            .storeCoins(toNano(forward_amount))    //forward amount 0.085
            .storeSlice(forward_payload)   // forward payload
            .endCell();

        let bodyBase64 = body.toBoc().toString("base64");

        return {
            // The transaction is valid for 10 minutes from now, in unix epoch seconds.
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
                {
                    address: order.sellerT404WalletAddress,
                    amount: "" + toNano(order.orderGasFee),
                    payload: bodyBase64,
                },
            ],
        };
    } else {
        return {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [],
        };
    }


}

interface SellOrderInfo {
    isFullData: boolean;
    pinkMarketAddress?: Address;
    sellerWalletAddress?: Address;
    sellerT404WalletAddress?: string;
    orderGasFee?: number;
    sellT404Amount?: number;
    sellUnitPrice?: number;
    extBizId?: bigint;
}

export default function Page({params}: { params: { lang: string } }) {

    let initOrder: SellOrderInfo = {isFullData: false};
    const [sellOrderInfo, setSellOrderInfo] = useState<SellOrderInfo>(initOrder);
    const [tx, setTx] = useState(buildTx(sellOrderInfo));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();
    const [logMsg404, setLogMsg404] = useState("");

    const formSchema = z.object({
        sellAmount: z.coerce.number().gte(0, {
            message: "T404 sell amount must be greater than 0.",
        }),
        unitPrice: z.coerce.number().gte(0, {
            message: "Unit price must be greater than 0.",
        }),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {sellAmount: 1, unitPrice: 1},
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        try {
            let loginWalletAddress = wallet?.account?.address;
            console.info("0 loginWalletAddress=", loginWalletAddress)
            console.info("0 loginWalletAddress=", Address.parseRaw(loginWalletAddress + "").toString())
            if (loginWalletAddress) {

                // get T404 wallet address
                const client = new TonClient(
                    {
                        endpoint: isMainnet ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
                    });

                let ownerAddressCell = beginCell().storeAddress(Address.parse(loginWalletAddress)).endCell();
                let stack: TupleItem[] = [];
                stack.push({type: 'slice', cell: ownerAddressCell});
                const master_tx = await client.runMethod(
                    Address.parse(t404_jetton_master_address), 'get_wallet_address', stack);
                let jetton_master_result = master_tx.stack;
                let jettonWalletAddress = jetton_master_result.readAddress();
                console.info("jettonWalletAddress", jettonWalletAddress.toString())
                // get T404 wallet address end

                // save to DB


                // save to DB end


                console.info("1", loginWalletAddress)
                let initOrder: SellOrderInfo = {isFullData: true};
                initOrder.pinkMarketAddress = Address.parse(pink_market_address);
                initOrder.sellerWalletAddress = Address.parse(loginWalletAddress);
                initOrder.sellerT404WalletAddress = jettonWalletAddress.toString();
                initOrder.orderGasFee = pink_mkt_create_sell_order_gas_fee;
                initOrder.sellT404Amount = values.sellAmount;
                initOrder.sellUnitPrice = values.unitPrice;
                let extBizId = generateUnique64BitInteger();
                console.info("extBizId", extBizId)
                console.info("extBizId", extBizId)
                console.info("extBizId", extBizId)
                console.info("extBizId", extBizId)
                initOrder.extBizId = extBizId;

                let sendTransactionRequest = buildTx(initOrder);
                setTx(sendTransactionRequest);
                tonConnectUi.sendTransaction(sendTransactionRequest).catch(e => {
                    console.error(e)
                });
            } else {
                if (!tonConnectUi.connected) {
                    return tonConnectUi.openModal();
                } else {
                    console.error("  connected, but not have wallet address?????????????")
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                log404("" + error.message, logMsg404, setLogMsg404);
            }
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className={"px-6"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="sellAmount"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Sell Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How many T404 you want to sell.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="unitPrice"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Unit Price in Toncoin</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="" {...field} />
                                </FormControl>
                                <FormDescription>
                                    How much is a T404 for Toncoin?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}
