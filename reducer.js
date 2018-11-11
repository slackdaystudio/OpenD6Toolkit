import { Alert } from 'react-native';

import { TEMPLATE_FANTASY, character } from './src/lib/Character';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export const SET_TEMPLATE = 'SET_TEMPLATE';

export const UPDATE_CHARACTER_DIE_CODE = 'UPDATE_CHARACTER_DIE_CODE';

export const UPDATE_APPEARANCE = 'UPDATE_APPEARANCE';

export const ADD_ADVANTAGE = 'ADD_ADVANTAGE';

export const UPDATE_ADVANTAGE = 'UPDATE_ADVANTAGE';

export const REMOVE_ADVANTAGE = 'REMOVE_ADVANTAGE';

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    };
}

export function setTemplate(name) {
    return {
        type: SET_TEMPLATE,
        payload: character.loadTemplate(name)
    };
}

export function updateCharacterDieCode(dieCode) {
    return {
        type: UPDATE_CHARACTER_DIE_CODE,
        payload: dieCode
    };
}

export function updateAppearance(key, value) {
    return {
        type: UPDATE_APPEARANCE,
        payload: {
            key: key,
            value: value
        }
    };
}

export function addAdvantage(advantage) {
    return {
        type: ADD_ADVANTAGE,
        payload: advantage
    };
}

export function updateAdvantage(advantage) {
    return {
        type: UPDATE_ADVANTAGE,
        payload: advantage
    };
}

export function removeAdvantage(advantage) {
    return {
        type: REMOVE_ADVANTAGE,
        payload: advantage
    };
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    },
    builder: {
        character: null
    }
};

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
        case UPDATE_CHARACTER_DIE_CODE:
            newState = {...state};
            let skillOrAttribute = newState.builder.character.getAttributeOrSkill(action.payload.identifier);
            skillOrAttribute.dice = action.payload.dice;
            skillOrAttribute.modifierDice = action.payload.modifierDice;
            skillOrAttribute.pips = action.payload.pips;
            skillOrAttribute.modifierPips = action.payload.modifierPips;

            return newState;
        case UPDATE_APPEARANCE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };

            newState.builder.character[action.payload.key] = action.payload.value;

            return newState;
        case ADD_ADVANTAGE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        }
                    }
                }
            };

            newState.builder.character.advantages.advantages.push(action.payload);

            return newState;
        case UPDATE_ADVANTAGE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        }
                    }
                }
            };

            for (let advantage of newState.builder.character.advantages.advantages) {
                if (advantage.id === action.payload.id) {
                    advantage.totalRanks = action.payload.totalRanks;
                }
            }

            return newState;
       case REMOVE_ADVANTAGE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        }
                    }
                }
            };

            let index = -1;

            for (let i = 0; i < newState.builder.character.advantages.advantages.length; i++) {
                if (newState.builder.character.advantages.advantages[i].id === action.payload.id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                newState.builder.character.advantages.advantages.splice(index, 1);
            }

            return newState;
        default:
            return state;
    }
}