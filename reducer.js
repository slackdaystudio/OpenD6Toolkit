import { Alert } from 'react-native';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    }
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    }
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_ROLLER:
            let newState = {...state}
            newState.roller.dice = parseInt(action.payload.dice, 10);
            newState.roller.pips = parseInt(action.payload.pips, 10);

            return newState;
        default:
            return state;
    }
}