"use client";
import React, {useEffect, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {useRouter} from "next/navigation";
import {BASE_URL, isMainnet, pink_mkt_cancel_sell_order_gas_fee} from "@/constant/trc404_config";
import {addressTrim, calculateTotal, decimalFriendly, log404} from "@/utils/util404";
import {Result404, SellOrderInfo} from "@/utils/interface404";
import {PINK_SELL_ORDER_LIST_FOUND} from "@/utils/static404";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Address, Cell, toNano} from "@ton/core";
import {SendTransactionRequest} from "@tonconnect/sdk";
import {beginCell} from "@ton/ton";

const orders = [
    {
        seller: "UQDx..Xj87",
        t404Amount: "10",
        unitPrice: "28",
        totalValue: "280",
        status: "Sold",
    },
    {
        seller: "UQ12..Xjt-",
        t404Amount: "20",
        unitPrice: "35",
        totalValue: "700",
        status: "Canceled",
    },
    {
        seller: "UQ12..XjuO",
        t404Amount: "2",
        unitPrice: "37",
        totalValue: "74",
        status: "Canceled",
    },
    {
        seller: "UQ12..Xjxf",
        t404Amount: "8",
        unitPrice: "50",
        totalValue: "400",
        status: "Sold",
    },
]

export default function Tab3Marketplace() {
    // /* todo remove tma */
    const tgInitData = useInitData();

    // const tgInitData = {user: {id: 5499157826, username: ""}};

    const router = useRouter();
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();
    const [jettonWallet, setJettonWallet] = useState("");
    let [jettonLoading, setJettonLoading] = useState(true);

    const [sellOrderList, setSellOrderList] = useState<SellOrderInfo[]>([]);
    const [mySellOrderList, setMySellOrderList] = useState<SellOrderInfo[]>([]);
    const [historySellOrderList, setHistorySellOrderList] = useState<SellOrderInfo[]>([]);
    const [logMsg404, setLogMsg404] = useState("");
    const [listedChanged, setListedChanged] = useState("");
    const [myOrderChanged, setMyOrderChanged] = useState("");
    const {toast} = useToast();


    useEffect(() => {
        async function fetchData() {
            let logUrl;
            try {
                let urlWithParams = `${BASE_URL}/api/pink/listed?access404=error_code_404`;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    log404(urlWithParams, logMsg404, setLogMsg404);
                    return;
                }
                const responseData = await response.json<Result404>();
                log404(responseData.success + "-" + responseData.code, logMsg404, setLogMsg404);
                if (responseData.success && responseData.code == PINK_SELL_ORDER_LIST_FOUND) {
                    setSellOrderList(responseData.result)
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(logUrl + "" + error.message, logMsg404, setLogMsg404);
                }
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [listedChanged]);

    useEffect(() => {
        async function fetchData() {
            let logUrl;

            try {
                let loginWallet = wallet?.account?.address;
                console.info("0 loginWalletAddress=", loginWallet)
                if (loginWallet) {
                    let loginWalletAddress = Address.parse(loginWallet).toString({
                        bounceable: false,
                        testOnly: !isMainnet
                    });

                    let tgId = tgInitData?.user?.id;
                    let urlWithParams = `${BASE_URL}/api/pink/my_orders?tgId=${tgId}&loginWalletAddress=${loginWalletAddress}&access404=error_code_404`;
                    const response = await fetch(urlWithParams);
                    if (!response.ok) {
                        log404(urlWithParams, logMsg404, setLogMsg404);
                        return;
                    }
                    const responseData = await response.json<Result404>();
                    log404(responseData.success + "-" + responseData.code, logMsg404, setLogMsg404);
                    if (responseData.success && responseData.code == PINK_SELL_ORDER_LIST_FOUND) {
                        setMySellOrderList(responseData.result)
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(logUrl + "" + error.message, logMsg404, setLogMsg404);
                }
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [myOrderChanged]);

    useEffect(() => {
        async function fetchData() {
            let logUrl;

            try {
                let loginWallet = wallet?.account?.address;
                console.info("0 loginWalletAddress=", loginWallet)
                if (loginWallet) {
                    let loginWalletAddress = Address.parse(loginWallet).toString({
                        bounceable: false,
                        testOnly: !isMainnet
                    });

                    let tgId = tgInitData?.user?.id;
                    let urlWithParams = `${BASE_URL}/api/pink/history?tgId=${tgId}&loginWalletAddress=${loginWalletAddress}&access404=error_code_404`;
                    const response = await fetch(urlWithParams);
                    if (!response.ok) {
                        log404(urlWithParams, logMsg404, setLogMsg404);
                        return;
                    }
                    const responseData = await response.json<Result404>();
                    log404(responseData.success + "-" + responseData.code, logMsg404, setLogMsg404);
                    if (responseData.success && responseData.code == PINK_SELL_ORDER_LIST_FOUND) {
                        setHistorySellOrderList(responseData.result)
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(logUrl + "" + error.message, logMsg404, setLogMsg404);
                }
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    async function clickBuy(sellOrderId: string) {
        let order = sellOrderList.find(o => {
            return o.sellOrderId == sellOrderId
        });

        if (order && order.sellAmount && order.unitPriceInTon
            && order.pinkOrderSaleAddress && order.extBizId
            && order.sellerAddress && wallet?.account?.address
        ) {
            if (Address.parse(order.sellerAddress).equals(Address.parse(wallet?.account?.address))) {
                quickToast("Oops", "You cannot buy your own order. Do you want to cancel it?");
                return;
            }

            let buyerPayTonAmt = order.sellAmount * order.unitPriceInTon + 0.5;

            let op_buy = 0x1ee6bf43;
            let payloadCell = beginCell().storeUint(op_buy, 32)  //op_code
                .storeUint(BigInt(order.extBizId), 64)  //query_id
                .storeCoins(toNano(order.sellAmount))  //buyAmount
                .endCell();
            let payloadBase64 = payloadCell.toBoc().toString("base64");

            let tx: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: order.pinkOrderSaleAddress,
                        amount: "" + toNano(buyerPayTonAmt),
                        payload: payloadBase64,
                    },
                ],
            };

            let buyTx = await tonConnectUi.sendTransaction(tx);
            let txCells = Cell.fromBoc(Buffer.from(buyTx.boc, 'base64'));
            console.info(txCells)
            let tgId = tgInitData?.user?.id;
            if (txCells && txCells[0] && tgId) {
                let urlWithParams = `${BASE_URL}/api/sell_order/update_state?tgId=${tgId}&extBizId=${order.extBizId}&status=SOLD&access404=error_code_404`;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    setListedChanged(order.extBizId);
                    log404("SOLD", logMsg404, setLogMsg404);
                    return;
                }
            }

        } else {
            errorToast('SELL ORDER NOT FOUND WITH ID:' + sellOrderId);
        }
    }

    async function clickCancel(sellOrderId: string) {
        let order = sellOrderList.find(o => {
            return o.sellOrderId == sellOrderId
        });

        if (order && order.sellAmount && order.unitPriceInTon
            && order.pinkOrderSaleAddress && order.extBizId) {

            let op_cancel_order = 0x68b4959e;
            let payloadCell = beginCell().storeUint(op_cancel_order, 32)  //op_code
                .storeUint(BigInt(order.extBizId), 64)  //query_id
                .endCell();
            ;
            let payloadBase64 = payloadCell.toBoc().toString("base64");

            let tx: SendTransactionRequest = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: order.pinkOrderSaleAddress,
                        amount: "" + toNano(pink_mkt_cancel_sell_order_gas_fee),
                        payload: payloadBase64,
                    },
                ],
            };

            let cancelTx = await tonConnectUi.sendTransaction(tx);
            let txCells = Cell.fromBoc(Buffer.from(cancelTx.boc, 'base64'));

            let tgId = tgInitData?.user?.id;
            if (txCells && txCells[0] && tgId) {
                let urlWithParams = `${BASE_URL}/api/sell_order/update_state?tgId=${tgId}&extBizId=${order.extBizId}&status=CANCELED&access404=error_code_404`;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    setMyOrderChanged(order.extBizId);
                    log404("CANCELED", logMsg404, setLogMsg404);
                    return;
                }
            }
        } else {
            errorToast('SELL ORDER NOT FOUND WITH ID:' + sellOrderId);
        }
    }

    function quickToast(title: string, description: string) {
        toast({
            title: title,
            description: description,
            action: (
                <ToastAction
                    altText="OK">OK</ToastAction>
            ),
        });
    }

    function errorToast(errorCode: string) {
        quickToast("Congratulation", `You find a bug. Contact us pls. Error Code:[${errorCode}]`);
    }

    return (
        <div className="p-3">
            <div className="mb-3 text-2xl font-bold">TRC-404 Pink Market <div
                className="text-gray-400 text-sm">(Under construction)</div></div>

            <Tabs defaultValue="listed" className="mx-auto">
                <TabsList>
                    <TabsTrigger value="listed">Listed</TabsTrigger>
                    <TabsTrigger value="myOrders">My Orders</TabsTrigger>
                    <TabsTrigger value="history">My History</TabsTrigger>
                </TabsList>
                <TabsContent value="listed" className="">
                    <div className="  ">
                        <Button variant="blue" className="flex ml-auto"
                                onClick={() => {
                                    router.push('/pink/order_form');
                                }}
                        >New Order</Button>
                    </div>

                    {/*  orders  */}
                    <Table>
                        <TableCaption>Sort by unit price. </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead className="w-[100px]">Seller</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sellOrderList.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell
                                        className="font-extralight text-sm">{addressTrim(order.sellerAddress)}</TableCell>
                                    <TableCell>{decimalFriendly(order.sellAmount)}</TableCell>
                                    <TableCell>{decimalFriendly(order.unitPriceInTon)}</TableCell>
                                    <TableCell
                                        className="">{calculateTotal(order.sellAmount, order.unitPriceInTon)}</TableCell>
                                    <TableCell className="ml-auto">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                if (order.sellOrderId) {
                                                    clickBuy(order.sellOrderId);
                                                } else {
                                                    errorToast('SELL ORDER ID NOT FOUND');
                                                }
                                            }}
                                        >
                                            Buy
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-20">&nbsp;</div>
                    {/*  orders end  */}

                </TabsContent>
                <TabsContent value="myOrders">
                    <Table>
                        <TableCaption>List the last 20 records by default.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mySellOrderList.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell>{decimalFriendly(order.sellAmount)}</TableCell>
                                    <TableCell>{decimalFriendly(order.unitPriceInTon)}</TableCell>
                                    <TableCell
                                        className="">{calculateTotal(order.sellAmount, order.unitPriceInTon)}</TableCell>
                                    <TableCell className="">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                if (order.sellOrderId) {
                                                    clickCancel(order.sellOrderId);
                                                } else {
                                                    errorToast('SELL ORDER ID NOT FOUND');
                                                }
                                            }}
                                        >
                                            Cancel</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>

                </TabsContent>
                <TabsContent value="history">
                    <Table>
                        <TableCaption>List the last 20 records by default.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historySellOrderList.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell>{decimalFriendly(order.sellAmount)}</TableCell>
                                    <TableCell>{decimalFriendly(order.unitPriceInTon)}</TableCell>
                                    <TableCell
                                        className="">{calculateTotal(order.sellAmount, order.unitPriceInTon)}</TableCell>
                                    <TableCell className="">
                                        <Badge
                                            variant={order.status == 'CANCELED' ? 'destructive' : 'secondary'}>{order.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>
                </TabsContent>
            </Tabs>


            <div className="flex w-full flex-col pb-20">&nbsp;</div>
            <div className="mt-20  text-gray-600 text-center">
                <Popover>
                    <PopoverTrigger className="text-gray-400">The trend is your friend.</PopoverTrigger>
                    <PopoverContent
                        className={"w-[300px] break-all"}>
                        <div className={"break-all"}>{logMsg404}</div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex w-full flex-col pb-10">&nbsp;</div>

        </div>
    );
};

