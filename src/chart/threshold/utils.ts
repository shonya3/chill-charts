import { calculateDamageRatioFromChill } from '../../chill';

export type Point = {
	xChill: number;
	yDamagePercentage: number;
};

export type SeriesData = {
	name: string;
	points: Array<Point>;
};

export function generateSeriesData(increasedChill: number, chills: Array<number>): SeriesData {
	return {
		name: `+${increasedChill * 100}% effect`.padEnd(13),
		points: createPoints(chills, increasedChill),
	};
}

export function defaultChills(): Array<number> {
	return Array(31)
		.fill(0)
		.map((_, i) => (i + 10) * 0.01);
}

export function createPoints(chills: Array<number>, increasedChill?: number): Array<Point> {
	return chills.map(xChill => ({
		xChill,
		yDamagePercentage: calculateDamageRatioFromChill(xChill, increasedChill),
	}));
}
