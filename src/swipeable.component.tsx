import React, { useState } from 'react';
import type { LayoutRectangle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	runOnJS,
} from 'react-native-reanimated';
import type { ReanimatedContext, SwipeableProps } from './types';
import { CommonSwipeable } from './common.component';

export const Swipeable: React.FC<SwipeableProps> = (props: SwipeableProps) => {
	const [isRightSwipe, setIsRightSwipe] = useState<boolean | null>(null);
	const [wrapperSize, setWrapperSize] = useState<LayoutRectangle>();
	const [rightActionsSize, setRightActionsSize] = useState<LayoutRectangle>();
	const [leftActionsSize, setLeftActionsSize] = useState<LayoutRectangle>();

	const x = useSharedValue(0);

	const gestureHandler = useAnimatedGestureHandler(
		{
			onStart: (event, ctx: ReanimatedContext) => {
				runOnJS(setIsRightSwipe)(
					isRightSwipe === null
						? event.translationX < 0
						: isRightSwipe
				);

				ctx.startX = x.value;
			},
			onActive: (event, ctx: ReanimatedContext) => {
				const isSwipeAvailable =
					isRightSwipe !== null &&
					((props.rightContent && isRightSwipe) ||
						(props.leftContent && !isRightSwipe));

				if (!isSwipeAvailable) return;

				x.value = ctx.startX + event.translationX;

				if (
					(x.value < 0 && !isRightSwipe) ||
					(x.value > 0 && isRightSwipe)
				) {
					x.value = 0;
				}
			},
			onEnd: () => {
				if (x.value === 0 || !wrapperSize) {
					runOnJS(setIsRightSwipe)(null);
					return;
				}

				const eventX = Math.abs(x.value);
				const { width } = wrapperSize;

				const threshold = isRightSwipe
					? props.rightThreshold ?? width / 2
					: props.leftThreshold ?? width / 2;

				const shouldAutomaticallyTrigger =
					threshold - eventX < 0 &&
					((isRightSwipe && props.onRightActionMaximize) ||
						(!isRightSwipe && props.onLeftActionMaximize));

				if (shouldAutomaticallyTrigger) {
					x.value = withTiming(
						isRightSwipe ? -width : width,
						undefined,
						() => {
							isRightSwipe
								? runOnJS(props.onRightActionMaximize!)()
								: runOnJS(props.onLeftActionMaximize!)();
						}
					);
				} else {
					const { width: actionsWidth } = isRightSwipe
						? rightActionsSize!
						: leftActionsSize!;
					const position =
						eventX > actionsWidth
							? isRightSwipe
								? -actionsWidth
								: actionsWidth
							: 0;

					x.value = withTiming(position, undefined, () => {
						position === 0 && runOnJS(setIsRightSwipe)(null);
					});
				}
			},
		},
		[isRightSwipe, wrapperSize, props, rightActionsSize, leftActionsSize]
	);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: x.value,
				},
			],
		};
	});

	return (
		<PanGestureHandler onGestureEvent={gestureHandler}>
			<Animated.View>
				<CommonSwipeable
					{...props}
					isRightSwipe={isRightSwipe}
					wrapperSize={wrapperSize}
					setRightActionsSize={setRightActionsSize}
					setLeftActionsSize={setLeftActionsSize}
					animatedStyle={animatedStyle}
					setWrapperSize={setWrapperSize}
					AnimatedView={Animated.View}
				/>
			</Animated.View>
		</PanGestureHandler>
	);
};
