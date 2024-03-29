import {Platform} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {ScaledSheet} from 'react-native-size-matters';

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

export default ScaledSheet.create({
    container: {
        backgroundColor: '#ffffff',
        height: '100%',
        width: '100%',
        ...ifIphoneX(
            {
                paddingTop: 50,
            },
            {
                paddingTop: Platform.OS === 'ios' ? 20 : 0,
            },
        ),
    },
    content: {
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 0,
    },
    contentPadded: {
        paddingHorizontal: 5,
    },
    heading: {
        fontSize: '25@s',
        fontFamily: 'Tempus Sans ITC',
        color: '#4f4e4e',
        paddingTop: '3@s',
        paddingBottom: '3@s',
        alignSelf: 'center',
    },
    subHeading: {
        alignSelf: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#4f4e4e',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '130@vs',
        height: '43@vs',
        paddingHorizontal: '5@s',
        backgroundColor: '#f57e20',
        borderWidth: 0.5,
        borderColor: '#FFECCE',
        borderRadius: '5@vs',
    },
    buttonSmall: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '100@s',
        height: '43@vs',
        backgroundColor: '#f57e20',
        borderWidth: 0.5,
        borderColor: '#FFECCE',
        borderRadius: '5@vs',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: '14@vs',
        color: '#fff',
        textTransform: 'uppercase',
        paddingHorizontal: '20@s',
    },
    picker: {
        height: '35@vs',
    },
    textInput: {
        fontSize: '14@s',
        color: '#4f4e4e',
        justifyContent: 'flex-start',
        lineHeight: '20@vs',
        height: '40@vs',
        paddingTop: 0,
    },
    grey: {
        fontSize: '14@s',
        color: '#4f4e4e',
        justifyContent: 'flex-start',
    },
    boldGrey: {
        fontSize: '14@s',
        color: '#4f4e4e',
        fontWeight: 'bold',
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: '18@vs',
        lineHeight: '19@vs',
        color: '#4f4e4e',
    },
    chartLegend: {
        fontWeight: 'bold',
        fontSize: '14@vs',
        lineHeight: '15@vs',
        color: '#4f4e4e',
    },
    textSmall: {
        fontSize: '10@vs',
        lineHeight: '15@vs',
        color: '#4f4e4e',
    },
    tabInactive: {
        backgroundColor: '#3a557f',
    },
    tabActive: {
        backgroundColor: '#476ead',
    },
    tabBarUnderline: {
        backgroundColor: '#3da0ff',
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#375476',
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
        paddingTop: 10,
    },
    big: {
        fontSize: '16@s',
        lineHeight: '30@vs',
    },
    modal: {
        flex: 0,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f57e20',
    },
    modalHeader: {
        fontSize: '18@vs',
        lineHeight: '19@vs',
        paddingLeft: '10@s',
        color: '#fff',
        paddingVertical: '10@vs',
        backgroundColor: '#f57e20',
        width: '100%',
        borderColor: '#f57e20',
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    modalContent: {
        flex: 0,
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        justifyContent: 'center',
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
        lineHeight: 25,
    },
    card: {
        backgroundColor: '#fff',
    },
    cardItem: {
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: '16@vs',
        fontWeight: 'bold',
        color: '#e8e8e8',
    },
    textAreaInput: {
        color: '#4f4e4e',
        borderWidth: 0.5,
        borderColor: '#f57e20',
        backgroundColor: 'rgba(193, 235, 255, 0.1)',
        fontSize: '14@vs',
        textAlignVertical: 'top',
    },
});
