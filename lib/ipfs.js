/**
 * IPFS Utility for viewing evidence from Pinata
 */

export async function uploadToIPFS(file) {
    // This feature is currently disabled. 
    // To enable, you will need to add a PINATA_JWT and implement the upload logic.
    console.warn("IPFS upload is currently disabled.");
    return `mock-cid-${Math.random().toString(36).substring(7)}`;
}

export function getIPFSUrl(cid) {
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
