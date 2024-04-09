'use client';
import React from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function Page({params}: { params: { lang: string } }) {

    const router = useRouter();
    return (

        <div>
            <h1>Pink {params.lang}</h1>
            <Button variant="blue" className="flex ml-auto"
                    onClick={() => {
                        router.push('/pink/order_form');
                    }}
            >order_form</Button>
        </div>
    );
}