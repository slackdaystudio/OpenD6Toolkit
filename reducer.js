import { Alert } from 'react-native';

import {
    OPTION_ADVANTAGES,
    OPTION_COMPLICATIONS,
    TEMPLATE_FANTASY,
    character
} from './src/lib/Character';

import { common } from './src/lib/Common';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export const SET_TEMPLATE = 'SET_TEMPLATE';

export const UPDATE_CHARACTER_DIE_CODE = 'UPDATE_CHARACTER_DIE_CODE';

export const UPDATE_APPEARANCE = 'UPDATE_APPEARANCE';

export const ADD_OPTION = 'ADD_OPTION';

export const UPDATE_OPTION = 'UPDATE_OPTION';

export const REMOVE_OPTION = 'REMOVE_OPTION';

export const SET_SETTING = 'SET_SETTING';

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

export function addOption(optionKey, item) {
    return {
        type: ADD_OPTION,
        payload: {
            optionKey: optionKey,
            item: item
        }
    };
}

export function updateOption(optionKey, item) {
    return {
        type: UPDATE_OPTION,
        payload: {
            optionKey: optionKey,
            item: item
        }
    };
}

export function removeOption(optionKey, item) {
    return {
        type: REMOVE_OPTION,
        payload: {
            optionKey: optionKey,
            item: item
        }
    };
}

export function setSetting(setting, value) {
    return {
        type: SET_SETTING,
        payload: {
            setting: setting,
            value: value
        }
    }
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    },
    builder: {
        character: null
    },
    settings: {
        isLegend: false
    }
};

export default function reducer(state = initialState, action) {
    let newState = null
    let optionKey = null;

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
        case ADD_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        },
                        complications: {
                            ...state.builder.character.complications
                        }
                    }
                }
            };

            newState.builder.character[optionKey].items.push(action.payload.item);

            return newState;
        case UPDATE_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        },
                        complications: {
                            ...state.builder.character.complications
                        }
                    }
                }
            };

            for (let i = 0; i < newState.builder.character[optionKey].items.length; i++) {
                if (newState.builder.character[optionKey].items[i].id === action.payload.item.id) {
                    newState.builder.character[optionKey].items[i] = {...action.payload.item};
                    break;
                }
            }

            return newState;
       case REMOVE_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        advantages: {
                            ...state.builder.character.advantages
                        },
                        complications: {
                            ...state.builder.character.complications
                        }
                    }
                }
            };

            let index = -1;

            for (let i = 0; i < newState.builder.character[optionKey].items.length; i++) {
                if (newState.builder.character[optionKey].items[i].id === action.payload.item.id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                newState.builder.character[optionKey].items.splice(index, 1);
            }

            return newState;
        case SET_SETTING:
            newState = {
                ...state,
                settings: {
                    ...state.settings,
                }
            };

            if (newState.settings.hasOwnProperty(action.payload.setting)) {
                newState.settings[action.payload.setting] = action.payload.value;
            }

            return newState;
        default:
            return state;
    }
}