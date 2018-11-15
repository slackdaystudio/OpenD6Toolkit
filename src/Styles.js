import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container: {
		backgroundColor: '#ffffff'
	},
	content: {
		paddingTop: 0,
		paddingHorizontal: 0
	},
	contentPadded: {
		paddingHorizontal: 5
	},
	heading: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#4f4e4e',
		paddingTop: 10,
		paddingBottom: 10,
		alignSelf: 'center'
	},
	subHeading: {
		alignSelf: 'center',
		fontWeight: 'bold',
		textDecorationLine: 'underline',
		color: '#4f4e4e'
	},
	buttonContainer: {
		paddingVertical: 5
	},
	button: {
		backgroundColor: '#f57e20',
		minWidth: 140,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	modalButton: {
		backgroundColor: '#f57e20',
		minWidth: 90,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	buttonBig: {
		backgroundColor: '#f57e20',
		minWidth: 300,
		justifyContent: 'center',
		alignSelf: 'center'
	},
	buttonText: {
		color: '#FFF'
	},
	grey: {
		color: '#4f4e4e'
	},
	boldGrey: {
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
        flexDirection: 'row'
    },
    row: {
        flex: 1,
        alignSelf: 'stretch',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10
    },
    big: {
	    fontSize: 18,
	    lineHeight: 40
	}
});
