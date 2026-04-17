/**
 * IPFS Utility for uploading evidence to Pinata
 * You will need to add PINATA_JWT or PINATA_API_KEY/SECRET to .env.local
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export async function uploadToIPFS(file: File | string): Promise<string> {
    if (!PINATA_JWT) {
        console.warn("Pinata JWT not found. Simulating IPFS upload.");
        return `mock-cid-${Math.random().toString(36).substring(7)}`;
    }

    try {
        const formData = new FormData();
        
        if (typeof file === 'string') {
            const blob = new Blob([file], { type: 'text/plain' });
            formData.append('file', blob, 'evidence.txt');
        } else {
            formData.append('file', file);
        }

        const metadata = JSON.stringify({
            name: 'Escrow Evidence',
        });
        formData.append('pinataMetadata', metadata);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: formData,
        });

        const resData = await response.json();
        return resData.IpfsHash;
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
        throw error;
    }
}

export function getIPFSUrl(cid: string): string {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
