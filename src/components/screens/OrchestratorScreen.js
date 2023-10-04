import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Container, View, Text, Icon, Footer, FooterTab, Button} from 'native-base';
import SortableList from 'react-native-sortable-list';
import Header from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import ActorRow from '../ActorRow';
import styles from '../../Styles';
import {common} from '../../lib/Common';
import {editActorOrder, removeActor, sortActor, updateActorField} from '../../reducers/orchestrator';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const window = Dimensions.get('window');

class OrchestratorScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        removeActor: PropTypes.func.isRequired,
        sortActor: PropTypes.func.isRequired,
        updateActorField: PropTypes.func.isRequired,
        actors: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            newOrder: [],
            toBeRemovedUuid: null,
            confirmationDialog: {
                visible: false,
                title: 'Delete Actor?',
                info: 'This is permanent, are you certain you wish to delete this actor?',
            },
        };

        this.updateOrder = this._updateOrder.bind(this);
        this.remove = this._remove.bind(this);
        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._removeConfirmed.bind(this);
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
        if (!common.isEmptyObject(this.props.actors)) {
            this.props.sortActor();
        }
    }

    _renderBody() {
        if (common.isEmptyObject(this.props.actors)) {
            return (
                <View style={localStyles.container}>
                    <Text style={[styles.grey]}>Add a character entry to get started.</Text>
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
                    onChangeOrder={nextOrder => this.updateOrder(nextOrder)}
                    onReleaseRow={() => this.props.editActorOrder(this.state.newOrder)}
                />
            </View>
        );
    }

    _renderRow = ({data, active}) => {
        return (
            <ActorRow
                navigation={this.props.navigation}
                data={data}
                active={active}
                combatants={this.props.actors}
                onRemove={this.remove}
                onUpdate={this.props.updateActorField}
            />
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Heading
                    text="Orchestrator"
                    onBackButtonPress={() => this.props.navigation.navigate('Home')}
                    onAddButtonPress={() => this.props.navigation.navigate('EditActor', {actor: null})}
                />
                {this._renderBody()}
                <View style={{paddingBottom: 20}} />
                <Footer>
                    <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                        <Button vertical onPress={() => this._sort()}>
                            <Icon type="FontAwesome" name="sort-down" style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>
                                Sort
                            </Text>
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
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
    list: {
        flex: 1,
    },
    contentContainer: {
        width: window.width,
        height: window.height,
        paddingHorizontal: Platform.OS === 'ios' ? 30 : 0,
    },
});

const mapStateToProps = state => {
    return {
        actors: state.orchestrator.actors,
    };
};

const mapDispatchToProps = {
    editActorOrder,
    removeActor,
    sortActor,
    updateActorField,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrchestratorScreen);
