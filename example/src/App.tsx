import * as React from 'react';

import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	FlatList,
	Button,
} from 'react-native';
import { Swipeable } from 'react-native-swipeable';

const rightBackgroundColor = '#ff0000';
const leftBackgroundColor = '#0000ff';

const RightContent = () => (
	<Button title={'Delete'} onPress={() => console.log('Delete')} />
);

const renderItem = () => (
	<Swipeable
		leftBackgroundStyle={{ backgroundColor: rightBackgroundColor }}
		rightBackgroundStyle={{ backgroundColor: leftBackgroundColor }}
		rightContent={() => <RightContent />}
		leftContent={() => <RightContent />}
		onRightActionMaximize={() => console.log('Right maximize')}
		onLeftActionMaximize={() => console.log('Left maximize')}
	>
		<View style={styles.box}>
			<View style={styles.spacer} />
			<Text>For the power of Swipe!</Text>
			<View style={styles.spacer} />
		</View>
	</Swipeable>
);

export default function App() {
	return (
		<SafeAreaView>
			<FlatList
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
