<script lang="ts">
	export let title: string;
	export let id: string;
	export let direction: 'left' | 'right' = 'left';

	let isHovered: boolean = false;
	let x: number;
	let y: number;

	$: style = direction == 'left'
		? `top: calc(${y}px + 20px); left: calc(${x}px - 20vw);`
		: `top: calc(${y}px + 20px); left: calc(${x}px + 20px)`

	function mouseOver(event: MouseEvent) {
		isHovered = true;
		x = event.pageX;
		y = event.pageY;
	}

	function mouseMove(event: MouseEvent) {
		x = event.pageX;
		y = event.pageY;
	}

	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	role="tooltip"
	id={id}
	on:focus={() => {}}
	on:mouseover={mouseOver}
	on:mousemove={mouseMove}
	on:mouseleave={mouseLeave}
>
	<slot/>
</div>

{#if isHovered}
	<span {style} class="tooltip">{title}</span>
{/if}

<style>
	.tooltip {
    /* Positioning */
		position: absolute;
		padding: 5px;
		max-width: calc(var(--side-bar-width) - var(--gap-length));
		border-radius: var(--border-radius);

    /* Palette */
		background: var(--accent);
		color: var(--primary-darkest);
	}
</style>
