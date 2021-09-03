import React, { useRef, useState } from 'react';
import type { SwipeableProps } from './types';
// @ts-ignore
import Swipeable from 'react-native-swipeable';
import { Animated, LogBox, StyleSheet, View } from 'react-native';

LogBox.ignoreLogs([
	'Animated:',
	'Warning: componentWillMount',
	'Animated.event',
]);

export const PureSwipeable: React.FC<SwipeableProps> = (
	props: SwipeableProps
) => {
	const panValue = useRef(new Animated.ValueXY({ x: 0, y: 0 }));
	const wasButtonReleased = useRef(false);
	const [rightActionSize, setRightActionSize] = useState(0);
	const [rememberState, setRememberState] = useState(false);

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
			rightButtonContainerStyle={
				props.rightContent && {
					...styles.rightContainer,
					...props.rightBackgroundStyle,
				}
			}
			leftButtons={props.leftContent && [props.leftContent]}
			leftButtonContainerStyle={
				props.leftContent && {
					...styles.leftContainer,
					...props.leftBackgroundStyle,
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
			onRightButtonsOpenRelease={() => {
				wasButtonReleased.current = true;
			}}
			onRightButtonsCloseRelease={() => {
				wasButtonReleased.current = false;
			}}
			onSwipeComplete={() => {
				const isSwipeEnabled = props.isSwipeAvailable || rememberState;

				if (!wasButtonReleased.current && isSwipeEnabled) {
					setRememberState(false);

					props.onSwipeEnd && props.onSwipeEnd();
				}
			}}
			onPanAnimatedValueRef={(ref: Animated.ValueXY) =>
				(panValue.current = ref)
			}
		>
			{props.children}
		</Swipeable>
	);
};

const styles = StyleSheet.create({
	leftContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
	},
	rightContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		flexDirection: 'row-reverse',
		alignItems: 'center',
	},
});

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
