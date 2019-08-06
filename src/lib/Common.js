import { Dimensions, Platform, Alert } from 'react-native';
import { Toast } from 'native-base';

class Common {
    isIPad() {
	    let {height, width} = Dimensions.get('window');

	    if (Platform.OS === 'ios' && height / width <= 1.6) {
		    return true;
	    }

	    return false;
    }

    sum(array) {
        return
    }

    compare(first, second) {
        if (first === null || typeof first !== 'object' || second === null || typeof second !== 'object') {
            return false;
        }

        for (let prop in first) {
            if (!second.hasOwnProperty(prop)) {
                return false;
            }
        }

        return true;
    }

    isInt(value) {
        return Number(value) === value && value % 1 === 0;
    }

    isFloat(value) {
        return Number(value) === value && value % 1 !== 0;
    }

    toCamelCase(text) {
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }

    toast(message) {
        Toast.show({
            text: message,
            position: 'bottom',
            buttonText: 'OK',
            textStyle: {color: '#fde5d2'},
            buttonTextStyle: { color: '#f57e20' },
            duration: 3000
        });
    }
}

export let common = new Common();