const EP_TAX = 50;
const ESV_TAX_RATE = 0.05;
const PRECISION = 5

export const netToGross = (netNumber: number): [number, number] => {
    const rawGrossSum = Math.floor((netNumber + EP_TAX) / (1 - ESV_TAX_RATE));
    const overflow = rawGrossSum % PRECISION;
    const grossSum = overflow > 2.5 ? rawGrossSum + (PRECISION - overflow) : rawGrossSum - overflow;

    return [grossSum, grossSum * 12];
}

export const grossToNet = (grossNumber: number): [number, number] => {
    const netSum = Math.floor(grossNumber - (grossNumber * ESV_TAX_RATE) - EP_TAX);

    return [netSum, netSum * 12];
}