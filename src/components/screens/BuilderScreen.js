import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import styles from '../../Styles';

class AttributesScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired
    }

    _renderAttributes() {
        let attributes = [];

        for (let attribute in this.props.template.attributes) {

        }

        return (attribute.join(''))
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Text style={styles.heading}>Attributes</Text>
                {this.props.template.attributes.map((attribute, index) => {
                    return (
                        <Text key={'atr-' + index} style={styles.grey}>{attribute.name}</Text>
                    )
                })}
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('DieRoller')}>
                            <Text uppercase={false} style={styles.buttonText}>Save</Text>
                        </Button>
                    </View>
                </View>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        template: state.builder.template
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AttributesScreen);