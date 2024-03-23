import React, {CSSProperties, useEffect, useState} from 'react';
import {beginCell, TonClient, TupleItem} from "@ton/ton";
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

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
};
export default function Tab2Asset() {
    const [jettonBalance, setJettonBalance] = useState("");
    const wallet = useTonWallet();
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (wallet?.account) {
            const fetchData = async () => {
                try {
                    //0:4ea29e0017d44d8760c6d4dd7265fcc5336f2f64d52546302d8e984e11531dd2
                    console.info(wallet?.account.address)

                    let ownerAddCell = beginCell().storeAddress(Address.parse(wallet?.account.address)).endCell();

                    const client = new TonClient(
                        {
                            endpoint: isMainnet ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
                        });

                    let stack: TupleItem[] = [];
                    stack.push({type: 'slice', cell: ownerAddCell});
                    const master_tx = await client.runMethod(
                        Address.parse(t404_jetton_master_address), 'get_wallet_address', stack);
                    let jetton_master_result = master_tx.stack;
                    let jettonWalletAddress = jetton_master_result.readAddress();

                    const jetton_wallet_tx = await client.runMethod(
                        jettonWalletAddress, 'get_wallet_data');
                    let jetton_wallet_result = jetton_wallet_tx.stack;

                    let jetton_balance_bigint = jetton_wallet_result.readBigNumber();
                    console.info(jetton_balance_bigint)
                    let jettonBalance: string = Number(Number(jetton_balance_bigint) / BASE_NANO_NUMBER).toFixed(3)
                    console.info(jettonBalance);
                    setJettonBalance(jettonBalance);
                    setLoading(false);
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
        <div className="p-4">
            <div className="mb-3 text-2xl font-bold">TRC-404 Asset</div>

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
                                loading={loading}
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
        </div>
    );
};


