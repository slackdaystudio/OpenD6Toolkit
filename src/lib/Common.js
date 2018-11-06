import { Dimensions, Platform } from 'react-native';

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
}

export let common = new Common();