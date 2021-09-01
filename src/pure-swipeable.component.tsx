import React, { useRef, useState } from 'react';
import type { SwipeableProps } from './types';
import { LayoutRectangle, Animated, View, PanResponder } from 'react-native';
import { CommonSwipeable } from './common.component';

export const PureSwipeable: React.FC<SwipeableProps> = (
	props: SwipeableProps
) => {
	const animatedValue = useRef(new Animated.Value(0)).current;
	const gestureDelta = useRef<number>(0);
	const startPosition = useRef<number | null>(null);
	const wrapperSize = useRef<LayoutRectangle | null>();
	const rightActionsSize = useRef<LayoutRectangle | null>();
	const leftActionsSize = useRef<LayoutRectangle | null>();
	const isRightSwipeValue = useRef<boolean>(false);
	const [isRightSwipe, setIsRightSwipe] = useState<boolean | null>(null);

	const panResponder = useRef(
		PanResponder.create({
			onPanResponderMove: (event, gestureState) => {
				if (gestureState.dx === 0) {
					props.onSwipeEnd && props.onSwipeEnd();
					return;
				}

				isRightSwipeValue.current =
					startPosition.current === null
						? gestureState.dx < 0
						: isRightSwipeValue.current;

				if (!startPosition.current) {
					startPosition.current = event.nativeEvent.locationX;
				}

				setIsRightSwipe(isRightSwipeValue.current);

				const isSwipeAvailable =
					(props.rightContent && isRightSwipeValue.current) ||
					(props.leftContent && !isRightSwipeValue.current);

				if (!isSwipeAvailable) return;

				let value = gestureState.dx + gestureDelta.current;

				animatedValue.setValue(value);

				if (
					(value < 0 && !isRightSwipeValue.current) ||
					(value > 0 && isRightSwipeValue.current)
				) {
					animatedValue.setValue(0);
				}
			},
			onPanResponderEnd: () => {
				const value = (animatedValue as any)._value;

				if (value === 0) {
					setIsRightSwipe(null);
					animatedValue.setValue(0);
					startPosition.current = null;
					gestureDelta.current = 0;

					return;
				}

				props.onSwipeEnd && props.onSwipeEnd();

				const eventX = Math.abs(value);
				const { width } = wrapperSize.current!;

				const threshold = isRightSwipe
					? props.rightThreshold ?? width / 2
					: props.leftThreshold ?? width / 2;

				const shouldAutomaticallyTrigger =
					threshold - eventX < 0 &&
					((isRightSwipeValue.current &&
						props.onRightActionMaximize) ||
						(!isRightSwipeValue.current &&
							props.onLeftActionMaximize));

				if (shouldAutomaticallyTrigger) {
					gestureDelta.current = isRightSwipeValue.current
						? -width
						: width;

					Animated.timing(animatedValue, {
						toValue: isRightSwipeValue.current ? -width : width,
						duration: 300,
						useNativeDriver: true,
					}).start(() => {
						//startPosition.current = null;

						isRightSwipeValue.current
							? props.onRightActionMaximize &&
							  props.onRightActionMaximize()
							: props.onLeftActionMaximize &&
							  props.onLeftActionMaximize();
					});
				} else {
					let actionsWidth = isRightSwipeValue.current
						? rightActionsSize?.current?.width
						: leftActionsSize?.current?.width;

					actionsWidth = actionsWidth ?? 0;

					const position =
						eventX > actionsWidth
							? isRightSwipeValue.current
								? -actionsWidth
								: actionsWidth
							: 0;

					if (position) {
						gestureDelta.current = position;
					} else {
						gestureDelta.current = 0;
						startPosition.current = null;
					}

					Animated.timing(animatedValue, {
						toValue: position,
						duration: 300,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	return (
		<View
			{...panResponder.panHandlers}
			onMoveShouldSetResponderCapture={(_) => {
				props.onSwipeStart && props.onSwipeStart();
				return true;
			}}
		>
			<CommonSwipeable
				{...props}
				isRightSwipe={isRightSwipe}
				wrapperSize={wrapperSize.current!}
				setRightActionsSize={(data) =>
					(rightActionsSize.current = data)
				}
				setLeftActionsSize={(data) => (leftActionsSize.current = data)}
				animatedStyle={{
					transform: [
						{
							translateX: animatedValue,
						},
					],
				}}
				setWrapperSize={(data) => (wrapperSize.current = data)}
				AnimatedView={Animated.View}
			/>
		</View>
	);
};
