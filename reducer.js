import { Alert } from 'react-native';
import {
    OPTION_ADVANTAGES,
    OPTION_COMPLICATIONS,
    TEMPLATE_FANTASY,
    character
} from './src/lib/Character';
//var uuid = require('react-native-uuid');
import uuid from 'react-native-uuid';
import { common } from './src/lib/Common';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export const SET_TEMPLATE = 'SET_TEMPLATE';

export const UPDATE_CHARACTER_DIE_CODE = 'UPDATE_CHARACTER_DIE_CODE';

export const UPDATE_APPEARANCE = 'UPDATE_APPEARANCE';

export const EDIT_SPECIALIZATION = 'EDIT_SPECIALIZATION';

export const DELETE_SPECIALIZATION = 'DELETE_SPECIALIZATION';

export const ADD_OPTION = 'ADD_OPTION';

export const UPDATE_OPTION = 'UPDATE_OPTION';

export const REMOVE_OPTION = 'REMOVE_OPTION';

export const SET_SETTING = 'SET_SETTING';

export const LOAD_CHARACTER = 'LOAD_CHARACTER';

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    };
}

export function setTemplate(template) {
    return {
        type: SET_TEMPLATE,
        payload: template
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

export function editSpecialization(specialization) {
    return {
        type: EDIT_SPECIALIZATION,
        payload: specialization
    };
}

export function deleteSpecialization(specialization) {
    return {
        type: DELETE_SPECIALIZATION,
        payload: specialization
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

export function loadCharacter(character) {
    return {
        type: LOAD_CHARACTER,
        payload: character
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
        isLegend: false,
        fileDir: null
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
            let skillOrAttribute = character.getAttributeOrSkill(newState.builder.character, action.payload.identifier);
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
        case EDIT_SPECIALIZATION:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };

            if (action.payload.uuid === null) {
                action.payload.uuid = uuid.v4();

                newState.builder.character.specializations.push(action.payload);
            } else {
                for (let i = 0; i < newState.builder.character.specializations.length; i++) {
                    if (newState.builder.character.specializations[i].uuid === action.payload.uuid) {
                        newState.builder.character.specializations[i] = {...action.payload};
                        break;
                    }
                }
            }

            return newState;
        case DELETE_SPECIALIZATION:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };

            for (let i = 0; i < newState.builder.character.specializations.length; i++) {
                if (newState.builder.character.specializations[i].uuid === action.payload.uuid) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                newState.builder.character.specializations.splice(index, 1);
            }

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

            action.payload.item.uuid = uuid.v4();

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
                if (newState.builder.character[optionKey].items[i].uuid === action.payload.item.uuid) {
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
                if (newState.builder.character[optionKey].items[i].uuid === action.payload.item.uuid) {
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
        case LOAD_CHARACTER:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };

            newState.builder.character = JSON.parse(action.payload);

            return newState;
        default:
            return state;
    }
}