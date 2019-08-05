import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import { Container, View, Content, Text, Icon, Fab, Footer, FooterTab, Button } from 'native-base';
import SortableList from 'react-native-sortable-list';
import Header from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import ActorRow from '../ActorRow';
import styles from '../../Styles';
import { editActorOrder, removeActor, sortActor } from '../../reducers/orchestrator';

const window = Dimensions.get('window');

class OrchestratorScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        removeActor: PropTypes.func.isRequired,
        sortActor: PropTypes.func.isRequired,
        actors: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            newOrder: [],
            toBeRemovedUuid: null,
            confirmationDialog: {
                visible: false,
                title: 'Delete Actor?',
                info: 'This is permanent, are you certain you wish to delete this actor?'
            }
        };

        this.updateOrder = this._updateOrder.bind(this);
        this.remove = this._remove.bind(this);
        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._removeConfirmed.bind(this);
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

    _remove(uuid) {
        let newState = {...this.state};
        newState.toBeRemovedUuid = uuid;
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _removeConfirmed() {
        this.props.removeActor(this.state.toBeRemovedUuid);

        this.setState({toBeRemovedUuid: null}, () => {
            this._closeConfirmationDialog();
        });
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _updateOrder(newOrder) {
        let newState = {...this.state};
        newState.newOrder = newOrder;

        this.setState(newState);
    }

    _sort() {
        if (this.props.actors != null && this.props.actors != {}) {
            this.props.sortActor();
        }
    }

    _renderBody() {
        if (this.props.actors === null) {
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
                    data={this.props.actors}
                    renderRow={this._renderRow}
                    onChangeOrder={(nextOrder) => this.updateOrder(nextOrder)}
                    onReleaseRow={() => this.props.editActorOrder(this.state.newOrder)}
                />
            </View>
        );
    }

    _renderRow = ({data, active}) => {
        return <ActorRow navigation={this.props.navigation} data={data} active={active} onRemove={this.remove}/>
    }

    render() {
        return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Heading
                    text='Orchestrator'
                    onBackButtonPress={() => this.props.navigation.navigate('Home')}
                    onAddButtonPress={() => this.props.navigation.navigate('EditActor', {actor: null})}
                />
                {this._renderBody()}
                <View style={{paddingBottom: 20}} />
                <Footer>
                    <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                        <Button vertical onPress={() => this._sort()}>
                            <Icon type='FontAwesome' name='sort-down' style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>Sort</Text>
                        </Button>
                    </FooterTab>
                </Footer>
                <ConfirmationDialog
                    visible={this.state.confirmationDialog.visible}
                    title={this.state.confirmationDialog.title}
                    info={this.state.confirmationDialog.info}
                    onOk={this.onOk}
                    onClose={this.onClose}
                />
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
    height: window.height,
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
        actors: state.orchestrator.actors
    };
}

const mapDispatchToProps = {
    editActorOrder,
    removeActor,
    sortActor
}

export default connect(mapStateToProps, mapDispatchToProps)(OrchestratorScreen);