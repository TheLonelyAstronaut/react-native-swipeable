import React from 'react';
import {
	FlatList,
	Animated,
	FlatListProps,
	ListRenderItemInfo,
	ListRenderItem,
	NativeSyntheticEvent,
	NativeScrollEvent,
	StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RNGHSwipeable, RNGHSwipeableProps } from '../rngh-swipeable.component';

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

export type SwipeableFlatlistProps<T> = FlatListProps<T> & RNGHSwipeableProps;

export class SwipeableFlatlist<T = any> extends React.Component<
	SwipeableFlatlistProps<T>,
	{}
> {
	private swipeableRefs: Map<string, RNGHSwipeable | null> = new Map();

	renderItem = (data: ListRenderItemInfo<T>) => {
		const uniqueKey = this.props.keyExtractor
			? this.props.keyExtractor(data.item, data.index)
			: 'unknown key';

		return (
			<RNGHSwipeable
				{...this.props}
				ref={(ref) => this.swipeableRefs.set(uniqueKey, ref)}
				onGestureStart={() => this.closeSwipeables(uniqueKey)}
			>
				{this.props.renderItem && this.props.renderItem(data)}
			</RNGHSwipeable>
		);
	};

	closeSwipeables = (key?: string) => {
		this.swipeableRefs.forEach((value, _key) => {
			if (_key !== key) {
				value?.close();
			}
		});
	};

	onScrollStart = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.closeSwipeables();

		this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(event);
	};

	render(): React.ReactNode {
		return (
			<GestureHandlerRootView style={styles.container}>
				<AnimatedFlatlist
					{...this.props}
					renderItem={
						this.renderItem as unknown as ListRenderItem<unknown>
					}
					onScrollBeginDrag={this.onScrollStart}
				/>
			</GestureHandlerRootView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
