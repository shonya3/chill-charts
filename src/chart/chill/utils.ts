import { calculateChill } from '../../chill';

export type Point = {
	percentageDealt: number;
	chillResult: number;
};

export type SeriesData = {
	name: string;
	points: Array<Point>;
};

export function generateSeriesData(increasedChill: number, percentages: Array<number>): SeriesData {
	return {
		name: `Increased chill: ${increasedChill}`,
		points: createPoints(percentages, increasedChill),
	};
}

export const PERCENTAGES = [0.32, 1.79, 4.93, 10.12, 17.68, 27.89, 56] as const;

export function createPoints(percentages: Array<number>, increasedChill?: number): Array<Point> {
	return percentages.map(p => ({
		percentageDealt: p,
		chillResult: calculateChill({ percentageDealt: p, increasedChill }),
	}));
}
