import type { TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT
}

export interface SlideFadeParams {
	delay?: number,
	duration?: number,
	easing?: (_: number) => number,
	direction?: Direction
}

export function slideFade(node: Element, params?: SlideFadeParams): TransitionConfig {
	const existingTransform = getComputedStyle(node).transform.replace('none', '')
	const direction = params?.direction || Direction.DOWN

	return {
		delay: params?.delay || 0,
		duration: params?.duration || 400,
		easing: params?.easing || cubicOut,
		css: transition => `transform-origin: ${getTransformOrigin(direction)}; transform: ${existingTransform} ${getTransformScale(direction, transition)}; opacity: ${transition};`
	}
}

function getTransformScale(direction: Direction, transition: number): string {
	switch (direction) {
		case Direction.UP:
		case Direction.DOWN:
			return `scaleY(${transition})`
		case Direction.RIGHT:
		case Direction.LEFT:
			return `scaleX(${transition})`
	}
}

function getTransformOrigin(direction: Direction): string {
	switch (direction) {
		case Direction.UP:
			return 'bottom';
		case Direction.RIGHT:
			return 'left';
		case Direction.DOWN:
			return 'top';
		case Direction.LEFT:
			return 'right';
	}
}