import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon, Item, Label } from 'native-base';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CalculatorInput as BaseCalculatorInput } from 'react-native-calculator'
import styles from '../Styles';

export default class CalculatorInput extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        itemKey: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        onAccept: PropTypes.func.isRequired,
        width: PropTypes.number,
        fontSize: PropTypes.number,
        labelFontSize: PropTypes.number,
        stackedLabel: PropTypes.bool,
        boldLabel: PropTypes.bool,
        iconPaddingTop: PropTypes.number,
        paddingLeft: PropTypes.number
    }

    _onAccept(value) {
        this.props.onAccept(this.props.itemKey, value);

        this.currentBodyPointsCalculator.calculatorModalToggle();
    }

	render() {
		return (
            <View style={{flex: 1, flexDirection: 'row', width: scale(this.props.width)}}>
                <Item stackedLabel={this.props.stackedLabel}>
                    <Label style={{fontSize: scale(this.props.labelFontSize), fontWeight: (this.props.boldLabel ? 'bold' : 'normal')}}>{this.props.label}</Label>
                    <BaseCalculatorInput
                        ref={(ref) => this.currentBodyPointsCalculator = ref}
                        fieldContainerStyle={{borderBottomWidth: 0}}
                        fieldTextStyle={[styles.textInput, {textAlign: 'left', paddingTop: verticalScale(15)}]}
                        value={this.props.value.toString()}
                        onAccept={(value) => this._onAccept(value)}
                        modalAnimationType='slide'
                        hasAcceptButton={true}
                        displayTextAlign='left'
                    />
                </Item>
                <Icon
                    type='FontAwesome'
                    name='calculator'
                    style={{fontSize: scale(20), color: '#f57e20', alignSelf: 'center', paddingTop: scale(this.props.iconPaddingTop)}}
                    onPress={() => this.currentBodyPointsCalculator.calculatorModalToggle()}
                />
            </View>
		);
	}
}

CalculatorInput.defaultProps = {
    width: 110,
    fontSize: 12,
    labelFontSize: 10,
    stackedLabel: true,
    boldLabel: false,
    iconPaddingTop: 10,
    paddingLeft: 25
};
