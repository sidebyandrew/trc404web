import React, {useEffect, useState} from 'react';
import {CHAIN, SendTransactionRequest} from "@tonconnect/sdk";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {Address} from "@ton/core";
import {TonClient} from "@ton/ton";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import Image from 'next/image'
import {useMediaQuery} from "@/hooks/use-media-query";
import Autoplay from "embla-carousel-autoplay";
import {
    BASE_NANO_BIGINT,
    BASE_NANO_NUMBER,
    defaultMintPrice,
    ENDPOINT_MAINNET_RPC,
    ENDPOINT_TESTNET_RPC,
    FAIR_MINT_PERIOD,
    isMainnet,
    roundAccumulatedOffset,
    t404_jetton_master_address
} from "@/constant/trc404_config";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"
import {Card, CardContent} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";


interface MintInfo {
    fetchFormRemote: boolean;
    freemintIsOpen?: boolean;
    freemintMaxSupply?: number;
    freemintCurrentSupply?: number;
    freemintTonPrice?: number;
    progressRate: number;
}


interface RpcErrorInfo {
    isRpcError: boolean;
    errorMsg?: string;
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
                address: t404_jetton_master_address,
                amount: String(BASE_NANO_NUMBER * mintPrice * amount),
            },
        ],
    };

}


export default function Tab1Content() {

    let diamonds = [
        "diamond-night.png",
        "diamond-blue.png",
        "diamond-original.png",
        "fancy-vivid.png",];

    const [rpcErrorInfo, setRpcErrorInfo] = useState<RpcErrorInfo>({isRpcError: false, errorMsg: ""});
    const [mintInfo, setMintInfo] = useState<MintInfo>({fetchFormRemote: false, progressRate: 0});
    const [tx, setTx] = useState(buildTx(1, mintInfo));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    // mint amount
    const [mintAmount, setMintAmount] = useState(1);

    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [logMsg404, setLogMsg404] = useState("");

    function log404(msg: any) {
        try {
            if (logMsg404) {
                setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
            } else {
                setLogMsg404(JSON.stringify(msg));
            }
        } catch (err) {
        }
    }

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
                // let total_supply = master_result.readBigNumber();
                // let mintable = master_result.readBoolean();
                // let owner = master_result.readAddress();
                // let content = master_result.readCell();
                // let jetton_wallet_code = master_result.readCell();
                // let nft_collection_address = master_result.readAddress();

                //-1:true(can mint), 0:false(can not) : BACKEND USE, not for front end
                // let freemint_flag = master_result.readNumber();

                //3 000000000n 当前已经 mint 的数字
                // let freemint_current_supply = master_result.readBigNumber();
                // let freemint_current_supply_number = Number(freemint_current_supply / BASE_NANO_BIGINT) - roundAccumulatedOffset;

                //1000 000000000n
                // let freemint_max_supply = master_result.readBigNumber();
                // let freemint_max_supply_number = Number(freemint_max_supply / BASE_NANO_BIGINT) - roundAccumulatedOffset;


                let max_supply = master_result.readBigNumber();
                let mintable = master_result.readBoolean();
                let owner = master_result.readAddress();
                let content = master_result.readCell();
                let jetton_wallet_code = master_result.readCell();
                let nft_item_code = master_result.readCell();
                let nft_collection_address = master_result.readAddress();
                let freemint_flag = master_result.readNumber();
                let freemint_current_supply = master_result.readBigNumber();
                let freemint_max_supply = master_result.readBigNumber();
                let freemint_price = master_result.readBigNumber();
                let total_supply = master_result.readBigNumber();

                let freemint_current_supply_number = Number(freemint_current_supply / BASE_NANO_BIGINT) - roundAccumulatedOffset;
                let freemint_max_supply_number = Number(freemint_max_supply / BASE_NANO_BIGINT) - roundAccumulatedOffset;


                //1 000000000n
                let freemint_price_number = Number(freemint_price);
                let mintInfo: MintInfo = {
                    fetchFormRemote: true,
                    freemintIsOpen: freemint_max_supply_number - freemint_current_supply_number > 1,
                    freemintCurrentSupply: freemint_current_supply_number,
                    freemintMaxSupply: freemint_max_supply_number,
                    freemintTonPrice: freemint_price_number / BASE_NANO_NUMBER,
                    progressRate: Number(Number(100 * freemint_current_supply_number / freemint_max_supply_number).toFixed(1)),
                };

                setMintInfo(mintInfo);
                setTx(buildTx(1, mintInfo));
                log404(mintInfo);

                // console.log('get_jetton_data freemint_current_supply :', freemint_current_supply,
                //     ',freemint_max_supply:', freemint_max_supply, ",freemint_price", freemint_price,
                //     ',freemint_flag:', freemint_flag);
                //
                // console.log('convert: get_jetton_data freemint_current_supply:', mintInfo.freemintCurrentSupply,
                //     ',freemintMaxSupply:', mintInfo.freemintMaxSupply,
                //     ",freemintTonPrice", mintInfo.freemintTonPrice,
                //     ',freemintIsOpen:', mintInfo.freemintIsOpen,
                //     ',progressRate:', mintInfo.progressRate,
                //     ',fetchFormRemote:', mintInfo.fetchFormRemote
                // );

            } catch (error) {
                console.log('convert: get_jetton_data freemint_current_supply:', mintInfo.freemintCurrentSupply,
                    ',freemintMaxSupply:', mintInfo.freemintMaxSupply,
                    ",freemintTonPrice", mintInfo.freemintTonPrice,
                    ',freemintIsOpen:', mintInfo.freemintIsOpen,
                    ',progressRate:', mintInfo.progressRate,
                    ',fetchFormRemote:', mintInfo.fetchFormRemote
                );
                log404(error);
                log404(mintInfo);
                setRpcErrorInfo({isRpcError: true, errorMsg: "error"});
            }
        };

        // Only execute fetchData if running in the browser
        if (typeof window !== "undefined") {
            fetchData().catch(r => {
                log404("Sorry, I need window to run." + r);
                console.error("Sorry, I need window to run." + r)
            });
        }
    }, []);


    return (
        < div className="px-3 justify-center items-center">
            {/* Carousel*/}
            <Carousel className="  px-1 justify-center items-center" plugins={[
                Autoplay({
                    delay: 6000,
                }),
            ]}>
                <CarouselContent>
                    {diamonds.map((diamond, index) => (
                        <CarouselItem key={index}>
                            <CardContent className="flex items-center justify-center p-0">
                                <Card className={"flex justify-center border-0 h-[280px] w-[280px]"}>
                                    <Image
                                        alt=" app"
                                        className="w-full h-full object-fill"
                                        width="180"
                                        height="180"
                                        src={'/diamonds/' + diamond}
                                    />
                                </Card>
                            </CardContent>
                        </CarouselItem>))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>


            <div className="mt-4 mb-2 text-2xl">Fair Mint
                {!isMainnet && <span className='text-yellow-600 text-lg'>&nbsp;Testnet 3rd Round</span>}
            </div>
            <div className="flex flex-col">

                {rpcErrorInfo.isRpcError &&

                    <div className="flex flex-col space-y-3 items-center">

                        <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]"/>
                            <Skeleton className="h-4 w-[200px]"/>
                        </div>
                        <div className="text-red-400">TON RPC Server is busy, but you can try to mint.</div>
                    </div>

                }
                {!rpcErrorInfo.isRpcError && <div>

                    {mintInfo.fetchFormRemote && mintInfo.freemintIsOpen && (
                        <div className="flex justify-center text-gray-400">
                            Minted Count：{mintInfo.freemintCurrentSupply}
                        </div>)}

                    <div className="flex justify-center  text-gray-400">
                        Round Supply：{mintInfo.freemintMaxSupply}
                    </div>
                    {mintInfo.fetchFormRemote && (<div className="flex justify-center text-gray-400">
                        Round Mint Price：{mintInfo.freemintTonPrice}
                    </div>)}
                    <div className="flex justify-center text-gray-400">
                        Period：{FAIR_MINT_PERIOD}
                    </div>
                    {mintInfo.fetchFormRemote && (
                        <div className="flex items-center justify-center ">
                            <Progress
                                value={mintInfo.progressRate}
                            />
                            <div className=" text-gray-400">&nbsp;{mintInfo.progressRate}%</div>
                        </div>)}

                </div>}


                <div className="flex flex-col mt-3">
                    {wallet?.account?.address &&
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
                                size={"lg"}
                                variant={mintInfo.freemintIsOpen ? "blue" : "outline"}
                                disabled={mintInfo.freemintIsOpen === false}
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
                                {mintInfo.freemintIsOpen === false ? "Fair Mint Finished" : "Fair Mint"}
                            </Button>

                        </>}
                    {!wallet?.account?.address &&
                        <Button variant={"secondary"} size='lg' color="primary" onClick={() => {
                            if (!tonConnectUi.connected) {
                                return tonConnectUi.openModal();
                            } else {
                                return tonConnectUi.sendTransaction(tx);
                            }
                        }}>
                            Connect Wallet to Fair Mint
                        </Button>
                    }
                </div>
            </div>


            {/* FAQ   */}
            <div className="flex w-full flex-col pb-8">&nbsp;</div>
            <div className="  text-2xl">FAQ</div>
            <Accordion type="single" collapsible>
                <AccordionItem value="1">
                    <AccordionTrigger>What is TRC-404?</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-gray-400 indent-6">TRC-404 is an innovative, mixed Jetton & NFT
                            implementation
                            with
                            native liquidity and
                            fractionalization for semi-fungible tokens.</p>
                        <p className="pt-2 text-gray-400 indent-6">This project is inspired by ERC-404, and now is the
                            first
                            project
                            implemented
                            ERC-404 protocol
                            on
                            TON.</p>

                        <p className="pt-2 text-gray-400 indent-6">
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
                            <li className="text-gray-400">1. Submit TON Enhancement Proposals (TEPs) 404 Standard</li>
                            <li className="text-gray-400">2. Production-ready FunC code with high test coverage</li>
                            <li className="text-gray-400">3. Fully compatible with TON ecosystem(wallet, NFT market,
                                DEX)
                            </li>
                            <li className="text-gray-400">4. Native Telegram Bot and Mini-App with TON Connect SDK</li>
                            <li className="text-gray-400">5. Incentive Tokenomics, visionary roadmap and future plan
                            </li>
                        </ul>
                    </AccordionContent>

                </AccordionItem>
                <AccordionItem value="3" aria-label="Accordion 3">
                    <AccordionTrigger>What about Tokenomics?</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-gray-400">Total Supply: 1,000 K.</p>

                        <ul className="px-1">
                            <li className="text-gray-400">1. Fair Mint 1st round: 1%</li>
                            <li className="text-gray-400">2. Airdrop 2%</li>
                            <li className="text-gray-400">3. Fair Mint 2nd round: 2%</li>
                            <li className="text-gray-400">4. Developer Team: 15%</li>
                            <li className="text-gray-400">5. DEX: 10%</li>
                            <li className="text-gray-400">6. Advisor: 5%</li>
                            <li className="text-gray-400">7. Investor: 20%</li>
                            <li className="text-gray-400">8. Ecosystem Locked: 45%</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {/* FAQ   */}


            {/* Drawer */}
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle className="text-center">
                            {isMainnet && wallet?.account.chain == CHAIN.TESTNET && "Must Connect to Mainnet"}
                            {!isMainnet && wallet?.account.chain == CHAIN.MAINNET && "Must Connect to Testnet"}
                        </DrawerTitle>
                        <DrawerDescription>
                            {isMainnet && wallet?.account.chain == CHAIN.TESTNET && <div>
                                <p>
                                    You need to connect
                                    <span className=" text-red-500">&nbsp;mainnet</span> wallet.
                                </p>
                                <p>
                                    <h2 className={"mt-3 "}>Mainnet</h2>
                                    <ul className="list-disc ml-8">
                                        <li>address start with <span className=" text-red-500">EQ</span>
                                        </li>
                                        <li>address start with <span className=" text-red-500">UQ</span>
                                        </li>
                                    </ul>

                                    <h2 className="pt-2">Testnet</h2>
                                    <ul className="list-disc  ml-8">
                                        <li>address start with <span className="bg-gray-900 text-blue-500">kQ</span>
                                        </li>
                                        <li>address start with <span className="bg-gray-900 text-blue-500">0Q</span>
                                        </li>
                                    </ul>
                                </p>
                                <Separator className="my-4"/>

                            </div>}

                            {!isMainnet && wallet?.account.chain == CHAIN.MAINNET && <div>
                                <p>
                                    Thank you for participating in the TRC-404 beta test, you need to connect testnet,
                                    but you are currently
                                    connecting to
                                    the&nbsp;
                                    <span className="bg-yellow-100 text-red-700">mainnet</span> wallet.
                                </p>
                                <p>
                                    <h2 className={"mt-3 "}>Mainnet</h2>
                                    <ul className="list-disc ml-8">
                                        <li>address start with <span className=" text-red-500">EQ</span>
                                        </li>
                                        <li>address start with <span className=" text-red-500">UQ</span>
                                        </li>
                                    </ul>

                                    <h2 className="pt-2">Testnet</h2>
                                    <ul className="list-disc  ml-8">
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
                            </div>}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="pt-2 pb-5">
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            {/* Drawer End */}
            <div className="flex w-full flex-col pb-20">&nbsp;</div>
            <div className="mt-20 mb-20 text-gray-600 text-center">
                <Popover>
                    <PopoverTrigger className="text-gray-400">Diamonds are forever.</PopoverTrigger>
                    <PopoverContent
                        className={"w-[300px] break-all"}>
                        <div className={"break-all"}>{logMsg404}</div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>


    );
}

