import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text, List, ListItem, Left, Right, Icon } from 'native-base';
import Header from '../Header';
import styles from '../../Styles';
import { character, TEMPLATE_FANTASY } from '../../lib/Character';
import { setTemplate } from '../../../reducer';

class TemplateSelectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object,
        setTemplate: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: TEMPLATE_FANTASY
        };
    }

    _next(templateName) {
        this.setState({selected: templateName}, () => {
            this.props.setTemplate(templateName);

            this.props.navigation.navigate('Builder');
        });
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Text style={styles.heading}>Template Select</Text>
                <Text style={styles.grey}>Select your template from the list below.</Text>
                <List>
                    {character.getTemplates().map((template, index) => {
                        return (
                            <ListItem noIndent key={'t-' + index} onPress={() => this._next(template.name)}>
                                <Left>
                                    <Text style={styles.grey}>{template.name}</Text>
                                </Left>
                                <Right>
                                    <Icon style={styles.grey} name="arrow-forward" />
                                </Right>
                            </ListItem>
                        );

                    })}
                </List>
                <View style={{paddingBottom: 20}} />
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
    setTemplate
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateSelectScreen);