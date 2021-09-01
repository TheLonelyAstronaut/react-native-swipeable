import {
	LayoutRectangle,
	StyleSheet,
	View,
	Animated as RNAnimated,
	ViewStyle,
} from 'react-native';
import type Animated from 'react-native-reanimated';
import React from 'react';
import type { SwipeableProps } from './types';

export type CommonSwipeableProps = SwipeableProps & {
	isRightSwipe: boolean | null;
	wrapperSize: LayoutRectangle | undefined;
	setRightActionsSize: (state: LayoutRectangle | undefined) => void;
	setLeftActionsSize: (state: LayoutRectangle | undefined) => void;
	animatedStyle:
		| RNAnimated.WithAnimatedValue<ViewStyle>
		| Animated.AnimateStyle<ViewStyle>;
	setWrapperSize: (state: LayoutRectangle | undefined) => void;
	AnimatedView: typeof Animated.View | typeof RNAnimated.View;
};

export const CommonSwipeable: React.FC<CommonSwipeableProps> = ({
	isRightSwipe,
	rightContent,
	wrapperSize,
	rightBackgroundStyle,
	setRightActionsSize,
	leftContent,
	leftBackgroundStyle,
	setLeftActionsSize,
	animatedStyle,
	setWrapperSize,
	children,
	AnimatedView,
}: CommonSwipeableProps) => {
	return (
		<AnimatedView>
			{isRightSwipe
				? rightContent && (
						<View
							style={[
								styles.rightContent,
								{
									width: wrapperSize?.width,
									height: wrapperSize?.height,
									...rightBackgroundStyle,
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
								{rightContent()}
							</View>
						</View>
				  )
				: leftContent && (
						<View
							style={[
								styles.leftContent,
								{
									width: wrapperSize?.width,
									height: wrapperSize?.height,
									...leftBackgroundStyle,
								},
							]}
						>
							<View
								onLayout={(event) =>
									setLeftActionsSize(event.nativeEvent.layout)
								}
							>
								{leftContent()}
							</View>
						</View>
				  )}
			<AnimatedView
				style={animatedStyle}
				onLayout={(event) => setWrapperSize(event.nativeEvent.layout)}
			>
				{children}
			</AnimatedView>
		</AnimatedView>
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
