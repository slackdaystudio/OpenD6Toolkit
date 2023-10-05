import {Dimensions, Platform} from 'react-native';
import {Toast} from 'native-base';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class Common {
    isIPad() {
        let {height, width} = Dimensions.get('window');

        if (Platform.OS === 'ios' && height / width <= 1.6) {
            return true;
        }

        return false;
    }

    isEmptyObject(obj) {
        if (obj === null) {
            return true;
        }

        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    sum(array) {
        return;
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
        return text
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            })
            .replace(/\s+/g, '');
    }

    toast(message) {
        Toast.show({
            text: message,
            position: 'bottom',
            buttonText: 'OK',
            textStyle: {color: '#fde5d2'},
            buttonTextStyle: {color: '#f57e20'},
            duration: 3000,
        });
    }

    toExponentialNotation(value, decimalPlaces = 1) {
        return Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
    }
}

export let common = new Common();
