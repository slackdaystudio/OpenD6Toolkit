import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Toast } from 'native-base';
import Header from '../Header';
import RanksDialog from '../RanksDialog';
import styles from '../../Styles';
import { character } from '../../lib/Character';
import { addAdvantage } from '../../../reducer';

class AdvantagesScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        addAdvantage: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        let advantages = character.getAdvantages(props.character.advantages.templateId).advantages;

        this.state = {
            advantages: this._initAdvantages(advantages),
            advantageShow: this._initAttributesShow(advantages),
            selectedAdvantage: null,
            showRanksDialog: false
        }

        this.addAdvantageToCharacter = this._addAdvantageToCharacter.bind(this);
        this.closeRanksDialog = this._closeRanksDialog.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Builder');

            return true;
        });
    }

    _initAdvantages(advantages) {
        let advantagesList = [];

        advantages.map((advantage, index) => {
            advantagesList.push(advantage);
        });

        return advantagesList;
    }

    _initAttributesShow(advantages) {
        let advantageShow = {};

        advantages.map((advantage, index) => {
            advantageShow[advantage.name + advantage.rank] = false
        });

        return advantageShow;
    }

    _toggleDescriptionShow(name, rank) {
        let newState = {...this.state};
        newState.advantageShow[name + rank] = !newState.advantageShow[name + rank];

        this.setState(newState);
    }

    _addAdvantage(advantage) {
        if (advantage.multipleRanks) {
            this.setState({
                selectedAdvantage: advantage,
                showRanksDialog: true
            });
        } else {
            this._addAdvantageToCharacter(advantage);
        }
    }

    _addAdvantageToCharacter(advantage) {
        this.props.addAdvantage(advantage);

        Toast.show({
            text: advantage.name + ' has been added',
            position: 'bottom',
            buttonText: 'OK'
        });
    }

    _closeRanksDialog() {
        this.setState({
            selectedAdvantage: null,
            showRanksDialog: false
        });
    }

    _renderDescription(advantage) {
        let description = advantage.description;

        if (this.state.advantageShow[advantage.name + advantage.rank]) {
            return description;
        }

        return description.length > 75 ? description.substring(0, 72) + '...' : description;
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <View style={styles.rowStart}>
                    <View style={{flex: 1, paddingTop: 20, justifyContent: 'space-around', alignItems: 'center'}}>
                        <Icon
                            type='FontAwesome'
                            name='arrow-circle-left'
                            style={[styles.grey, {fontSize: 30, color: '#00ACED'}]}
                            onPress={() => this.props.navigation.navigate('Builder')}
                        />
                    </View>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.heading}>Advantages</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}} />
                </View>
                <View style={{paddingBottom: 20}} />
                {this.state.advantages.map((advantage, index) => {
                    return (
                        <TouchableHighlight
                            key={'advantage-' + index}
                            onPress={() => this._toggleDescriptionShow(advantage.name, advantage.rank)}
                            onLongPress={() => this._addAdvantage(advantage)}
                        >
                            <View style={{borderWidth: 1, borderColor: '#1e1e1e'}}>
                                <CardItem style={{backgroundColor: '#111111'}}>
                                    <Body>
                                        <Text style={styles.grey}>
                                            <Text style={[styles.boldGrey, {fontSize: 20, lineHeight: 22}]}>{advantage.name}, R{advantage.rank + '\n'}</Text>
                                            <Text style={styles.grey}>{this._renderDescription(advantage)}</Text>
                                        </Text>
                                    </Body>
                                </CardItem>
                            </View>
                        </TouchableHighlight>
                    )
                })}
                <View style={{paddingBottom: 20}} />
                <RanksDialog
                    visible={this.state.showRanksDialog}
                    item={this.state.selectedAdvantage}
                    onSave={this.addAdvantageToCharacter}
                    onClose={this.closeRanksDialog}
                />
            </Content>
	      </Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {
    addAdvantage
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvantagesScreen);