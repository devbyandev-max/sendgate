export type User = {
    id: number;
    name: string;
    email: string;
    company_name?: string | null;
    phone?: string | null;
    status?: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    two_factor_confirmed_at?: string | null;
    roles?: string[];
    is_admin?: boolean;
    is_super_admin?: boolean;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type FlashBag = {
    success?: string | null;
    error?: string | null;
    info?: string | null;
    toast?: { type: 'success' | 'error' | 'info'; message: string } | null;
};

export type SharedData = {
    name: string;
    auth: Auth;
    flash?: FlashBag;
    sidebarOpen?: boolean;
    [key: string]: unknown;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
