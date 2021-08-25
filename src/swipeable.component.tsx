import React, { PropsWithChildren, useState } from 'react';
import { LayoutRectangle, StyleSheet, View, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	runOnJS,
} from 'react-native-reanimated';

export type ReanimatedContext = { startX: number };

export type SwipeableProps = PropsWithChildren<{
	leftTreshold?: number;
	rightTreshold?: number;
	leftBackgroundStyle?: ViewStyle;
	rightBackgroundStyle?: ViewStyle;
	leftContent?: () => React.ReactNode;
	rightContent?: () => React.ReactNode;
	onRightActionMaximize?: () => void;
	onLeftActionMaximize?: () => void;
}>;

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

				const treshold = isRightSwipe
					? props.rightTreshold ?? width / 2
					: props.leftTreshold ?? width / 2;

				const shouldAutomaticallyTrigger =
					treshold - eventX < 0 &&
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
				{isRightSwipe
					? props.rightContent && (
							<View
								style={[
									styles.rightContent,
									{
										width: wrapperSize?.width,
										height: wrapperSize?.height,
										...props.rightBackgroundStyle,
									},
								]}
							>
								<View
									onLayout={(event) =>
										setRightActionsSize(
											event.nativeEvent.layout
										)
									}
								>
									{props.rightContent()}
								</View>
							</View>
					  )
					: props.leftContent && (
							<View
								style={[
									styles.leftContent,
									{
										width: wrapperSize?.width,
										height: wrapperSize?.height,
										...props.leftBackgroundStyle,
									},
								]}
							>
								<View
									onLayout={(event) =>
										setLeftActionsSize(
											event.nativeEvent.layout
										)
									}
								>
									{props.leftContent()}
								</View>
							</View>
					  )}
				<Animated.View
					style={animatedStyle}
					onLayout={(event) =>
						setWrapperSize(event.nativeEvent.layout)
					}
				>
					{props.children}
				</Animated.View>
			</Animated.View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	rightContent: {
		position: 'absolute',
		alignItems: 'center',
		flexDirection: 'row-reverse',
	},
	leftContent: {
		position: 'absolute',
		alignItems: 'center',
		flexDirection: 'row',
	},
});
