import React, {useState} from 'react';
import {SendTransactionRequest} from "@tonconnect/sdk";
import {TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

import {Image,} from '@nextui-org/react';
import {Progress} from "@nextui-org/progress";
import {Card, CardFooter, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";

function buildTx(base: number, amount: number): SendTransactionRequest {

    return {
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.

        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                // EQAVtF8xhb7INQ7S4GEYudtu0fkkyIN8r6XSV7aPPkTwNKJI
                address: '0:15b45f3185bec8350ed2e06118b9db6ed1f924c8837cafa5d257b68f3e44f034',
                amount: String(1000000000 * base * amount),
            },
        ],
    };

}

export default function Tab1Content() {


    const [tx, setTx] = useState(buildTx(1, 1));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const [isBtnLoading, setIsBtnLoading] = useState(false);

    const [value, setValue] = React.useState(20);

    const [mintAmount, setMintAmount] = useState(1);

    const handleIncrement = () => {
        if (mintAmount < 5) {
            setMintAmount(mintAmount + 1);
            setTx(buildTx(1, mintAmount + 1));
        }
    };

    const handleDecrement = () => {
        if (mintAmount >= 2) {
            setMintAmount(mintAmount - 1);
            setTx(buildTx(1, mintAmount - 1));
        }
    };

    const handleSetValue = (val: number) => {
        if (val < 1 || val > 5) {
            setMintAmount(1);
        }
        setMintAmount(val);
    };

    React.useEffect(() => {
        const interval = setInterval(() => {
            setValue((v) => (v > 100 ? 100 : v + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    return (
        < div className="p-2">
            <div className="flex justify-between pb-3">
                <div className="flex gap-1">
                    <Image
                        alt="trc-404 logo"
                        height={40}
                        radius="sm"
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
            <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    {/*<p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>*/}
                    {/*<h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>*/}
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-fill"
                    src="/logos/fancy-vivid.png"
                />
                <CardFooter
                    className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="flex flex-col">
                            <p className="text-white/80">ERC-404</p>
                            <p className="text-tiny text-white/80 ">To Make NFT Flow and Fly!</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {/*dd qqq*/}


            <div className="mt-6 text-2xl">Free Mint (Testnet)</div>
            <div className="flex flex-col">
                <div className="flex justify-center mt-1 mb-5">
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={value}
                        color="success"
                        showValueLabel={true}
                        className="max-w-md "
                    />
                </div>

                <div className="flex flex-col">
                    {wallet ? (
                        <>
                            {/*mint amount start*/}
                            <div className="flex mb-2 items-center">
                                <div className="mt-2 text-lg font-bold">Mint Amount :</div>
                                <Image
                                    alt="minus logo"
                                    radius="sm"
                                    src="/icon/minus-square@3x.png"
                                    height={36}
                                    width={36}
                                    onClick={handleDecrement}
                                />
                                <div className="mx-3"> {mintAmount} </div>
                                <Image
                                    alt="add logo"
                                    radius="sm"
                                    src="/icon/add-square@3x.png"
                                    height={36}
                                    width={36}
                                    onClick={handleIncrement}
                                />
                            </div>
                            {/*mint amount end*/}

                            <Button size='lg' color="primary" onClick={() => {
                                setIsBtnLoading(true);
                                return tonConnectUi.sendTransaction(tx);
                            }
                            }>
                                Free Mint TRC-404
                            </Button>

                        </>
                    ) : (
                        <Button size='lg' color="primary" onClick={() => {
                            setIsBtnLoading(true);
                            return tonConnectUi.openModal();
                        }}>
                            Connect Wallet to Free Mint
                        </Button>
                    )}
                </div>
            </div>


            {/* FAQ   */}

            <div className="flex w-full flex-col pb-20">&nbsp;</div>

            {/* FAQ   */}

        </div>


    );
}

