import React, {useState} from 'react';
import {SendTransactionRequest} from "@tonconnect/sdk";
import {TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";

import {Image,} from '@nextui-org/react';
import {Progress} from "@nextui-org/progress";
import {Card, CardFooter, CardHeader} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import {t404_jetton_master_address_raw} from "@/constant/trc404";

// 1 means 1 ton 1 T404
// 5 means 5 ton 1 T404
// TODO: to change for production 1
const baseRate: number = 1;


function buildTx(base: number, amount: number): SendTransactionRequest {

    return {
        // TODO: to change for production 2
        // network: CHAIN.TESTNET,
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                address: t404_jetton_master_address_raw,
                amount: String(1000000000 * base * amount),
            },
        ],
    };

}

export default function Tab1Content() {

    const [tx, setTx] = useState(buildTx(baseRate, 1));
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    // process bar number
    const [progressNumber, setProgressNumber] = React.useState(20);

    // mint amount
    const [mintAmount, setMintAmount] = useState(1);

    const handleIncrement = () => {
        if (mintAmount < 5) {
            setMintAmount(mintAmount + 1);
            setTx(buildTx(baseRate, mintAmount + 1));
        }
    };

    const handleDecrement = () => {
        if (mintAmount >= 2) {
            setMintAmount(mintAmount - 1);
            setTx(buildTx(baseRate, mintAmount - 1));
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
            setProgressNumber((v) => (v > 100 ? 100 : v + 1));
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

            {/*TODO: to change for production */}
            <div className="mt-6 text-2xl">Free Mint <span className='text-yellow-600'>(Testnet)</span></div>
            <div className="flex flex-col">
                <div className="flex justify-center mt-1 mb-5">
                    <Progress
                        aria-label="Downloading..."
                        size="md"
                        value={progressNumber}
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
                                return tonConnectUi.sendTransaction(tx);
                            }
                            }>
                                {/* TODO: to change for production 4 */}
                                Free Mint [Testnet Only]
                            </Button>

                        </>
                    ) : (
                        <Button size='lg' color="primary" onClick={() => {
                            return tonConnectUi.openModal();
                        }}>
                            {/*Connect Wallet to Free Mint*/}
                            Connect Wallet [Testnet Only]
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

