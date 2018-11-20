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
		fontFamily: 'Tempus Sans ITC',
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
		minWidth: 160,
		height: 45,
		alignSelf: 'center',
		flexDirection: 'row'
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
		color: '#FFF',
	    fontSize: 18,
	    lineHeight: 40,
	    flex: 2
	},
	picker: {
		color: '#4f4e4e'
	},
	grey: {
		color: '#4f4e4e',
		fontFamily: 'Arial, Helvetica-Nue, Tempus Sans ITC',
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
	},
	modal: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f57e20',
        flex: 1,
        flexDirection: 'column',
        maxHeight: 310
	},
	modalContent: {
	    backgroundColor: '#ffffff',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'stretch',
        height: 255
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
