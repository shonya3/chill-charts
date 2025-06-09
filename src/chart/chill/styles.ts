import { css } from 'lit';

export const styles = css`
	:host {
		display: flex; /* Use flexbox to manage child layout */
		flex-direction: column; /* Stack children vertically */
		width: 100%;
		max-width: 700px; /* Max width for readability, can be adjusted */
		height: 600px; /* Define a fixed height for the component */
		box-sizing: border-box; /* Include padding and border in the element's total width and height */
		padding: 1rem; /* Add some padding around the content */
	}
	canvas {
		width: 100% !important; /* Override potential inline styles from Chart.js if needed */
		flex-grow: 1; /* Make canvas take up all remaining vertical space */
		min-height: 0; /* Important for flexbox to allow canvas to shrink if needed */
	}
`;
