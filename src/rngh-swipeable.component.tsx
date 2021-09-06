import React, { Component, PropsWithChildren } from 'react';
import {
	Animated,
	StyleSheet,
	I18nManager,
	View,
	Dimensions,
	ViewStyle,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export type RNGHSwipeableProps = PropsWithChildren<{
	onGestureStart?: () => void;
	actionsWidth?: number;
	rightContent?: () => React.ReactNode;
	rightBackgroundStyle?: ViewStyle;
}>;

export class RNGHSwipeable extends Component<RNGHSwipeableProps, {}> {
	private listenerID: string | undefined;
	private isOpened = false;

	componentDidMount() {
		this.listenerID = this.swipeableRow?.state.dragX.addListener(
			({ value }) => {
				if (value !== 0 && !this.isOpened) {
					this.props.onGestureStart && this.props.onGestureStart();

					this.isOpened = true;
				}

				if (value === 0 && this.isOpened) {
					this.isOpened = false;
				}
			}
		);
	}

	componentWillUnmount() {
		this.listenerID &&
			this.swipeableRow?.state.dragX.removeListener(this.listenerID);
	}

	private renderRightActions = (
		progress: Animated.AnimatedInterpolation,
		_dragAnimatedValue: Animated.AnimatedInterpolation
	) => {
		const witdh = this.props.actionsWidth ?? Dimensions.get('window').width;

		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [witdh, 0],
			extrapolate: 'extend',
		});

		return (
			<View
				style={{
					...this.props.rightBackgroundStyle,
					...styles.textPosition,
					width: witdh,
				}}
			>
				<Animated.View
					style={{
						...this.props.rightBackgroundStyle,
						...styles.spacer,
						transform: [{ translateX: trans }],
					}}
				>
					<View style={[styles.rightAction]}>
						{this.props.rightContent && this.props.rightContent()}
					</View>
				</Animated.View>
			</View>
		);
	};

	private swipeableRow?: Swipeable;

	private updateRef = (ref: Swipeable) => {
		this.swipeableRow = ref;
	};

	close = () => {
		this.swipeableRow?.close();
	};

	render() {
		const { children } = this.props;

		return (
			<Swipeable
				ref={this.updateRef}
				friction={1}
				enableTrackpadTwoFingerGesture
				rightThreshold={40}
				containerStyle={this.props.rightBackgroundStyle}
				renderRightActions={this.renderRightActions}
			>
				{children}
			</Swipeable>
		);
	}
}

const styles = StyleSheet.create({
	leftAction: {
		flex: 1,
		backgroundColor: '#497AFC',
		justifyContent: 'center',
	},
	actionText: {
		color: 'white',
		fontSize: 16,
		backgroundColor: 'transparent',
		padding: 10,
	},
	rightAction: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
	},
	spacer: {
		flex: 1,
	},
	textPosition: {
		flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
	},
});
