import * as React from 'react';

import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	Button,
	Alert,
} from 'react-native';
// @ts-ignore
import { SwipeableFlatlist } from 'react-native-swipeable-reanimated';
import { useCallback } from 'react';

const rightBackgroundColor = '#ff0000';

export default function App() {
	const renderItem = useCallback(
		() => (
			<View style={styles.box}>
				<View style={styles.spacer} />
				<Text>For the power of Swipe!</Text>
				<View style={styles.spacer} />
				<Button
					title={'Meh test'}
					onPress={() => Alert.alert('Bruh')}
				/>
			</View>
		),
		[]
	);

	const RightContent = () => <Text>Delete</Text>;

	return (
		<SafeAreaView>
			<SwipeableFlatlist
				data={[1, 2, 3, 4, 5]}
				rightContent={() => <RightContent />}
				rightBackgroundStyle={{ backgroundColor: rightBackgroundColor }}
				renderItem={renderItem}
				actionsWidth={80}
				keyExtractor={(data: number) => data.toFixed(36)}
				onRightActionPress={(id: string) => console.log(id)}
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
