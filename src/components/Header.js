import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Platform, View, Image, TouchableHighlight} from 'react-native';
import {Button, Header, Left, Right, Icon} from 'native-base';
import {ScaledSheet} from 'react-native-size-matters';

export default class MyHeader extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        hasTabs: PropTypes.bool,
    };

    render() {
        return (
            <View>
                <Header hasTabs={this.props.hasTabs || false} style={localStyles.header} androidStatusBarColor={localStyles.header.backgroundColor}>
                    <Left>
                        <View style={localStyles.logoContainer}>
                            <TouchableHighlight underlayColor="#fde5d2" onPress={() => this.props.navigation.navigate('Home')}>
                                <Image style={localStyles.logo} source={require('../../public/d6_logo_White_512x512.png')} />
                            </TouchableHighlight>
                        </View>
                    </Left>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name="bars" type="FontAwesome" style={localStyles.menuIcon} />
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
        height: Platform.OS === 'ios' ? '75@vs' : '65@vs',
    },
    logoContainer: {
        alignSelf: 'flex-start',
        ...Platform.select({
            ios: {
                paddingBottom: '15@vs',
            },
        }),
    },
    logo: {
        height: '50@vs',
        width: '50@vs',
    },
    menuIcon: {
        fontSize: '22@vs',
        color: '#ffffff',
        paddingBottom: Platform.OS === 'ios' ? '30@vs' : 0,
    },
});
