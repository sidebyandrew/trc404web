import React, {useEffect, useState} from 'react';
import {CHAIN, SendTransactionRequest} from "@tonconnect/sdk";
import {TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Address} from "@ton/core";
import {TonClient} from "@ton/ton";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Card, CardFooter,} from "@/components/ui/card"
import Image from 'next/image'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {useMediaQuery} from "@/hooks/use-media-query";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";
import {ENDPOINT_MAINNET_RPC, ENDPOINT_TESTNET_RPC} from "@/constant/trc404";
// @ts-ignore
let baseNanoBigInt: bigint = 1000000000n;
let baseNanoNumber: number = 1000000000;

interface RuntimeEnvInfo {
    isMainnet: boolean;
}

// =======================================================================
// TODO: to change for production
// 20240320 second round
const isMainnet: boolean = false;
export const t404_jetton_master_address: string = "EQCnsUPUV3xnxYHjKsPHOCKB1R8pyShsYqoDH47dkXVdm_mO";
export const t404_jetton_master_address_raw: string = '0:a7b143d4577c67c581e32ac3c7382281d51f29c9286c62aa031f8edd91755d9b';
const defaultMintPrice: number = 2.15;
const roundOffset: number = 1000;
// TODO: to change for production
// =======================================================================


interface MintInfo {
    fetchFormRemote: boolean;
    freemintIsOpen?: boolean;
    freemintMaxSupply?: number;
    freemintCurrentSupply?: number;
    freemintTonPrice?: number;
    progressRate: number;
}


function buildTx(amount: number, mintInfo: MintInfo): SendTransactionRequest {

    let mintPrice: number = defaultMintPrice;
    if (mintInfo.fetchFormRemote && mintInfo.freemintTonPrice) {
        mintPrice = mintInfo.freemintTonPrice;
    }

    return {
        // let mintPrice:number = mintInfo.freemintTonPrice
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                address: t404_jetton_master_address_raw,
                amount: String(baseNanoNumber * mintPrice * amount),
            },
        ],
    };

}


