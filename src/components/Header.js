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

	_renderSpacer() {
	    if (common.isIPad()) {
		    return <View style={{paddingBottom: 20, backgroundColor: '#375476'}} />
	    }

	    return null;
	}

	render() {
		return (
			<View>
                <Header hasTabs={this.props.hasTabs || false} style={localStyles.header}>
                  <Left>
                    <View style={localStyles.logo}>
                        <TouchableHighlight underlayColor='#3da0ff' onPress={() => this.props.navigation.navigate('Home')}>
                            <Image source={require('../../public/d6logo50-blue.png')} />
                        </TouchableHighlight>
                    </View>
                  </Left>
                  <Right>
                    <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
                      <Icon name='menu' style={{color: '#00ACED', paddingBottom: Platform.OS === 'ios' ? 15 : 0}} />
                    </Button>
                  </Right>
                </Header>
		        {this._renderSpacer()}
		    </View>
		);
	}
}

const localStyles = StyleSheet.create({
	header: {
		backgroundColor: '#0a244f',
		minHeight: Platform.OS === 'ios' ? 60 : 70,
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