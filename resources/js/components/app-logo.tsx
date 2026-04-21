import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-8 shrink-0" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-extrabold tracking-tight">
                    Send<span className="text-primary">Gate</span>
                </span>
            </div>
        </>
    );
}
