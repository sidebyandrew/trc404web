import {useRouter} from 'next/navigation';
import React from 'react';

export default function Tab2Asset() {
    let router = useRouter();

    return (
        <div className="p-4">
            <div className="mb-3 text-2xl font-bold">TRC-404 Asset</div>

            <div className="mb-20">
                Pending
            </div>
        </div>
    );
};


