import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon, Item, Label } from 'native-base';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { CalculatorInput as BaseCalculatorInput } from 'react-native-calculator'

export default class CalculatorInput extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        itemKey: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        onAccept: PropTypes.func.isRequired,
        width: PropTypes.number,
        fontSize: PropTypes.number,
        stackedLabel: PropTypes.bool,
        boldLabel: PropTypes.bool,
        alignment: PropTypes.string,
        iconPaddingTop: PropTypes.number
    }

    _onAccept(value) {
        this.props.onAccept(this.props.itemKey, value);

        this.currentBodyPointsCalculator.calculatorModalToggle();
    }

	render() {
		return (
		    <View style={{alignSelf: this.props.alignment}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Item stackedLabel={this.props.stackedLabel} style={{width: this.props.width}}>
                        <Label style={{fontSize: scale(10), fontWeight: (this.props.boldLabel ? 'bold' : 'normal')}}>{this.props.label}</Label>
                        <BaseCalculatorInput
                            ref={(ref) => this.currentBodyPointsCalculator = ref}
                            fieldContainerStyle={{borderBottomWidth: 0}}
                            fieldTextStyle={{fontSize: scale(this.props.fontSize), width: scale(this.props.width), paddingTop: scale(13)}}
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
            </View>
		);
	}
}

CalculatorInput.defaultProps = {
    width: 75,
    fontSize: 14,
    stackedLabel: true,
    boldLabel: false,
    alignment: 'flex-start',
    iconPaddingTop: 20
};