export default function Tab1Content() {

    const [mintInfo, setMintInfo] = useState<MintInfo>({fetchFormRemote: false, progressRate: 0});
    const [tx, setTx] = useState(buildTx(1, mintInfo));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    // mint amount
    const [mintAmount, setMintAmount] = useState(1);

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleIncrement = () => {
        if (mintAmount < 5) {
            setMintAmount(mintAmount + 1);
            setTx(buildTx(mintAmount + 1, mintInfo));
        }
    };

    const handleDecrement = () => {
        if (mintAmount >= 2) {
            setMintAmount(mintAmount - 1);
            setTx(buildTx(mintAmount - 1, mintInfo));
        }
    };

    const handleSetValue = (val: number) => {
        if (val < 1 || val > 5) {
            setMintAmount(1);
        }
        setMintAmount(val);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const client = new TonClient(
                    {
                        endpoint: isMainnet ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
                    });

                const master_tx = await client.runMethod(
                    Address.parse(t404_jetton_master_address), 'get_jetton_data');
                // @ts-ignore

                let master_result = master_tx.stack;
                let total_supply = master_result.readBigNumber();
                let mintable = master_result.readBoolean();
                let owner = master_result.readAddress();
                let content = master_result.readCell();
                let jetton_wallet_code = master_result.readCell();
                let nft_collection_address = master_result.readAddress();

                //-1:true(can mint), 0:false(can not) : BACKEND USE, not for front end
                let freemint_flag = master_result.readNumber();

                //3 000000000n 当前已经 mint 的数字
                let freemint_current_supply = master_result.readBigNumber();
                let freemint_current_supply_number = Number(freemint_current_supply / baseNanoBigInt) - roundOffset;

                //1000 000000000n
                let freemint_max_supply = master_result.readBigNumber();
                let freemint_max_supply_number = Number(freemint_max_supply / baseNanoBigInt) - roundOffset;

                //1 000000000n
                let freemint_price = Number(master_result.readBigNumber());
                let mintInfo: MintInfo = {
                    fetchFormRemote: true,
                    freemintIsOpen: freemint_current_supply_number != freemint_max_supply_number,
                    freemintCurrentSupply: freemint_current_supply_number,
                    freemintMaxSupply: freemint_max_supply_number,
                    freemintTonPrice: freemint_price / baseNanoNumber,
                    progressRate: Number(Number(100 * freemint_current_supply_number / freemint_max_supply_number).toFixed(1)),
                };

                setMintInfo(mintInfo);

                console.log('get_jetton_data freemint_current_supply:', freemint_current_supply,
                    ',freemint_max_supply:', freemint_max_supply, ",freemint_price", freemint_price,
                    ',freemint_flag:', freemint_flag);

                console.log('convert: get_jetton_data freemint_current_supply:', mintInfo.freemintCurrentSupply,
                    ',freemintMaxSupply:', mintInfo.freemintMaxSupply,
                    ",freemintTonPrice", mintInfo.freemintTonPrice,
                    ',freemintIsOpen:', mintInfo.freemintIsOpen,
                    ',progressRate:', mintInfo.progressRate,
                    ',fetchFormRemote:', mintInfo.fetchFormRemote
                );

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
    }, []);


    return (
        < div className="p-2">
            <div className="flex justify-between pb-3">
                <div className="flex gap-1">
                    <Image
                        alt="trc-404 logo"
                        height={40}
                        src="/logos/logo-transparent.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">TRC-404</p>
                        <p className="text-small text-default-500">Probably not found</p>
                    </div>
                </div>
                <div className="flex-item ml-auto">
                    <TonConnectButton/>
                </div>
            </div>


            {/*  dd */}
            <Card className="w-full h-[300px] col-span-12 sm:col-span-7">
                {/*<CardHeader className="absolute z-10 top-1 flex-col items-start">*/}
                {/*</CardHeader>*/}
                {/*<CardContent className="z-0 w-full h-full object-fill">*/}
                <Image
                    alt=" app"
                    className="z-0 w-full h-full object-fill"
                    width="300"
                    height="300"
                    src="/logos/fancy-vivid.png"
                />
                {/*</CardContent>*/}
                <CardFooter
                    className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    {/*<div className="flex flex-grow gap-2 items-center">*/}
                    {/*    <div className="flex flex-col">*/}
                    {/*        <p className="text-white/80">ERC-404</p>*/}
                    {/*        <p className="text-tiny text-white/80 ">To Make NFT Flow and Fly!</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </CardFooter>
            </Card>
            {/*dd qqq*/}

            <div className="mt-4 mb-2 text-2xl">Fair Mint
                {!isMainnet && <span className='text-yellow-600 text-lg'>&nbsp;Testnet 2nd Round</span>}
            </div>
            <div className="flex flex-col">

                {mintInfo.fetchFormRemote && (<div className="flex justify-center text-gray-500">
                    Minted Count：{mintInfo.freemintCurrentSupply}
                </div>)}

                <div className="flex justify-center  text-gray-500">
                    Round Supply：{mintInfo.freemintMaxSupply}
                </div>
                {mintInfo.fetchFormRemote && (<div className="flex justify-center text-gray-500">
                    Round Mint Price：{mintInfo.freemintTonPrice}
                </div>)}
                <div className="flex justify-center text-gray-500">
                    Period：2024/03/15 - 2024/03/29
                </div>
                {mintInfo.fetchFormRemote && (
                    <div className="flex items-center justify-center ">
                        <Progress
                            value={mintInfo.progressRate}
                        />
                        <div className=" text-gray-500">&nbsp;{mintInfo.progressRate}%</div>
                    </div>)}

                <div className="flex flex-col mt-3">
                    {wallet ? (
                        <>
                            {/*mint amount start*/}
                            <div className="flex mb-2 items-center">
                                <div className="text-lg ">Mint Amount: &nbsp;</div>

                                <Button
                                    variant={"outline"}
                                    className="focus:outline-none text-2xl"
                                    onClick={handleDecrement}
                                >
                                    -
                                </Button>
                                <div className="mx-3"> {mintAmount} </div>

                                <Button
                                    variant={"outline"}
                                    className="focus:outline-none text-2xl"
                                    onClick={handleIncrement}
                                >
                                    +
                                </Button>
                            </div>
                            {/*mint amount end*/}

                            <Button
                                variant={mintInfo.freemintIsOpen ? "blue" : "outline"}
                                disabled={!mintInfo.freemintIsOpen}
                                onClick={() => {
                                    if (isMainnet && wallet?.account.chain == CHAIN.TESTNET) {
                                        setOpen(!open);
                                        return;
                                    }

                                    if (!isMainnet && wallet?.account.chain == CHAIN.MAINNET) {
                                        setOpen(!open);
                                        return;
                                    }
                                    return tonConnectUi.sendTransaction(tx);
                                }
                                }>
                                {mintInfo.freemintIsOpen ? "Fair Mint" : "Fair Mint Finished!"}
                            </Button>

                        </>
                    ) : (
                        <Button variant={"secondary"} size='lg' color="primary" onClick={() => {
                            return tonConnectUi.openModal();
                        }}>
                            Connect Wallet to Fair Mint
                        </Button>
                    )}
                </div>
            </div>


            {/* FAQ   */}

            <div className="flex w-full flex-col pb-8">&nbsp;</div>
            <div className="  text-2xl">FAQ</div>
            <Accordion type="single" collapsible>
                <AccordionItem value="1">
                    <AccordionTrigger>What is TRC-404?</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-gray-500 indent-6">TRC-404 is an experimental, mixed Jetton & NFT
                            implementation
                            with
                            native liquidity and
                            fractionalization for semi-fungible tokens.</p>
                        <p className="pt-2 text-gray-500 indent-6">This project is inspired by ERC-404, and now is the
                            first
                            project
                            implemented
                            ERC-404 protocol
                            on
                            TON.</p>

                        <p className="pt-2 text-gray-500 indent-6">
                            Your NFT is probably not found, but your jetton is always lying in
                            your wallet. One wallet can only instantiate five 404 NFT but can have as many 404 jettons
                            as
                            you want.
                        </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                    <AccordionTrigger>What is the key features?</AccordionTrigger>
                    <AccordionContent>
                        <ul className="px-1">
                            <li className="text-gray-500">1. Submit TON Enhancement Proposals (TEPs) 404 Standard</li>
                            <li className="text-gray-500">2. Production-ready FunC code with high test coverage</li>
                            <li className="text-gray-500">3. Fully compatible with TON ecosystem(wallet, NFT market,
                                DEX)
                            </li>
                            <li className="text-gray-500">4. Native Telegram Bot and Mini-App with TON Connect SDK</li>
                            <li className="text-gray-500">5. Incentive Tokenomics, visionary roadmap and future plan
                            </li>
                        </ul>
                    </AccordionContent>

                </AccordionItem>
                <AccordionItem value="3" aria-label="Accordion 3">
                    <AccordionTrigger>What about Tokenomics?</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-gray-500">Total Supply: 1,000 K.</p>

                        <ul className="px-1">
                            <li className="text-gray-500">1. Fair Mint 1st round: 1%</li>
                            <li className="text-gray-500">2. Airdrop 2%</li>
                            <li className="text-gray-500">3. Fair Mint 2nd round: 2%</li>
                            <li className="text-gray-500">4. Developer Team: 15%</li>
                            <li className="text-gray-500">5. DEX: 10%</li>
                            <li className="text-gray-500">6. Advisor: 5%</li>
                            <li className="text-gray-500">7. Investor: 20%</li>
                            <li className="text-gray-500">8. Ecosystem Locked: 45%</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Testnet Only</DrawerTitle>
                            <DrawerDescription>
                                <p>
                                    Thank you for participating in the TRC-404 beta test, you need to connect testnet,
                                    but you are currently
                                    connecting to
                                    the&nbsp;
                                    <span className="bg-yellow-100 text-red-700">mainnet</span> wallet.
                                </p>
                                <p>
                                    <h2>Mainnet</h2>
                                    <ul className="list-disc">
                                        <li>address start with <span className=" text-red-500">EQ</span>
                                        </li>
                                        <li>address start with <span className=" text-red-500">UQ</span>
                                        </li>
                                    </ul>

                                    <h2 className="pt-2">Testnet</h2>
                                    <ul className="list-disc">
                                        <li>address start with <span className="bg-gray-900 text-blue-500">kQ</span>
                                        </li>
                                        <li>address start with <span className="bg-gray-900 text-blue-500">0Q</span>
                                        </li>
                                    </ul>
                                </p>
                                <Separator className="my-4"/>
                                <div>
                                    <div>Q: How to config your wallet to connect testnet?</div>
                                    <div>A: <Link className={"underline"}
                                                  href="https://answers.ton.org/question/1561527682871595008/how-do-you-change-ton-keeper-to-testnet">view
                                        answer</Link>
                                    </div>
                                </div>
                                <div>
                                    <div>Q: How to get Toncoin at testnet?</div>
                                    <div>A: <Link className={"underline"}
                                                  href="https://t.me/testgiver_ton_bot">
                                        Testgiver TON Bot</Link>
                                    </div>
                                </div>
                            </DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
            {/* FAQ   */}
            <div className="flex w-full flex-col pb-20">&nbsp;</div>


        </div>


    );
}

