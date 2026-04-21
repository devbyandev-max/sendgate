/**
 * SendGate is dark-mode only. This hook exists as a compatibility shim for
 * existing callers (settings page, theme-sensitive components) — it always
 * reports "dark" and updateAppearance is a no-op.
 */
export type ResolvedAppearance = 'dark';
export type Appearance = 'dark';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

export function initializeTheme(): void {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
}

export function useAppearance(): UseAppearanceReturn {
    return {
        appearance: 'dark',
        resolvedAppearance: 'dark',
        updateAppearance: () => {
            /* no-op — dark mode only */
        },
    } as const;
}
