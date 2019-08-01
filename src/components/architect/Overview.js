import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Text, CardItem, Card, Left, Right, Body, Button, Icon, Form, Item, Input, Label } from 'native-base';
import { SwipeRow } from 'react-native-swipe-list-view';
import styles from '../../Styles';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import { character } from '../../lib/Character';
import { updateTemplateOverview } from '../../../reducer';

class Overview extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
        updateTemplateOverview: PropTypes.func.isRequired,
        isTemplateNameUnique: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            template: props.template
        };
    }

    _updateTemplateOverview(key, value) {
        let errorMessage = null;

        if (key === 'name' && value === '') {
            errorMessage = 'Name cannot be blank';
        } else  {
            if (value !== '') {
                let intValue = parseInt(value === '' ? 0 : value, 10);

                if (intValue < 0) {
                    value = 1
                }
            }
        }

        if (errorMessage == null) {
            let newState = {...this.state};
            newState.template[key] = value;

            this.setState(newState);
        } else {
            Toast.show({
                text: errorMessage,
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        }
    }

	render() {
		return (
            <View>
                <Heading text='Overview' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.name}
                            onChangeText={(value) => this._updateTemplateOverview('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Attribute Minimum</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.attributeMin.toString()}
                            onChangeText={(value) => this._updateTemplateOverview('attributeMin', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Attribute Maximum</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.attributeMax.toString()}
                            onChangeText={(value) => this._updateTemplateOverview('attributeMax', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Move</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.move.toString()}
                            onChangeText={(value) => this._updateTemplateOverview('move', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Character Points</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.characterPoints.toString()}
                            onChangeText={(value) => this._updateTemplateOverview('characterPoints', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Fate Points</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.template.fatePoints.toString()}
                            onChangeText={(value) => this._updateTemplateOverview('fatePoints', value)}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
            </View>
		);
	}
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = {
    updateTemplateOverview
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);