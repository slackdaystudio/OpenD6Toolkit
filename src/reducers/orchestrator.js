import uuid from 'react-native-uuid';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const EDIT_ACTOR = 'EDIT_ACTOR';

export const UPDATE_ACTOR_FIELD = 'UPDATE_ACTOR_FIELD';

export const EDIT_ACTOR_ORDER = 'EDIT_ACTOR_ORDER';

export const REMOVE_ACTOR = 'REMOVE_ACTOR';

export const SORT_ACTORS = 'SORT_ACTOR';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function editActor(actor) {
    return {
        type: EDIT_ACTOR,
        payload: actor
    }
}

export function updateActorField(uuid, key, value) {
    return {
        type: UPDATE_ACTOR_FIELD,
        payload: {
            uuid: uuid,
            key: key,
            value: value
        }
    }
}

export function editActorOrder(newOrder) {
    return {
        type: EDIT_ACTOR_ORDER,
        payload: newOrder
    }
}

export function removeActor(uuid) {
    return {
        type: REMOVE_ACTOR,
        payload: uuid
    }
}

export function sortActor() {
    return {
        type: SORT_ACTORS,
        payload: null
    }
}

orchestrationState = {
    actors: null
};

export default function orchestration(state = orchestrationState, action) {
    let newState = null

    switch (action.type) {
        case EDIT_ACTOR:
            newState = {
                ...state,
                actors: {
                    ...state.actors
                }
            };

            if (action.payload.uuid === null) {
                let position = newState.actors === null ? 0 : Object.keys(newState.actors).length;

                if (newState.actors === null) {
                    newState.actors = {0: {}};
                }

                newState.actors[position] = {
                    uuid: uuid.v4(),
                    label: action.payload.label,
                    roll: parseInt(action.payload.roll, 10),
                    engaging: 'Unengaged',
                    useBodyPoints: action.payload.useBodyPoints,
                    maxBodyPoints: action.payload.maxBodyPoints || 0,
                    currentBodyPoints: action.payload.currentBodyPoints || 0,
                    stunned: action.payload.stunned,
                    wounded: action.payload.wounded,
                    severelyWounded: action.payload.severelyWounded,
                    incapacitated: action.payload.incapacitated,
                    mortallyWounded: action.payload.mortallyWounded,
                    dead: action.payload.dead
                };
            } else {
                for (let i = 0; i < Object.keys(newState.actors).length; i++) {
                    if (newState.actors[i].uuid === action.payload.uuid) {
                        newState.actors[i].label = action.payload.label;
                        newState.actors[i].roll = action.payload.roll;
                        newState.actors[i].engaging = action.payload.engaging;
                        newState.actors[i].useBodyPoints = action.payload.useBodyPoints;
                        newState.actors[i].maxBodyPoints = action.payload.maxBodyPoints;
                        newState.actors[i].currentBodyPoints = action.payload.currentBodyPoints;
                        newState.actors[i].stunned = action.payload.stunned;
                        newState.actors[i].wounded = action.payload.wounded;
                        newState.actors[i].severelyWounded = action.payload.severelyWounded;
                        newState.actors[i].incapacitated = action.payload.incapacitated;
                        newState.actors[i].mortallyWounded = action.payload.mortallyWounded;
                        newState.actors[i].dead = action.payload.dead;
                        break;
                    }
                }
            }

            return newState;
        case UPDATE_ACTOR_FIELD:
            newState = {
                ...state,
                actors: {
                    ...state.actors
                }
            };

            for (let i = 0; i < Object.keys(newState.actors).length; i++) {
                if (action.payload.uuid === newState.actors[i].uuid) {
                    // Alert.alert(JSON.stringify(action.payload));
                    newState.actors[i][action.payload.key] = action.payload.value;
                    break;
                }
            }

            return newState;
        case EDIT_ACTOR_ORDER:
            newState = {
                ...state,
                actors: {
                    ...state.actors
                }
            };

            if (action.payload.length > 0) {
                let newInit = {};

                for (let i = 0; i < action.payload.length; i++) {
                    newInit[i] = newState.actors[parseInt(action.payload[i], 10)];
                }

                newState.actors = newInit;
            }

            return newState;
        case REMOVE_ACTOR:
            newState = {
                ...state,
                actors: {
                    ...state.actors
                }
            };

            let deleteKey = -1;

            for (let i = 0; i < Object.keys(newState.actors).length; i++) {
                if (action.payload === newState.actors[i].uuid) {
                    deleteKey = i;
                    break;
                }
            }

            if (deleteKey >= 0) {
                delete newState.actors[deleteKey];

                let newInit = {};
                let i = 0;

                for (let key of Object.keys(newState.actors)) {
                    newInit[i] = newState.actors[key];
                    i++;
                }


                newState.actors = newInit;
            }

            return newState;
        case SORT_ACTORS:
            newState = {
                ...state,
                actors: {
                    ...state.actors
                }
            };

            let actors = [];

            for (let key of Object.keys(newState.actors)) {
                actors.push(newState.actors[key]);
            }

            actors.sort((a, b) => a.roll < b.roll);

            let newActorOrder = {};
            let i = 0;

            for (let key of actors) {
                newActorOrder[i] = {
                    uuid: actors[i].uuid,
                    label: actors[i].label,
                    roll: actors[i].roll
                };
                i++;
            }

            newState.actors = newActorOrder;

            return newState;
        default:
            return state;
    }
}
