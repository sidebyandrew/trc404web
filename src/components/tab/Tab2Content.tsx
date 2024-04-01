import React, {CSSProperties, useEffect, useState} from 'react';
import {beginCell, Dictionary, TonClient, TupleItem} from "@ton/ton";
import {
    BASE_NANO_NUMBER,
    ENDPOINT_MAINNET_RPC,
    ENDPOINT_TESTNET_RPC,
    isMainnet,
    t404_jetton_master_address
} from "@/constant/trc404_config";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {Address} from "@ton/core";
import {useTonWallet} from "@tonconnect/ui-react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import Image from "next/image";
import {BeatLoader} from "react-spinners";
import {CHAIN} from "@tonconnect/sdk";
import {Button} from "@/components/ui/button";
import {ToastAction} from "@/components/ui/toast";
import {useToast} from "@/components/ui/use-toast";
import {REF_USER_LIST_FOUND, Result404} from "@/utils/static404";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
};
export default function Tab2Asset() {
    const [jettonBalance, setJettonBalance] = useState("");
    let [jettonLoading, setJettonLoading] = useState(true);
    const [nftCount, setNftCount] = useState("");
    let [nftLoading, setNftLoading] = useState(true);
    const [nftCollection, setNftCollection] = useState("");

    const [userData, setUserData] = useState(null);
    const [logMsg404, setLogMsg404] = useState("");


    const wallet = useTonWallet();
    const {toast} = useToast();

    /* todo remove tma */
    // useBackButtonEasy();
    // const tgInitData = useInitData();
    const tgInitData = {user: {id: 5499157826, username: "", firstName: 'Andy', lastName: 'Block'}};

    function log404(msg: any) {
        try {
            setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
        } catch (err) {
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                let tgId = tgInitData?.user?.id;
                let tgUsername = tgInitData?.user?.username;
                let urlBase = "https://trc404web.pages.dev";
                // let url = "https://trc404web.pages.dev";
                let urlWithParams = `${urlBase}/api/user?tgId=${tgId}&tgUsername=${tgUsername}&access404=error_code_404`;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    log404("fetch API, network response was not ok" + urlWithParams);
                    return;
                }
                const responseData = await response.json<Result404>();
                if (responseData.success && responseData.code == REF_USER_LIST_FOUND) {
                    let {count} = responseData.result;
                    setUserData(count);
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(error.message);
                }
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (wallet?.account) {
            if (isMainnet && wallet?.account.chain == CHAIN.TESTNET) {
                toast({
                    title: "Warning",
                    description: "You need to connect mainnet!",
                    action: (
                        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                    ),
                });
                return;
            }

            if (!isMainnet && wallet?.account.chain == CHAIN.MAINNET) {
                toast({
                    title: "Warning",
                    description: "You need to connect testnet!",
                    action: (
                        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                    ),
                });
                return;
            }

            const fetchData = async () => {
                try {
                    const client = new TonClient(
                        {
                            endpoint: isMainnet ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
                        });

                    let ownerAddressCell = beginCell().storeAddress(Address.parse(wallet?.account.address)).endCell();
                    let stack: TupleItem[] = [];
                    stack.push({type: 'slice', cell: ownerAddressCell});
                    const master_tx = await client.runMethod(
                        Address.parse(t404_jetton_master_address), 'get_wallet_address', stack);
                    let jetton_master_result = master_tx.stack;
                    let jettonWalletAddress = jetton_master_result.readAddress();

                    console.info(jettonWalletAddress.toString({testOnly: true}))
                    const jetton_wallet_tx = await client.runMethod(
                        jettonWalletAddress, 'get_wallet_data');
                    let jetton_wallet_result = jetton_wallet_tx.stack;

                    // ds~load_coins(),      ;; jetton_balance
                    // ds~load_msg_addr(),    ;; owner_address
                    // ds~load_msg_addr(),    ;;jetton_master_address
                    // ds~load_ref(),        ;; jetton_wallet_code
                    // ds~load_msg_addr(),   ;;nft_collection_address
                    // ds~load_dict(),        ;;owned_nft_dict
                    // ds~load_uint(64)         ;;owned_nft_number
                    // let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    // let owner_address = jetton_wallet_result.readAddress();
                    // let jetton_master_address = jetton_wallet_result.readAddress();
                    // let jetton_wallet_code = jetton_wallet_result.readCell();
                    // let nft_collection_address = jetton_wallet_result.readAddress();
                    // let owned_nft_dict = jetton_wallet_result.readCellOpt();
                    // let owned_nft_number = jetton_wallet_result.readBigNumber();


                    //
                    // ds~load_coins(),    ;; jetton_balance
                    // ds~load_msg_addr(),    ;; owner_address
                    // ds~load_msg_addr(),    ;;jetton_master_address
                    // ds~load_ref(),         ;; jetton_wallet_code   Jetton wallet standard end
                    let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    let owner_address = jetton_wallet_result.readAddress();
                    let jetton_master_address = jetton_wallet_result.readAddress();
                    let jetton_wallet_code = jetton_wallet_result.readCell();

                    // ds~load_ref(),       ;; nft_item_code
                    let nft_item_code = jetton_wallet_result.readCell();
                    // ds~load_msg_addr(),   ;;nft_collection_address
                    let nft_collection_address = jetton_wallet_result.readAddress();
                    // ds~load_dict(),       ;;owned_nft_dict
                    let owned_nft_dict = jetton_wallet_result.readCellOpt();
                    // ds~load_int(item_index_length() + 1),         ;;owned_nft_number
                    // ds~load_uint(item_index_length()),       ;;next_item_index
                    // ds~load_uint(userid_prefix_length()),       ;;user_id  ,because getgems.io only support up to 54 bits for nft_item_index
                    //     ds~load_uint(item_index_length()),         ;;owned_nft_limit
                    // ds~load_coins(),       ;; pending_reduce_ jetton_balance
                    // ds~load_dict() );      ;; pending_burn_nft_queue


                    // console.info(
                    //     "jetton_balance_bigint=", jetton_balance_bigint,
                    //     "owner_address=", owner_address,
                    //     "jetton_master_address=", jetton_master_address,
                    //     "nft_collection_address=", nft_collection_address,
                    //     "owned_nft_dict=", owned_nft_dict,
                    //     "owned_nft_number=", owned_nft_number);

                    let jettonBalance: string = Number(Number(jetton_balance_bigint) / BASE_NANO_NUMBER).toFixed(3)
                    setJettonBalance(jettonBalance);
                    setJettonLoading(false);

                    let s = nft_collection_address.toString({bounceable: true, testOnly: false});
                    setNftCollection(s);

                    let dictSlice = owned_nft_dict?.beginParse();
                    let loadDictDirect = dictSlice?.loadDictDirect(Dictionary.Keys.Int(64), Dictionary.Values.BitString(0));
                    let keys = loadDictDirect?.keys();
                    if (keys) {
                        setNftCount("" + keys.length);
                        setNftLoading(false);
                        // for (const key of keys) {
                        // console.info(key)

                        // stack.push({type: 'int', value: BigInt(key)});
                        // const nft_address_query_tx = await client.runMethod(
                        //     nft_collection_address, 'get_nft_address_by_index', stack);
                        // let nft_address_query_result = nft_address_query_tx.stack;
                        // let address1 = nft_address_query_result.readAddress();
                        // console.info(address1.toString({bounceable: false, testOnly: true}))
                        // //
                        // //     soft commit
                        // let stack2: TupleItem[] = [];
                        // stack2.push({type: 'int', value: BigInt(key)});
                        // const nft_address_query_tx2 = await client.runMethod(
                        //     nft_collection_address, 'get_nft_address_by_index', stack2);
                        // let nft_address_query_result2 = nft_address_query_tx2.stack;
                        // let nft_item_address2 = nft_address_query_result2.readAddress();
                        // console.log("Item_index ", key, "contract address:", nft_item_address2.toString({
                        //     bounceable: false,
                        //     testOnly: true
                        // }));

                        //        soft commit

                        // }
                    } else {
                        setNftCount("-");
                        setNftLoading(false);
                    }
                } catch (error) {
                    setJettonBalance("-");
                    setJettonLoading(false);
                    setNftCount("-");
                    setNftLoading(false);
                    log404(error)
                    console.error('Error fetching data:', error);
                }
            };

            // Only execute fetchData if running in the browser
            if (typeof window !== "undefined") {
                fetchData().catch(r => {
                    console.error("Sorry, I need window to run." + r)
                });
            }
        }//if (wallet?.account){
    }, []);


    function sellOnGetgems(isMainnet: boolean, wallet: string | undefined, collection: string) {
        if (window && wallet && collection) {
            let friendlyWalletAddress = Address.parse(wallet).toString({testOnly: false, bounceable: true});
            let urlBase = isMainnet ? "https://getgems.io/user/" : "https://testnet.getgems.io/user/";
            let urlTemplate = urlBase +
                `${friendlyWalletAddress}?filter=%7B%22collections%22%3A%5B%22${collection}%22%5D%7D#collected`;
            window.open(urlTemplate);
        } else {
            toast({
                title: "Do you have any T404 NFT to sell? ",
                description: "[Respect to Tonkeeper] Something happened but we don't understand what. ",
                action: (
                    <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                ),
            });
        }
    }

    return (
        <div className="p-6">
            {/*  Points  */}
            <div className="mt-2 text-xl font-bold">404 Honor Points</div>
            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">
                            #
                        </TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Invited Friends</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">
                            <Image src="/icon/best-icon.jpg" height={36} width={36}
                                   alt="pop"/>
                        </TableCell>
                        <TableCell className="font-extralight">calculating</TableCell>
                        <TableCell>
                            {userData ? userData : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                            <Button
                                variant={"outline"}
                                disabled={true}
                                // onClick={() => {
                                //     sellOnGetgems(isMainnet, wallet?.account.address, nftCollection);
                                // }}
                            >
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/*  Points End */}

            <div className=" text-xl font-bold">404 Jettons</div>

            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">
                            #
                        </TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead className="text-center">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium"> <Image src="/logo-circle.png" height={36} width={36}
                                                                   alt="pop"/></TableCell>
                        <TableCell>T404</TableCell>
                        <TableCell>
                            <BeatLoader
                                color={"#ffffff"}
                                loading={jettonLoading}
                                cssOverride={override}
                                size={12}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                            {jettonBalance}
                        </TableCell>
                        <TableCell className="text-center">-</TableCell>
                    </TableRow>
                </TableBody>
            </Table>


            <div className="mt-3 text-xl font-bold">404 Collectibles</div>
            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">
                            #
                        </TableHead>
                        <TableHead>NFT</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium"> <Image src="/vivid.png" height={36} width={36}
                                                                   alt="pop"/></TableCell>
                        <TableCell>404 Replicant NFT</TableCell>
                        <TableCell>
                            <BeatLoader
                                color={"#ffffff"}
                                loading={nftLoading}
                                cssOverride={override}
                                size={12}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                            {nftCount}
                        </TableCell>
                        <TableCell className="text-center">
                            <Button
                                variant={"outline"}
                                disabled={nftLoading}
                                onClick={() => {
                                    sellOnGetgems(isMainnet, wallet?.account.address, nftCollection);
                                }}>Sell</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="flex justify-end mr-2">
                <Popover>
                    <PopoverTrigger className="text-gray-400">* Notes for Getgems</PopoverTrigger>
                    <PopoverContent>The index of Getgems has a delay, at some time you need to refresh metadata
                        manually at Getgems website.
                    </PopoverContent>
                </Popover>
            </div>

            {/*<div className={"text-yellow-500 text-xl"}>*/}
            {/*    <div className=" text-center pt-10">*/}
            {/*        {isMainnet && wallet?.account.chain == CHAIN.TESTNET && "Warning: Need to Connect Mainnet."}*/}
            {/*        {!isMainnet && wallet?.account.chain == CHAIN.MAINNET && "Warning: Need to Connect Testnet."}*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="mt-20 mb-20 text-gray-600 text-center">
                <Popover>
                    <PopoverTrigger className="text-gray-400">It takes money to make money....</PopoverTrigger>
                    <PopoverContent>{logMsg404}
                    </PopoverContent>
                </Popover>

            </div>
        </div>
    );
};


