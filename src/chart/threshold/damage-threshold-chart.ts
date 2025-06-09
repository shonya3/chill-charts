import { LitElement, html, type TemplateResult, CSSResult, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { defaultChills, generateSeriesData } from './utils';
import { Chart } from 'chart.js/auto';
import { styles } from './styles';

@customElement('damage-threshold-chart')
export class DamageThresholdChartElement extends LitElement {
	static styles: Array<CSSResult> = [styles];

	@property({ type: Array }) chills: Array<number> = defaultChills();

	@property({ type: Array }) chillIncreasedArray: Array<number> = [0, 0.5, 1, 1.5];

	@query('canvas') private canvas!: HTMLCanvasElement;

	#chartInstance: Chart | null = null;

	protected render(): TemplateResult {
		return html`<canvas></canvas>`;
	}

	protected updated(_changedProperties: PropertyValues): void {
		this.createOrUpdateChart();
	}

	#colors = [
		'oklch(54.6% 0.245 262.881)', // blue-600
		'oklch(90.5% 0.093 164.15)', // emerald-200
		'oklch(69.6% 0.17 162.48)', // emerald-500
		'oklch(43.2% 0.095 166.913)', // emeral-900
		'rgb(153, 102, 255)', // Purple - remains as a fallback
	];

	createOrUpdateChart(): void {
		if (!this.canvas) {
			return;
		}

		if (this.#chartInstance) {
			this.#chartInstance.destroy();
		}

		const datasets = this.chillIncreasedArray
			.map(increasedChill => generateSeriesData(increasedChill, this.chills))
			.map((series, index) => {
				return {
					label: series.name,
					data: series.points.map(p => p.yDamagePercentage),
					borderColor: this.#colors[index % this.#colors.length],
					tension: 0.1,
					fill: false,
					hidden: false,
				};
			});

		this.#chartInstance = new Chart(this.canvas, {
			type: 'line',
			data: {
				xLabels: this.chills.map(c => (c * 100).toFixed(0)),
				datasets,
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { title: { display: true, text: 'Chill %', font: { size: 16 } } },
					y: {
						title: {
							display: true,
							text: `Percentage of enemy's ailment threshold dealt as cold damage`,
							font: { size: 16 },
						},
						ticks: {
							callback: function (value) {
								return (Number(value) * 100).toFixed(0) + '%';
							},
						},
					},
				},
				plugins: {
					title: {
						display: true,
						text: 'Damage to Ailment Threshold vs. Chill Percentage',
						font: {
							size: 18,
						},
						padding: { top: 10, bottom: 20 },
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							title: function (tooltipItems) {
								if (tooltipItems.length > 0) {
									return tooltipItems[0].label + '% Chill';
								}
								return '';
							},
							label: function (context) {
								let label = context.dataset.label || '';
								if (label) label += ': ';
								if (context.parsed.y !== null) {
									label += (context.parsed.y * 100).toFixed(2) + '%';
								}
								return label;
							},
						},
					},
				},
			},
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'damage-threshold-chart': DamageThresholdChartElement;
	}
}
