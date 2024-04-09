import Image from 'next/image';
import {TonConnectButton} from "@tonconnect/ui-react";
import React from "react";

export default function Header404() {
    return (
        <div className="flex justify-between p-2 ">
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
    );
}
