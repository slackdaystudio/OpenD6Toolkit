import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { Platform, StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Button, Text, Header, Left, Right, Icon } from 'native-base';
import { common } from '../lib/Common';

export default class MyHeader extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        hasTabs: PropTypes.bool
    }

	render() {
		return (
			<View>
                <Header hasTabs={this.props.hasTabs || false} style={localStyles.header}>
                  <Left>
                    <View style={localStyles.logo}>
                        <TouchableHighlight underlayColor='#fde5d2' onPress={() => this.props.navigation.navigate('Home')}>
                            <Image source={require('../../public/d6_logo_White_60x60.png')} />
                        </TouchableHighlight>
                    </View>
                  </Left>
                  <Right>
                    <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                      <Icon name='menu' style={{color: '#ffffff', paddingBottom: Platform.OS === 'ios' ? 50 : 0}} />
                    </Button>
                  </Right>
                </Header>
		    </View>
		);
	}
}

const localStyles = StyleSheet.create({
	header: {
		backgroundColor: '#f57e20',
		height: Platform.OS === 'ios' ? 60 : 70,
	},
	logo: {
		paddingLeft: 5,
		alignSelf: 'flex-start',
		...Platform.select({
		    ios: {
			    paddingBottom: 20
		    }
		})
	}
});
