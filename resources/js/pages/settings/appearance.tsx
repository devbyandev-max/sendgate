import { Head } from '@inertiajs/react';

import AppearanceToggleTab from '@/components/appearance-tabs';
import Heading from '@/components/heading';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance"
                    description="Choose how SendGate looks to you. Select a theme or match your system."
                />

                <AppearanceToggleTab />

                <p className="text-xs text-muted-foreground">
                    Your preference is stored in this browser and synced with a long-lived cookie so the right theme
                    paints on first load.
                </p>
            </div>
        </>
    );
}
