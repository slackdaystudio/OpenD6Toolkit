import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon, Item, Label } from 'native-base';
import { CalculatorInput as BaseCalculatorInput } from 'react-native-calculator'

export default class CalculatorInput extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        itemKey: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        onAccept: PropTypes.func.isRequired,
        width: PropTypes.number,
        fontSize: PropTypes.number
    }

    _onAccept(value) {
        this.props.onAccept(this.props.itemKey, value);

        this.currentBodyPointsCalculator.calculatorModalToggle();
    }

	render() {
		return (
		    <View style={{flex: 1, flexDirection: 'row'}}>
                <Item stackedLabel style={{width: this.props.width}}>
                    <Label>{this.props.label}</Label>
                    <BaseCalculatorInput
                        ref={(ref) => this.currentBodyPointsCalculator = ref}
                        fieldContainerStyle={{borderBottomWidth: 0}}
                        fieldTextStyle={{fontSize: this.props.fontSize, width: this.props.width}}
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
                    style={{fontSize: 20, color: '#f57e20', alignSelf: 'center', paddingTop: 20}}
                    onPress={() => this.currentBodyPointsCalculator.calculatorModalToggle()}
                />
            </View>
		);
	}
}

CalculatorInput.defaultProps = {
    width: 75,
    fontSize: 18
};