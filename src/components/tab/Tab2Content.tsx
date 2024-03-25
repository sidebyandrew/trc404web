import React, {CSSProperties, useEffect, useState} from 'react';
import {beginCell, Dictionary, TonClient, TupleItem} from "@ton/ton";
import {
    BASE_NANO_NUMBER,
    ENDPOINT_MAINNET_RPC,
    ENDPOINT_TESTNET_RPC,
    isMainnet,
    t404_jetton_master_address
} from "@/constant/trc404_config";
import {Address} from "@ton/core";
import {useTonWallet} from "@tonconnect/ui-react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import Image from "next/image";
import {BeatLoader} from "react-spinners";
import {CHAIN} from "@tonconnect/sdk";
import {Button} from "@/components/ui/button";

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


    const wallet = useTonWallet();


    useEffect(() => {
        if (wallet?.account) {
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

                    // ds~load_coins(),      ;; jetton_balance
                    // ds~load_msg_addr(),    ;; owner_address
                    // ds~load_msg_addr(),    ;;jetton_master_address
                    // ds~load_ref(),        ;; jetton_wallet_code
                    // ds~load_msg_addr(),   ;;nft_collection_address
                    // ds~load_dict(),        ;;owned_nft_dict
                    // ds~load_uint(64)         ;;owned_nft_number
                    let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    let owner_address = jetton_wallet_result.readAddress();
                    let jetton_master_address = jetton_wallet_result.readAddress();
                    let jetton_wallet_code = jetton_wallet_result.readCell();
                    let nft_collection_address = jetton_wallet_result.readAddress();
                    let owned_nft_dict = jetton_wallet_result.readCellOpt();
                    let owned_nft_number = jetton_wallet_result.readBigNumber();

                    console.info(
                        "jetton_balance_bigint=", jetton_balance_bigint,
                        "owner_address=", owner_address,
                        "jetton_master_address=", jetton_master_address,
                        "nft_collection_address=", nft_collection_address,
                        "owned_nft_dict=", owned_nft_dict,
                        "owned_nft_number=", owned_nft_number);

                    let jettonBalance: string = Number(Number(jetton_balance_bigint) / BASE_NANO_NUMBER).toFixed(3)
                    console.info(jettonBalance);

                    let dictSlice = owned_nft_dict?.beginParse();
                    let loadDictDirect = dictSlice?.loadDictDirect(Dictionary.Keys.Int(64), Dictionary.Values.BitString(0));
                    console.info(loadDictDirect)
                    let keys = loadDictDirect?.keys();
                    if (keys) {
                        setNftCount("" + keys.length)
                        setNftLoading(false);
                        for (const key of keys) {
                            console.info(key)

                            stack.push({type: 'int', value: BigInt(key)});
                            const nft_address_query_tx = await client.runMethod(
                                nft_collection_address, 'get_nft_address_by_index', stack);
                            let nft_address_query_result = nft_address_query_tx.stack;
                            let address = nft_address_query_result.readAddress();
                            console.info(address.toString({bounceable: false, testOnly: true}))
                        }
                    }

                    setJettonBalance(jettonBalance);
                    setJettonLoading(false);
                } catch (error) {
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


    return (
        <div className="p-2">
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
                        <TableHead className="text-right">Price</TableHead>
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
                        <TableCell className="text-right">-</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div className={"text-red-500"}>
                <div className="">
                    {isMainnet && wallet?.account.chain == CHAIN.TESTNET && "Warning: Need to Connect Mainnet."}
                    {!isMainnet && wallet?.account.chain == CHAIN.MAINNET && "Warning: Need to Connect Testnet."}
                </div>
            </div>

            <div className="mt-6 text-xl font-bold">404 Collectibles</div>
            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">
                            #
                        </TableHead>
                        <TableHead>NFT</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead className="text-right">Action</TableHead>
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
                        <TableCell className="text-right">
                            <Button variant="outline">Sell</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};


