import { Alert } from 'react-native';

import { TEMPLATE_FANTASY, character } from './src/lib/Character';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export const SET_TEMPLATE = 'SET_TEMPLATE'

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    }
}

export function setTemplate(name) {
    return {
        type: SET_TEMPLATE,
        payload: character.loadTemplate(name)
    }
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    },
    builder: {
        character: null
    }
}

export default function reducer(state = initialState, action) {
    let newState = null

    switch (action.type) {
        case UPDATE_ROLLER:
            newState = {...state};
            newState.roller.dice = parseInt(action.payload.dice, 10);
            newState.roller.pips = parseInt(action.payload.pips, 10);

            return newState;
        case SET_TEMPLATE:
            newState = {...state};
            newState.builder.character = character.create(action.payload);

            return newState;
        default:
            return state;
    }
}