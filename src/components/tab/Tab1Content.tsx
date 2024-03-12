import UserProfile from '@/components/tab1/UserProfile';
import React, {useState} from 'react';
import {SendTransactionRequest} from "@tonconnect/sdk";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Button} from "@nextui-org/button";
import {Progress} from "@nextui-org/progress";

import {Card, CardBody, CardHeader, Divider, Image,} from '@nextui-org/react';


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
        <>

            <div className="p-4">
                <UserProfile/>
            </div>

            <Card className="max-w-[400px] mx-5">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="trc-404 logo"
                        height={40}
                        radius="sm"
                        src="/logo.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">TRC-404</p>
                        <p className="text-small text-default-500">Probably not found</p>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody>
                    <p>TRC-404 is an experimental, mixed Jetton / NFT implementation with native liquidity and
                        fractionalization for semi-fungible tokens. </p>
                </CardBody>
                <Divider/>

            </Card>

            <div className="flex flex-col">
                {wallet ? (
                    <>
                        <div className="flex justify-center mt-10 mb-5 mx-5">
                            <Progress
                                aria-label="Downloading..."
                                size="md"
                                value={value}
                                color="success"
                                showValueLabel={true}
                                className="max-w-md "
                            />
                        </div>

                        <div className="flex flex-col mx-5">
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
                        </div>

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


            {/* FAQ   */}

            {/* FAQ   */}

        </>


    );
}


// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
// const defaultTx: SendTransactionRequest = {
//     // The transaction is valid for 10 minutes from now, in unix epoch seconds.
//     validUntil: Math.floor(Date.now() / 1000) + 600,
//     messages: [
//         {
//             // The receiver's address.
//             // kQBrZNqhRvg4nj-xxoKLRpoKjMnaQ7ccrlmjztC2ZKOKVZC3
//             address: '0:6b64daa146f8389e3fb1c6828b469a0a8cc9da43b71cae59a3ced0b664a38a55',
//             // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
//             amount: '1000000000',
//             // (optional) State initialization in boc base64 format.
//             // stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
//             // (optional) Payload in boc base64 format.
//             // payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
//         },
//
//         // Uncomment the following message to send two messages in one transaction.
//         /*
//         {
//           // Note: Funds sent to this address will not be returned back to the sender.
//           address: '0:2ecf5e47d591eb67fa6c56b02b6bb1de6a530855e16ad3082eaa59859e8d5fdc',
//           amount: toNano('0.01').toString(),
//         }
//         */
//
//     ],
// };
