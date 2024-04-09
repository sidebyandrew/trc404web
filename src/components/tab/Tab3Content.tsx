"use client";
import React, {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {useRouter} from "next/navigation";

const orders = [
    {
        seller: "UQDx..Xj87",
        t404Amount: "10",
        unitPrice: "28",
        totalValue: "280",
        status: "Sold",
    },
    {
        seller: "UQ12..Xjt-",
        t404Amount: "20",
        unitPrice: "35",
        totalValue: "700",
        status: "Canceled",
    },
    {
        seller: "UQ12..XjuO",
        t404Amount: "2",
        unitPrice: "37",
        totalValue: "74",
        status: "Canceled",
    },
    {
        seller: "UQ12..Xjxf",
        t404Amount: "8",
        unitPrice: "50",
        totalValue: "400",
        status: "Sold",
    },
]

export default function Tab3Marketplace() {
    const router = useRouter();

    const [logMsg404, setLogMsg404] = useState("");
    const {toast} = useToast();

    function log404(msg: any) {
        if (logMsg404) {
            setLogMsg404(logMsg404 + " ," + JSON.stringify(msg));
        } else {
            setLogMsg404(JSON.stringify(msg));
        }
    }

    return (
        <div className="p-3">
            <div className="mb-3 text-2xl font-bold">TRC-404 Pink Market <div
                className="text-gray-400 text-sm">(Under construction)</div></div>

            <Tabs defaultValue="listed" className="mx-auto">
                <TabsList>
                    <TabsTrigger value="listed">Listed</TabsTrigger>
                    <TabsTrigger value="myOrders">My Orders</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="listed" className="">
                    <div className="  ">
                        <Button variant="blue" className="flex ml-auto"
                                onClick={() => {
                                    router.push('/pink/');
                                }}
                        >New Order</Button>
                    </div>

                    {/*  orders  */}
                    <Table>
                        <TableCaption>Building, under construction...</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead className="w-[100px]">Seller</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell className="font-extralight text-sm">{order.seller}</TableCell>
                                    <TableCell>{order.t404Amount}</TableCell>
                                    <TableCell>{order.unitPrice}</TableCell>
                                    <TableCell className="">{order.totalValue}</TableCell>
                                    <TableCell className="ml-auto">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                toast({
                                                    title: "Building ",
                                                    description: "This feature is under construction, stay tuned!",
                                                    action: (
                                                        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                                                    ),
                                                })
                                            }}
                                        >
                                            Buy</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-20">&nbsp;</div>
                    {/*  orders end  */}

                </TabsContent>
                <TabsContent value="myOrders">
                    <Table>
                        <TableCaption>Building, under construction...</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell>{order.t404Amount}</TableCell>
                                    <TableCell>{order.unitPrice}</TableCell>
                                    <TableCell className="">{order.totalValue}</TableCell>
                                    <TableCell className="">
                                        <Button
                                            variant={"outline"}
                                            onClick={() => {
                                                toast({
                                                    title: "Building ",
                                                    description: "This feature is under construction, stay tuned!",
                                                    action: (
                                                        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                                                    ),
                                                })
                                            }}
                                        >
                                            Cancel</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={6}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>

                </TabsContent>
                <TabsContent value="history">
                    <Table>
                        <TableCaption>Building, under construction...</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>T404</TableHead>
                                <TableHead className="">Price</TableHead>
                                <TableHead className="">Total</TableHead>
                                <TableHead className="">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className="">{index + 1}</TableCell>
                                    <TableCell>{order.t404Amount}</TableCell>
                                    <TableCell>{order.unitPrice}</TableCell>
                                    <TableCell className="">{order.totalValue}</TableCell>
                                    <TableCell className="">

                                        <Badge
                                            variant={order.status == 'Canceled' ? 'destructive' : 'secondary'}>{order.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5}></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>
                    <div className="flex w-full flex-col pb-24">&nbsp;</div>
                </TabsContent>
            </Tabs>


            <div className="flex w-full flex-col pb-20">&nbsp;</div>
            <div className="mt-20  text-gray-600 text-center">
                <Popover>
                    <PopoverTrigger className="text-gray-400">The trend is your friend.</PopoverTrigger>
                    <PopoverContent
                        className={"w-[300px] break-all"}>
                        <div className={"break-all"}>{logMsg404}</div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex w-full flex-col pb-10">&nbsp;</div>

        </div>
    );
};

