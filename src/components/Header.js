import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { Platform, StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Button, Text, Header, Left, Right, Icon } from 'native-base';
import { ScaledSheet } from 'react-native-size-matters';
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
                    <View style={localStyles.logoContainer}>
                        <TouchableHighlight underlayColor='#fde5d2' onPress={() => this.props.navigation.navigate('Home')}>
                            <Image style={localStyles.logo} source={require('../../public/d6_logo_White_512x512.png')} />
                        </TouchableHighlight>
                    </View>
                  </Left>
                  <Right>
                    <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                      <Icon name='menu' style={localStyles.menuIcon} />
                    </Button>
                  </Right>
                </Header>
		    </View>
		);
	}
}

const localStyles = ScaledSheet.create({
	header: {
		backgroundColor: '#f57e20',
		height: Platform.OS === 'ios' ? 60 : '65@vs',
	},
	logoContainer: {
		alignSelf: 'flex-start',
		...Platform.select({
		    ios: {
			    paddingBottom: 20
		    }
		})
	},
	logo: {
        height: '50@vs',
        width: '50@vs'
	},
	menuIcon: {
	    fontSize: '22@vs',
	    color: '#ffffff',
	    paddingBottom:
	    Platform.OS === 'ios' ? 50 : 0
	}
});
