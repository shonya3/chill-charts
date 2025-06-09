/**
 * Calculates the damage/threshold ratio (decimal 0.0-1.0+) that produces a given chill effect
 * @param chill - Resulting chill value (e.g., 0.05 for 5% slow)
 * @param increasedChill - Increased chill modifier (e.g., 0.5 for 50% increased)
 * @returns Damage/threshold ratio (decimal) that would cause the input chill
 */
export function calculateDamageRatioFromChill(chill: number, increasedChill: number = 0): number {
	// Calculate effective multiplier
	const multiplier = 1 + increasedChill;

	// Handle invalid inputs
	if (multiplier <= 0 || chill < 0) {
		return 0;
	}

	// Reverse the chill formula:
	// Original: chill = 0.5 * (damageRatio)^0.4 * multiplier
	const baseChill = chill / multiplier;
	const temp = 2 * baseChill;

	// Prevent exponentiation errors
	if (temp <= 0) {
		return 0;
	}

	// damageRatio = (2 * baseChill)^(1/0.4) = (2 * baseChill)^2.5
	return Math.pow(temp, 2.5);
}

export function calculateChill(options: CalculateCHillOptions): number {
	const increasedChill = options.increasedChill ?? 0;
	const percentageDealtDecimal =
		'percentageDealt' in options ? options.percentageDealt / 100 : options.damage / options.threshold;
	return 0.5 * percentageDealtDecimal ** 0.4 * (1 + increasedChill);
}

export type CalculateCHillOptions =
	| {
			damage: number;
			threshold: number;
			increasedChill?: number;
	  }
	| {
			percentageDealt: number;
			increasedChill?: number;
	  };
