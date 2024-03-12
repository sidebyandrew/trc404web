import React, {useState} from 'react';
import {SendTransactionRequest} from "@tonconnect/sdk";
import {TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Button} from "@nextui-org/button";

import {Image,} from '@nextui-org/react';
import {Progress} from "@nextui-org/progress";


function buildTx(base: number, amount: number): SendTransactionRequest {

    return {
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
            {
                address: '0:6b64daa146f8389e3fb1c6828b469a0a8cc9da43b71cae59a3ced0b664a38a55',
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

            <div className="text-center leading-8 md:leading-10 md:text-left">
                <div className="inline-block">
                    <h1
                        className="tracking-tight inline font-semibold from-[#881CF7] to-[#b249FF] text-[1.5rem] lg:text-3xl bg-clip-text text-transparent bg-gradient-to-b">
                        TRC-404&nbsp;</h1>
                </div>
                <h1 className="tracking-tight inline font-semibold text-[1.5rem] lg:text-3xl"> is an
                    experimental, mixed Jetton / NFT with native liquidity and
                    fractionalization.</h1>
            </div>


            <div className="mb-3 text-2xl">Free Mint</div>
            <div className="flex flex-col">
                <div className="flex justify-center mt-10 mb-5">
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

            {/* FAQ   */}

        </div>


    );
}

