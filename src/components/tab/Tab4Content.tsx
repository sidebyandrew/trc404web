"use client";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {BASE_URL} from "@/constant/trc404_config";
import {Result404, USER_COUNT_FOUND} from "@/utils/static404";

interface Project {
    title: string;
    category: string;
    badge: string;
    badgeVariant: string;
    desc: string;
    content: string;
}

let projectList: Project[] = [
    {
        title: "Pink Market",
        category: "DeFi",
        badge: "Building",
        badgeVariant: "green",
        desc: "404 Jetton Market build with order book.",
        content: "Built for the trading needs of some fractionalised T404 tokens. If you need high liquidity, pls refer to TON DEX."
    },
    {
        title: "War of Floor Price",
        category: "NFT",
        badge: "Building",
        badgeVariant: "green",
        desc: "Solve 404 NFT fast liquidity problem",
        content: "If you need Toncoin urgently, you can quickly sell the NFT at the floor price(maybe with discount.) "
    }, {
        title: "404 Factory",
        category: "404",
        badge: "Planning",
        badgeVariant: "blue",
        desc: "Deploy your 404 project with pleasure",
        content: "Deploy your own 404 project with our standardized contract templates"
    }, {
        title: "Diamond 404",
        category: "Staking",
        badge: "Planning",
        badgeVariant: "blue",
        desc: "A Lucky Draw Project",
        content: "Hold and stake T404 to get the chance to win BIG PRIZE!"
    }, {
        title: "Game loot box 404",
        category: "GameFi",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Games with TRC-404 build-in ",
        content: "Use TRC-404 protocol to develop your game."
    }, {
        title: "AIGC 404 NFT",
        category: "AIGC",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "404 NFT with AIGC generated images",
        content: "Dynamically generate NFT images via AIGC, and use 404 to mix Jetton & NFT, which is a lot of fun!"
    }, {
        title: "Inscription 404",
        category: "Inscription",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Inscription & TRC-404",
        content: "Solve the liquidity problem of Inscription through the 404 protocol"
    }, {
        title: "Ticket 404",
        category: "RWA",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Ticket & TRC-404",
        content: "Bind real world assets to the 404 protocol for easy ticket purchase, refund, and randomness or more"
    }, {
        title: "404 Uni DEX",
        category: "DeFi",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "A DEX for 404 jettons",
        content: "Provide sufficient liquidity and customized needs for the 404 ecosystem"
    }
]

export default function Tab4Bridge() {
    const [logMsg404, setLogMsg404] = useState("");
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            let logUrl;
            try {
                let urlBase = BASE_URL;
                let urlWithParams = `${urlBase}/api/user/count?access404=error_code_404`;
                logUrl = urlWithParams;
                const response = await fetch(urlWithParams);
                if (!response.ok) {
                    log404(urlBase);
                    return;
                }
                const responseData = await response.json<Result404>();
                log404(responseData.success + "-");
                if (responseData.success && responseData.code == USER_COUNT_FOUND) {
                    let {count} = responseData.result;
                    setUserData(count);
                }
            } catch (error) {
                if (error instanceof Error) {
                    log404(logUrl + "" + error.message);
                }
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    function log404(msg: any) {
        if (logMsg404) {
            setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
        } else {
            setLogMsg404(JSON.stringify(msg));
        }
    }

    return (
        <div className="p-3">
            <div className="mb-3 text-2xl font-bold">TRC-404 Ecosystem</div>
            <div className="mt-5">
                {projectList.map((project, index) => {
                    let variant = project.badge === 'Building' ? 'green' : project.badge === 'Planning' ? 'blue' : project.badge === 'Partnership' ? "purple" : "gray";
                    return <>
                        <div key={project.title}>
                            <Card className="w-[350px] mb-2" key={project.title}>
                                <CardHeader className="p-3 pt-2">
                                    <CardTitle>
                                        <div className={"flex"}>
                                            <div>{project.title} <span
                                                className="text-gray-500 text-sm font-extralight">#{project.category}</span>
                                            </div>
                                            <div className={" ml-auto"}>

                                                <Badge
                                                    variant={variant as any}>{project.badge}</Badge></div>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>{project.desc} </CardDescription>
                                </CardHeader>
                                <CardContent className="p-3 pb-2">
                                    {project.content}
                                </CardContent>
                            </Card>
                        </div>
                    </>;
                })}

            </div>

            <div className="mt-20 mb-20 text-gray-600 text-center">&nbsp;</div>
            <div className="mt-20  text-gray-600 text-center">
                <Popover>
                    <PopoverTrigger className="text-gray-400">Endless...</PopoverTrigger>
                    <PopoverContent
                        className={"w-[300px] break-all"}>
                        <div className={"break-all"}>{logMsg404}{userData}</div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex w-full flex-col pb-10">&nbsp;</div>
        </div>
    );
};

