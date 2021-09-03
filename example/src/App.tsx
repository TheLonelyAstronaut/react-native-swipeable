import * as React from 'react';

import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	FlatList,
	Button,
	Alert,
} from 'react-native';
// @ts-ignore
import { PureSwipeable } from 'react-native-swipeable-reanimated';
import { useCallback, useState } from 'react';

const rightBackgroundColor = '#ff0000';
const leftBackgroundColor = '#0000ff';

const RightContent = () => (
	<Button title={'Delete'} onPress={() => console.log('Delete')} />
);

export default function App() {
	const [scrollEnabled, setScrollEnabled] = useState(true);
	const [swipeAvailable, setSwipeAvailable] = useState(true);

	const renderItem = useCallback(
		() => (
			<PureSwipeable
				leftBackgroundStyle={{ backgroundColor: rightBackgroundColor }}
				rightBackgroundStyle={{ backgroundColor: leftBackgroundColor }}
				rightContent={<RightContent />}
				onRightActionMaximize={() => console.log('Right maximize')}
				onLeftActionMaximize={() => console.log('Left maximize')}
				onSwipeStart={() => {
					setScrollEnabled(false);
					setSwipeAvailable(false);
				}}
				onSwipeEnd={() => {
					setScrollEnabled(true);
					setSwipeAvailable(true);
				}}
				isSwipeAvailable={swipeAvailable}
			>
				<View style={styles.box}>
					<View style={styles.spacer} />
					<Text>For the power of Swipe!</Text>
					<View style={styles.spacer} />
					<Button
						title={'Meh test'}
						onPress={() => Alert.alert('Bruh')}
					/>
				</View>
			</PureSwipeable>
		),
		[swipeAvailable]
	);

	return (
		<SafeAreaView>
			<FlatList
				scrollEnabled={scrollEnabled}
				data={[1, 2, 3, 4, 5]}
				renderItem={renderItem}
				keyExtractor={(data) => data.toFixed(36)}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'gray',
	},
	box: {
		flexDirection: 'row',
		height: 140,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	spacer: {
		flex: 1,
	},
});
