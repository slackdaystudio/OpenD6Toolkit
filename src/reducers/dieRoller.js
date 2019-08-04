import { Alert } from 'react-native';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    };
}

dieRollerState = {
    dice: 1,
    pips: 0
};

export default function dieRoller(state = dieRollerState, action) {
    let newState = null

    switch (action.type) {
        case UPDATE_ROLLER:
            newState = {...state};
            newState.dice = parseInt(action.payload.dice, 10);
            newState.pips = parseInt(action.payload.pips, 10);

            return newState;
        default:
            return state;
    }
}