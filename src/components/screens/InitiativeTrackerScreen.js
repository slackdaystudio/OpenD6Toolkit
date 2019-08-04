import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import { Container, View, Content, Text, Icon, Fab, Footer, FooterTab, Button } from 'native-base';
import SortableList from 'react-native-sortable-list';
import Header from '../Header';
import Heading from '../Heading';
import InitiativeRow from '../InitiativeRow';
import InitiativeDialog from '../InitiativeDialog';
import styles from '../../Styles';
import { editInitiative, editInitiativeOrder, removeInitiative, sortInitiative } from '../../../reducer';

const window = Dimensions.get('window');

class InitiativeTrackerScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        initiativeEntries: PropTypes.object,
        editInitiative: PropTypes.func.isRequired,
        removeInitiative: PropTypes.func.isRequired,
        sortInitiative: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            initDialog: {
                visible: false,
                uuid: null,
                roll: 0,
                label: '',
                errorMessage: null
            },
            newOrder: []
        };

        this.open = this._open.bind(this);
        this.updateOrder = this._updateOrder.bind(this);
        this.updateInitiative = this._updateInitiative.bind(this);
        this.remove = this._remove.bind(this);
        this.close = this._close.bind(this);
        this.save = this._save.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

 	componentWillUnmount() {
   		this.backHandler.remove();
   	}

    _open() {
        let newState = {...this.state};
        newState.initDialog.visible = true;
        newState.initDialog.uuid = null;
        newState.initDialog.label = '';
        newState.initDialog.roll = 0;

        this.setState(newState);
    }

    _close() {
        let newState = {...this.state};
        newState.initDialog.visible = false;

        this.setState(newState);
    }

    _save(uuid, label, roll) {
        let newState = {...this.state};

        this.props.editInitiative(uuid, label, roll);

        newState.initDialog.visible = false;
        newState.initDialog.uuid = uuid;
        newState.initDialog.label = label;
        newState.initDialog.roll = parseInt(roll, 10);

        this.setState(newState);
    }

    _updateOrder(newOrder) {
        let newState = {...this.state};
        newState.newOrder = newOrder;

        this.setState(newState);
    }

    _remove(uuid) {
        let newState = {...this.state};

        this.props.removeInitiative(uuid);

        newState.initDialog.visible = false;

        this.setState(newState);
    }

    _updateInitiative(key) {
        let newState = {...this.state};
        newState.initDialog.visible = true;

        for (let i = 0; i < Object.keys(this.props.initiativeEntries).length; i++) {
            if (i === parseInt(key, 10)) {
                newState.initDialog.uuid = this.props.initiativeEntries[i.toString()].uuid;
                newState.initDialog.label = this.props.initiativeEntries[i.toString()].label;
                newState.initDialog.roll = parseInt(this.props.initiativeEntries[i.toString()].roll, 10);
                break;
            }
        }

        this.setState(newState);
    }

    _sort() {
        if (this.props.initiativeEntries != null && this.props.initiativeEntries != {}) {
            this.props.sortInitiative();
        }
    }

    _renderBody() {
        if (this.props.initiativeEntries === null) {
            return (
                <View style={localStyles.container}>
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Add a character entry to get started.</Text>
                </View>
            );
        }

        return (
            <View style={localStyles.container}>
                <SortableList
                    style={localStyles.list}
                    contentContainerStyle={localStyles.contentContainer}
                    data={this.props.initiativeEntries}
                    renderRow={this._renderRow}
                    onChangeOrder={(nextOrder) => this.updateOrder(nextOrder)}
                    onReleaseRow={() => this.props.editInitiativeOrder(this.state.newOrder)}
                    onPressRow={(key) => this.updateInitiative(key)}
                    autoscrollAreaSize={6000}
                />
            </View>
        );
    }

    _renderRow = ({data, active}) => {
        return <InitiativeRow data={data} active={active} />
    }

    render() {
        return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Heading text='Initiative Tracker' onBackButtonPress={() => this.props.navigation.navigate('Home')} onAddButtonPress={() => this.open()}/>
                {this._renderBody()}
                <View style={{paddingBottom: 20}} />
                <InitiativeDialog
                    visible={this.state.initDialog.visible}
                    uuid={this.state.initDialog.uuid}
                    label={this.state.initDialog.label}
                    roll={this.state.initDialog.roll}
                    onClose={this.close}
                    onSave={this.save}
                    onRemove={this.remove}
                />
                <Footer>
                    <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                        <Button vertical onPress={() => this._sort()}>
                            <Icon type='FontAwesome' name='sort-down' style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>Sort</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
    }),

  },
  list: {
    flex: 1,
  },
  contentContainer: {
    width: window.width,
    ...Platform.select({
      ios: {
        paddingHorizontal: 30,
      },
      android: {
        paddingHorizontal: 0,
      }
    })
  },
});

const mapStateToProps = state => {
    return {
        initiativeEntries: state.initiativeEntries
    };
}

const mapDispatchToProps = {
    editInitiative,
    editInitiativeOrder,
    removeInitiative,
    sortInitiative
}

export default connect(mapStateToProps, mapDispatchToProps)(InitiativeTrackerScreen);