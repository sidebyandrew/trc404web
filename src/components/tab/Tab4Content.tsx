"use client";
import React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge";

interface Project {
    title: string;
    badge: string;
    badgeVariant: string;
    desc: string;
    content: string;
}

let projectList: Project[] = [
    {
        title: "Pink Market",
        badge: "Building",
        badgeVariant: "green",
        desc: "404 Jetton Market build with order book.",
        content: "Built for the trading needs of some fractionalised T404 tokens. If you need high liquidity, pls refer to TON DEX."
    },
    {
        title: "War of Floor Price",
        badge: "Building",
        badgeVariant: "green",
        desc: "Solve 404 NFT fast liquidity problem",
        content: "If you need Toncoin urgently, you can quickly sell the NFT at the floor price(maybe with discount.) "
    }, {
        title: "404 Factory",
        badge: "Planning",
        badgeVariant: "blue",
        desc: "Deploy your 404 project with pleasure",
        content: "Deploy your own 404 project with our standardized contract templates"
    }, {
        title: "Diamond 404",
        badge: "Planning",
        badgeVariant: "blue",
        desc: "A Lucky Draw Project",
        content: "Hold and stake T404 to get the chance to win BIG PRIZE!"
    }, {
        title: "Game loot box 404",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Games with TRC-404 build-in ",
        content: "Use TRC-404 protocol to develop your game."
    }, {
        title: "AIGC 404 NFT",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "404 NFT with AIGC generated images",
        content: "Dynamically generate NFT images via AIGC, and use 404 to mix Jetton & NFT, which is a lot of fun!"
    }, {
        title: "Inscription 404",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Inscription & TRC-404",
        content: "Solve the liquidity problem of Inscription through the 404 protocol"
    }, {
        title: "Ticket 404",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "Ticket & TRC-404",
        content: "Bind tickets to the 404 protocol for easy ticket purchase, refund, and randomness"
    }, {
        title: "404 Uni DEX",
        badge: "Partnership",
        badgeVariant: "purple",
        desc: "A DEX for 404 jettons",
        content: "Provide sufficient liquidity and customized needs for the 404 ecosystem"
    }
]

export default function Tab4Bridge() {

    return (
        <div className="p-4">
            <div className="mb-3 text-2xl font-bold">TRC-404 Ecosystem</div>
            <div className="mt-5">
                {projectList.map((project, index) => {
                    let variant = project.badge === 'Building' ? 'green' : project.badge === 'Planning' ? 'blue' : project.badge === 'Partnership' ? "purple" : "gray";
                    return <>
                        <Card className="w-[350px] mb-2">
                            <CardHeader className=" pt-2">
                                <CardTitle>
                                    <div className={"flex"}>
                                        <div>{project.title}</div>
                                        <div className={" ml-auto"}><Badge
                                            variant={variant as any}>{project.badge}</Badge></div>
                                    </div>


                                </CardTitle>
                                <CardDescription>{project.desc} </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                {project.content}
                            </CardContent>
                        </Card>
                    </>;
                })}

            </div>

            <div className="mt-20 mb-20 text-gray-600 text-center">Endless...</div>
        </div>
    );
};

