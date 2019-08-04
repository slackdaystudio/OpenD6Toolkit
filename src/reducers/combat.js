import { Alert } from 'react-native';
import uuid from 'react-native-uuid';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const EDIT_INITIATIVE = 'EDIT_INITIATIVE';

export const EDIT_INITIATIVE_ORDER = 'EDIT_INITIATIVE_ORDER';

export const REMOVE_INITIATIVE = 'REMOVE_INITIATIVE';

export const SORT_INITIATIVE = 'SORT_INITIATIVE';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function editInitiative(uuid, label, roll) {
    return {
        type: EDIT_INITIATIVE,
        payload: {
            uuid: uuid,
            label: label,
            roll: roll
        }
    }
}

export function editInitiativeOrder(newOrder) {
    return {
        type: EDIT_INITIATIVE_ORDER,
        payload: newOrder
    }
}

export function removeInitiative(uuid) {
    return {
        type: REMOVE_INITIATIVE,
        payload: uuid
    }
}

export function sortInitiative() {
    return {
        type: SORT_INITIATIVE,
        payload: null
    }
}

combatState = {
    initiativeEntries: null
};

export default function combat(state = combatState, action) {
    let newState = null

    switch (action.type) {
        case EDIT_INITIATIVE:
            newState = {
                ...state,
                initiativeEntries: {
                    ...state.initiativeEntries
                }
            };

            if (action.payload.uuid === null) {
                if (newState.initiativeEntries === null) {
                    newState.initiativeEntries = {
                        0: {
                            uuid: uuid.v4(),
                            label: action.payload.label,
                            roll: parseInt(action.payload.roll, 10)
                        }
                    }
                } else {
                    let position = Object.keys(newState.initiativeEntries).length;

                    newState.initiativeEntries[position] = {
                        uuid: uuid.v4(),
                        label: action.payload.label,
                        roll: parseInt(action.payload.roll, 10)
                    };
                }
            } else {
                for (let i = 0; i < Object.keys(newState.initiativeEntries).length; i++) {
                    if (newState.initiativeEntries[i].uuid === action.payload.uuid) {
                        newState.initiativeEntries[i].label = action.payload.label;
                        newState.initiativeEntries[i].roll = action.payload.roll;
                        break;
                    }
                }
            }

            return newState;
        case EDIT_INITIATIVE_ORDER:
            newState = {
                ...state,
                initiativeEntries: {
                    ...state.initiativeEntries
                }
            };

            if (action.payload.length > 0) {
                let newInit = {};

                for (let i = 0; i < action.payload.length; i++) {
                    newInit[i] = newState.initiativeEntries[parseInt(action.payload[i], 10)];
                }

                newState.initiativeEntries = newInit;
            }

            return newState;
        case REMOVE_INITIATIVE:
            newState = {
                ...state,
                initiativeEntries: {
                    ...state.initiativeEntries
                }
            };

            let deleteKey = -1;

            for (let i = 0; i < Object.keys(newState.initiativeEntries).length; i++) {
                if (action.payload === newState.initiativeEntries[i].uuid) {
                    deleteKey = i;
                    break;
                }
            }

            if (deleteKey >= 0) {
                delete newState.initiativeEntries[deleteKey];

                let newInit = {};
                let i = 0;

                for (let key of Object.keys(newState.initiativeEntries)) {
                    newInit[i] = newState.initiativeEntries[key];
                    i++;
                }


                newState.initiativeEntries = newInit;
            }

            return newState;
        case SORT_INITIATIVE:
            newState = {
                ...state,
                initiativeEntries: {
                    ...state.initiativeEntries
                }
            };

            let initiatives = [];

            for (let key of Object.keys(newState.initiativeEntries)) {
                initiatives.push(newState.initiativeEntries[key]);
            }

            initiatives.sort((a, b) => a.roll < b.roll);

            let newInit = {};
            let i = 0;

            for (let key of initiatives) {
                newInit[i] = {
                    uuid: initiatives[i].uuid,
                    label: initiatives[i].label,
                    roll: initiatives[i].roll
                };
                i++;
            }

            newState.initiativeEntries = newInit;

            return newState;
        default:
            return state;
    }
}