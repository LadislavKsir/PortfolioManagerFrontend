export default function isStableCoin(code: string): boolean {
    return code === "USDT" || code === "USDC"
}