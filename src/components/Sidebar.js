import React, { Component } from "react";
import { StyleSheet, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import styles from '../Styles';

export default class Sidebar extends Component {
  render() {
    return (
      <Container style={localStyles.container}>
        <Content>
          <List>
        	<ListItem onPress={() => this.props.navigation.navigate('Home')}>
				<View>
					<Image source={require('../../public/d6logo50-blue.png')} />
				</View>
	      	</ListItem>
         	<ListItem onPress={() => this.props.navigation.navigate('DieRoller')}>
	      		<Text style={styles.grey}>Roller</Text>
	      	</ListItem>
         	<ListItem onPress={() => this.props.navigation.navigate('Builder')}>
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