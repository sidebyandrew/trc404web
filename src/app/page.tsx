'use client';

import React, {useState} from "react";
import Tab1Content from "@/components/tab/Tab1Content";
import Tab2Content from "@/components/tab/Tab2Content";
import Tab3Content from "@/components/tab/Tab3Content";
import Tab4Content from "@/components/tab/Tab4Content";
import MobileTab from "@/components/mobile-tab";
import Image from "next/image";
import {TonConnectButton} from "@tonconnect/ui-react";

export default function Page() {
    const [activeTab, setActiveTab] = useState<string>('tab1');
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    return (
        <div>
            {/* Your main content goes here */}
            <div className="">
                {/*head*/}
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
                {/*head end*/}
                {/* Render different content based on the activeTab state */}
                {activeTab === 'tab1' && <Tab1Content/>}
                {activeTab === 'tab2' && <Tab2Content/>}
                {activeTab === 'tab3' && <Tab3Content/>}
                {activeTab === 'tab4' && <Tab4Content/>}
            </div>

            {/* Render the MobileTab component */}
            <MobileTab onTabChange={handleTabChange}/>
        </div>
    )

}
