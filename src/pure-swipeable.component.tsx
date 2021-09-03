import React, { useRef, useState } from 'react';
import type { SwipeableProps } from './types';
// @ts-ignore
import Swipeable from 'react-native-swipeable';
import { Animated, LogBox, View } from 'react-native';
import ValueXY = Animated.ValueXY;

LogBox.ignoreLogs([
	'Animated:',
	'Warning: componentWillMount',
	'Animated.event',
]);

export const PureSwipeable: React.FC<SwipeableProps> = (
	props: SwipeableProps
) => {
	const panValue = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
	const [rightActionSize, setRightActionSize] = useState(0);
	const [rememberState, setRememberState] = useState(false);

	console.log(rememberState, props.isSwipeAvailable);

	return (
		<Swipeable
			rightButtons={
				props.isSwipeAvailable || rememberState
					? [
							<View
								onLayout={(event) =>
									setRightActionSize(
										event.nativeEvent.layout.width
									)
								}
							>
								{props.rightContent}
							</View>,
					  ]
					: undefined
			}
			rightActionActivationDistance={100}
			rightButtonWidth={rightActionSize}
			rightButtonContainerStyle={{
				flex: 1,
				...props.rightBackgroundStyle,
				justifyContent: 'flex-end',
				flexDirection: 'row-reverse',
				alignItems: 'center',
			}}
			leftButtons={props.leftContent && [props.leftContent]}
			leftButtonContainerStyle={
				props.leftContent && {
					flex: 1,
					...props.leftBackgroundStyle,
					justifyContent: 'flex-start',
					flexDirection: 'row',
					alignItems: 'center',
				}
			}
			onSwipeStart={() => {
				setRememberState(
					props.isSwipeAvailable
						? props.isSwipeAvailable
						: rememberState
				);

				props.onSwipeStart && props.onSwipeStart();
			}}
			onRightButtonsCloseRelease={() => {
				setRememberState(false);

				props.onSwipeEnd && props.onSwipeEnd();
			}}
			onPanAnimatedValueRef={(ref: ValueXY) => (panValue.current = ref)}
		>
			{props.children}
		</Swipeable>
	);
};

/*
leftContent={
				<View
					style={{
						...props.leftBackgroundStyle,
						flex: 1,
						justifyContent: 'center',
						flexDirection: 'row-reverse',
					}}
				>
					<Animated.View>{props.leftContent}</Animated.View>
				</View>
			}
			rightContent={
				<View
					style={{
						...props.rightBackgroundStyle,
						flex: 1,
						justifyContent: 'flex-end',
						flexDirection: 'row-reverse',
						alignItems: 'center',
					}}
				>
					<Animated.View
						style={{
							transform: [
								{
									translateX: Animated.multiply(
										panValue.current.x,
										-0.6
									),
								},
							],
						}}
					>
						{props.rightContent}
					</Animated.View>
				</View>
			}
 */
