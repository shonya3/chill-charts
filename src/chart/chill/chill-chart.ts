import { LitElement, html, type TemplateResult, CSSResult, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { generateSeriesData, PERCENTAGES } from './utils';
import { Chart } from 'chart.js/auto';
import { styles } from './styles';

@customElement('chill-chart')
export class ChillChardElement extends LitElement {
	static styles: Array<CSSResult> = [styles];

	@property({ type: Array }) percentagesDealt: Array<number> = Array.from(PERCENTAGES);

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
		'rgb(75, 192, 192)',
		'rgb(255, 99, 132)',
		'rgb(54, 162, 235)',
		'rgb(255, 159, 64)',
		'rgb(153, 102, 255)',
	];
	createOrUpdateChart(): void {
		if (!this.canvas) {
			return;
		}

		if (this.#chartInstance) {
			this.#chartInstance.destroy();
		}

		const datasets = this.chillIncreasedArray
			.map(increasedChill => generateSeriesData(increasedChill, this.percentagesDealt))
			.map((series, index) => {
				return {
					label: series.name,
					data: series.points.map(p => p.chillResult),
					borderColor: this.#colors[index % this.#colors.length],
					tension: 0.1,
					fill: false,
					hidden: false,
				};
			});

		this.#chartInstance = new Chart(this.canvas, {
			type: 'line',
			data: {
				labels: this.percentagesDealt,
				datasets,
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function (context) {
								let label = context.dataset.label || '';
								if (label) label += ': ';
								if (context.parsed.y !== null) {
									label += (context.parsed.y * 100).toFixed(0) + '%';
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
		'chill-chart': ChillChardElement;
	}
}
