import { Alert } from 'react-native';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const UPDATE_MASS_ROLLER = 'UPDATE_MASS_ROLLER';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function updateMassRoller(rolls, dice, pips) {
    return {
        type: UPDATE_MASS_ROLLER,
        payload: {
            rolls: rolls,
            dice: dice,
            pips: pips
        }
    };
}

massRollerState = {
    rolls: 1,
    dice: 1,
    pips: 0
};

export default function massRoller(state = massRollerState, action) {
    let newState = null

    switch (action.type) {
        case UPDATE_MASS_ROLLER:
            newState = {...state};
            newState.rolls = parseInt(action.payload.rolls, 10);
            newState.dice = parseInt(action.payload.dice, 10);
            newState.pips = parseInt(action.payload.pips, 10);

            return newState;
        default:
            return state;
    }
}