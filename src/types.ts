import type React from 'react';
import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

export type ReanimatedContext = { startX: number };

export type SwipeableProps = PropsWithChildren<{
	leftThreshold?: number;
	rightThreshold?: number;
	leftBackgroundStyle?: ViewStyle;
	rightBackgroundStyle?: ViewStyle;
	leftContent?: () => React.ReactNode;
	rightContent?: () => React.ReactNode;
	onRightActionMaximize?: () => void;
	onLeftActionMaximize?: () => void;
	onSwipeStart?: () => void;
	onSwipeEnd?: () => void;
	isListScrollable?: boolean;
}>;
