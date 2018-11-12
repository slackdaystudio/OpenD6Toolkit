import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import styles from '../Styles';

class Sidebar extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object
    }

    _onBuilderPress() {
        if (this.props.character == null || this.props.character.template == null) {
            this.props.navigation.navigate('TemplateSelect');
        } else {
            this.props.navigation.navigate('Builder');
        }
    }

  render() {
    return (
      <Container style={localStyles.container}>
        <Content>
          <List>
        	<ListItem onPress={() => this.props.navigation.navigate('Home')}>
				<View>
					<Image source={require('../../public/d6_logo_Blue_60x60.png')} />
				</View>
	      	</ListItem>
         	<ListItem onPress={() => this.props.navigation.navigate('DieRoller')}>
	      		<Text style={styles.grey}>Roller</Text>
	      	</ListItem>
         	<ListItem onPress={() => this._onBuilderPress()}>
	      		<Text style={styles.grey}>Builder</Text>
	      	</ListItem>
         	<ListItem onPress={() => this.props.navigation.navigate('Ogl')}>
	      		<Text style={styles.grey}>Open Gaming License</Text>
	      	</ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const localStyles = StyleSheet.create({
	container: {
		backgroundColor: '#212121'
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);