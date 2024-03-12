'use client';
import {Image} from '@nextui-org/react';
import {TonConnectButton} from '@tonconnect/ui-react';
import {useRouter} from 'next/navigation';

const UserProfile = () => {
    /* todo remove tma */
    // ==============================================================
    // const initData = useInitData();
    const initData = {user: {firstName: 'Andy', lastName: 'Block'}};

    // //==============================================================

    function clickAvatar(): void {
        console.info('clickAvatar');
    }

    let router = useRouter();
    return (
        <>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="text-lg font-bold">
                        {/*{initData?.user?.firstName}&nbsp;*/}
                        {/*{initData?.user?.lastName}*/}
                        {/*{initData?.user == null && 'Andrew Ton'}*/}
                        TRC-404
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Image src="/icon/pop.png" height={21} width={21} alt="pop"/>
                        {/*<p className="ml-1 mr-4 font-bold">1,235</p>*/}
                        {/*<ThemeSwitch/>*/}
                    </div>
                </div>
                <div className="flex-item ml-auto">
                    <TonConnectButton/>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
