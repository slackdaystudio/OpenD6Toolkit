import { Platform, StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { ScaledSheet } from 'react-native-size-matters';

export default ScaledSheet.create({
	container: {
		backgroundColor: '#ffffff',
		height: '100%',
		width: '100%',
		...ifIphoneX({
	        paddingTop: 50
	    }, {
	        paddingTop: (Platform.OS === 'ios' ? 20 : 0)
	    })
	},
	content: {
		paddingTop: 0,
		paddingHorizontal: 0
	},
	contentPadded: {
		paddingHorizontal: 5
	},
	heading: {
		fontSize: '25@s',
		fontFamily: 'Tempus Sans ITC',
		color: '#4f4e4e',
		paddingTop: '3@s',
		paddingBottom: '3@s',
		alignSelf: 'center'
	},
	subHeading: {
		alignSelf: 'center',
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		color: '#4f4e4e'
	},
	buttonContainer: {
		paddingVertical: '10@vs'
	},
	button: {
		backgroundColor: '#f57e20',
		minWidth: '160@s',
		height: '45@vs',
		alignSelf: 'center',
		flexDirection: 'row'
	},
	buttonText: {
	    color: '#FFF',
        fontSize: '15@s',
        lineHeight: '25@vs',
        textAlign: 'center',
        alignSelf: 'center',
        flex: 10
	},
	picker: {
	    height: '35@vs'
	},
	textInput: {
		fontSize: '14@s',
		color: '#4f4e4e',
		justifyContent: 'flex-start',
		lineHeight: '20@vs',
		height: '40@vs',
		paddingTop: 0
	},
	grey: {
		fontSize: '14@s',
		color: '#4f4e4e',
		justifyContent: 'flex-start'
	},
	boldGrey: {
		fontSize: '14@s',
		color: '#4f4e4e',
		fontWeight: 'bold'
	},
	tabInactive: {
		backgroundColor: '#3a557f'
	},
	tabActive: {
		backgroundColor: '#476ead'
	},
	tabBarUnderline: {
		backgroundColor: '#3da0ff'
	},
	tabContent: {
	    flex: 1,
		backgroundColor: '#375476'
	},
    rowStart: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    row: {
        flex: 1,
        alignSelf: 'flex-start',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10
    },
    big: {
	    fontSize: '16@s',
	    lineHeight: '30@vs'
	},
	modal: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f57e20',
        flex: 1,
        flexDirection: 'column',
        maxHeight: '310@vs'
	},
	modalContent: {
	    backgroundColor: '#ffffff',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '255@vs'
    },
    errorMessage: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#bc1212',
        backgroundColor: '#e8b9b9',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        fontSize: 20,
        lineHeight: 25
    }
});
