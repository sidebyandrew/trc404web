import UserProfile from '@/components/tab1/UserProfile';
import React, {useState} from 'react';
import {SendTransactionRequest} from "@tonconnect/sdk";
import {useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Button} from "@nextui-org/button";


// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
    // The transaction is valid for 10 minutes from now, in unix epoch seconds.
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [
        {
            // The receiver's address.
            // kQBrZNqhRvg4nj-xxoKLRpoKjMnaQ7ccrlmjztC2ZKOKVZC3
            address: '0:6b64daa146f8389e3fb1c6828b469a0a8cc9da43b71cae59a3ced0b664a38a55',
            // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
            amount: '1000000000',
            // (optional) State initialization in boc base64 format.
            // stateInit: 'te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==',
            // (optional) Payload in boc base64 format.
            // payload: 'te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==',
        },

        // Uncomment the following message to send two messages in one transaction.
        /*
        {
          // Note: Funds sent to this address will not be returned back to the sender.
          address: '0:2ecf5e47d591eb67fa6c56b02b6bb1de6a530855e16ad3082eaa59859e8d5fdc',
          amount: toNano('0.01').toString(),
        }
        */

    ],
};

export default function Tab1Content() {

    const [tx, setTx] = useState(defaultTx);
    const wallet = useTonWallet();
    const [tonConnectUi] = useTonConnectUI();

    const [isBtnLoading, setIsBtnLoading] = useState(false);

    return (
        <>

            <div className="p-4">
                <UserProfile/>
            </div>

            <div className="flex mx-auto items-center justify-center">
                {wallet ? (
                    <Button size='lg' color="primary" onClick={() => {
                        setIsBtnLoading(true);
                        return tonConnectUi.sendTransaction(tx);
                    }

                    }>
                        Free Mint TRC-404
                    </Button>
                ) : (
                    <Button size='lg' color="primary" onClick={() => {
                        setIsBtnLoading(true);
                        return tonConnectUi.openModal();
                    }}>
                        Connect Wallet to Free Mint
                    </Button>
                )}
            </div>


        </>


    );
}

