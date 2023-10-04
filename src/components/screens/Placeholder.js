import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import styles from '../../Styles';

export const Placeholder = _props => {
    return (
        <View style={{flex: 1, backgroundColor: styles.container.backgroundColor}}>
            <ActivityIndicator size="large" color={styles.grey.text} paddingTop={50} />
        </View>
    );
};