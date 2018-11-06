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
            newState.roller.dice = action.payload.dice;
            newState.roller.pips = action.payload.pips;

            return newState;
        default:
            return state;
    }
}