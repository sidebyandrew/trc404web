import React, {CSSProperties, useEffect, useState} from 'react';
import {beginCell, TonClient, TupleItem} from "@ton/ton";
import {
    BASE_NANO_NUMBER,
    BASE_URL,
    ENDPOINT_MAINNET_RPC,
    ENDPOINT_TESTNET_RPC,
    isMainnet,
    t404_jetton_master_address
} from "@/constant/trc404_config";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {Address} from "@ton/core";
import {useTonWallet} from "@tonconnect/ui-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import {BeatLoader} from "react-spinners";
import {CHAIN} from "@tonconnect/sdk";
import {Button} from "@/components/ui/button";
import {ToastAction} from "@/components/ui/toast";
import {useToast} from "@/components/ui/use-toast";
import {REF_USER_LIST_FOUND, Result404} from "@/utils/static404";


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
    const tgInitData = useInitData();

    // const tgInitData = {user: {id: 5499157826, username: ""}};

    function log404(msg: any) {
        if (logMsg404) {
            setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
        } else {
            setLogMsg404(JSON.stringify(msg));
        }
    }

    useEffect(() => {
        async function fetchData() {
            let logUrl;
            try {
                let tgId = tgInitData?.user?.id;
                let tgUsername = tgInitData?.user?.username;
                let urlBase = BASE_URL;
                let urlWithParams = `${urlBase}/api/user?tgId=${tgId}&tgUsername=${tgUsername}&access404=error_code_404`;
                logUrl = urlWithParams;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    log404(urlBase);
                    log404(tgId);
                    log404(tgUsername);
                    return;
                }
                const responseData = await response.json<Result404>();
                log404(responseData.success + "-" + responseData.code);
                if (responseData.success && responseData.code == REF_USER_LIST_FOUND) {
                    let {count} = responseData.result;
                    setUserData(count);
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(logUrl + "" + error.message);
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
                    const jetton_wallet_tx = await client.runMethod(
                        jettonWalletAddress, 'get_wallet_data');
                    let jetton_wallet_result = jetton_wallet_tx.stack;


                    // ds~load_coins(),    ;; jetton_balance
                    // ds~load_msg_addr(),    ;; owner_address
                    // ds~load_msg_addr(),    ;;jetton_master_address
                    // ds~load_ref(),         ;; jetton_wallet_code   Jetton wallet standard end
                    // let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    // let owner_address = jetton_wallet_result.readAddress();
                    // let jetton_master_address = jetton_wallet_result.readAddress();
                    // let jetton_wallet_code = jetton_wallet_result.readCell();
                    // ds~load_ref(),       ;; nft_item_code
                    // let nft_item_code = jetton_wallet_result.readCell();
                    // ds~load_msg_addr(),   ;;nft_collection_address
                    // let nft_collection_address = jetton_wallet_result.readAddress();
                    // ds~load_dict(),       ;;owned_nft_dict
                    // let owned_nft_dict = jetton_wallet_result.readCellOpt();
                    // ds~load_int(item_index_length() + 1),         ;;owned_nft_number
                    // ds~load_uint(item_index_length()),       ;;next_item_index
                    // ds~load_uint(userid_prefix_length()),       ;;user_id  ,because getgems.io only support up to 54 bits for nft_item_index
                    //     ds~load_uint(item_index_length()),         ;;owned_nft_limit
                    // ds~load_coins(),       ;; pending_reduce_ jetton_balance
                    // ds~load_dict() );      ;; pending_burn_nft_queue

                    let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    let owner_address = jetton_wallet_result.readAddress();
                    let jetton_master_address = jetton_wallet_result.readAddress();
                    let jetton_wallet_code = jetton_wallet_result.readCell();
                    let nft_item_code = jetton_wallet_result.readCell();
                    let nft_collection_address = jetton_wallet_result.readAddress();
                    let owned_nft_dict = jetton_wallet_result.readCellOpt();
                    let owned_nft_number = jetton_wallet_result.readBigNumber();
                    let owned_nft_limit = jetton_wallet_result.readBigNumber();
                    let pending_reduce_jetton_balance = jetton_wallet_result.readBigNumber();
                    let pending_burn_nft_queue = jetton_wallet_result.readCellOpt();


                    let jettonBalance: string = Number(Number(jetton_balance_bigint) / BASE_NANO_NUMBER).toFixed(3)
                    setJettonBalance(jettonBalance);
                    setJettonLoading(false);

                    setNftCount("" + owned_nft_number);
                    setNftLoading(false);

                    let nftCollAddress = nft_collection_address.toString({bounceable: true, testOnly: false});
                    setNftCollection(nftCollAddress);

                    log404("jetton:" + jettonBalance + ",NFT:" + owned_nft_number);
                } catch (error) {
                    setJettonBalance("-");
                    setJettonLoading(false);
                    setNftCount("-");
                    setNftLoading(false);
                    log404("Error fetching data:")
                    console.error('Error: Fail to fetch data from TON RPC.');
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
        <div className="p-3">
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

                            >
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </TableFooter>
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
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </TableFooter>
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
                                }}>
                                <svg className="mr-2 h-4 w-4" width="24" height="24" viewBox="0 0 36 36" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M18 2c0 8.837-7.163 16-16 16C2 9.163 9.163 2 18 2zm0 32C9.163 34 2 26.837 2 18c8.837 0 16 7.163 16 16zm16-16c0 8.837-7.163 16-16 16 0-8.837 7.163-16 16-16zM32 4c0 6.627-5.373 12-12 12 0-6.627 5.373-12 12-12z"
                                          fill="currentColor"></path>
                                </svg>
                                Sell</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-end mr-2">
                <Popover>
                    <PopoverTrigger className="text-gray-400">* Notes for Getgems</PopoverTrigger>
                    <PopoverContent>The index of Getgems has a delay, at some time you need to refresh metadata
                        manually at Getgems website.
                    </PopoverContent>
                </Popover>
            </div>


            <div className="flex w-full flex-col pb-20">&nbsp;</div>
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


