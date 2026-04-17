import { 
    StellarWalletsKit, 
    Networks, 
} from '@creit.tech/stellar-wallets-kit';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';

export const PUR_ESCROW_THEME = {
    "background": "#0B0B0B",
    "background-secondary": "#161616",
    "foreground-strong": "#FFFFFF",
    "foreground": "#E4E4E7",
    "foreground-secondary": "#A1A1AA",
    "primary": "#FF4D4D",
    "primary-foreground": "#FFFFFF",
    "transparent": "rgba(0, 0, 0, 0)",
    "lighter": "#27272A",
    "light": "#18181B",
    "light-gray": "#3F3F46",
    "gray": "#71717A",
    "danger": "#EF4444",
    "border": "rgba(255, 255, 255, 0.1)",
    "shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    "border-radius": "1.25rem",
    "font-family": "Inter, sans-serif",
};

export const initWallet = () => {
    if (typeof window !== 'undefined') {
        StellarWalletsKit.init({
            network: Networks.TESTNET,
            modules: defaultModules(),
            theme: PUR_ESCROW_THEME,
        });
    }
};

// Also call it here for module-level init if in browser
if (typeof window !== 'undefined') {
    initWallet();
}

export const kit = StellarWalletsKit;

/**
 * Utility to connect to a wallet
 * @returns {Promise<string>} The connected public key
 */
export async function connectWallet() {
    try {
        const { address } = await kit.getAddress();
        return address;
    } catch (error) {
        console.error('Wallet connection failed:', error);
        throw error;
    }
}
