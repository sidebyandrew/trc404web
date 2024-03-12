// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import {THEME, TonConnectUIProvider} from "@tonconnect/ui-react";

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <TonConnectUIProvider
                manifestUrl="https://trc404web.pages.dev/tonconnect-manifest.json"
                uiPreferences={{
                    theme: THEME.DARK,
                }}
                actionsConfiguration={{
                    twaReturnUrl: 'https://t.me/trc404bot/app',
                }}
            >
                {children}
            </TonConnectUIProvider>
        </NextUIProvider>
    )
}
