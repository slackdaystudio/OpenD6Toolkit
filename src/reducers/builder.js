import {character} from '../lib/Character';
import uuid from 'react-native-uuid';
import {common} from '../lib/Common';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const SET_TEMPLATE = 'SET_TEMPLATE';

export const UPDATE_CHARACTER_DIE_CODE = 'UPDATE_CHARACTER_DIE_CODE';

export const UPDATE_APPEARANCE = 'UPDATE_APPEARANCE';

export const EDIT_SPECIALIZATION = 'EDIT_SPECIALIZATION';

export const DELETE_SPECIALIZATION = 'DELETE_SPECIALIZATION';

export const ADD_OPTION = 'ADD_OPTION';

export const UPDATE_OPTION = 'UPDATE_OPTION';

export const REMOVE_OPTION = 'REMOVE_OPTION';

export const UPDATE_HEALTH_SYSTEM = 'UPDATE_HEALTH_SYSTEM';

export const UPDATE_WOUNDS = 'UPDATE_WOUNDS';

export const UPDATE_BODY_POINTS = 'UPDATE_BODY_POINTS';

export const UPDATE_DEFENSE_SYSTEM = 'UPDATE_DEFENSE_SYSTEM';

export const UPDATE_STATIC_DEFENSE = 'UPDATE_STATIC_DEFENSE';

export const LOAD_CHARACTER = 'LOAD_CHARACTER';

export const CLEAR_LOADED_CHARACTER = 'CLEAR_LOADED_CHARACTER';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function setTemplate(template) {
    return {
        type: SET_TEMPLATE,
        payload: template,
    };
}

export function updateCharacterDieCode(dieCode) {
    return {
        type: UPDATE_CHARACTER_DIE_CODE,
        payload: dieCode,
    };
}

export function updateAppearance(key, value) {
    return {
        type: UPDATE_APPEARANCE,
        payload: {
            key: key,
            value: value,
        },
    };
}

export function editSpecialization(specialization) {
    return {
        type: EDIT_SPECIALIZATION,
        payload: specialization,
    };
}

export function deleteSpecialization(specialization) {
    return {
        type: DELETE_SPECIALIZATION,
        payload: specialization,
    };
}

export function addOption(optionKey, item) {
    return {
        type: ADD_OPTION,
        payload: {
            optionKey: optionKey,
            item: item,
        },
    };
}

export function updateOption(optionKey, item) {
    return {
        type: UPDATE_OPTION,
        payload: {
            optionKey: optionKey,
            item: item,
        },
    };
}

export function removeOption(optionKey, item) {
    return {
        type: REMOVE_OPTION,
        payload: {
            optionKey: optionKey,
            item: item,
        },
    };
}

export function updateHealthSystem(isBodyPoints) {
    return {
        type: UPDATE_HEALTH_SYSTEM,
        payload: null,
    };
}

export function updateWounds(woundLevel) {
    return {
        type: UPDATE_WOUNDS,
        payload: woundLevel,
    };
}

export function updateBodyPoints(key, value) {
    return {
        type: UPDATE_BODY_POINTS,
        payload: {
            key: key,
            value: value,
        },
    };
}

export function updateDefenseSystem() {
    return {
        type: UPDATE_DEFENSE_SYSTEM,
        payload: null,
    };
}

export function updateStaticDefense(key, value) {
    return {
        type: UPDATE_STATIC_DEFENSE,
        payload: {
            key: key,
            value: value,
        },
    };
}

export function loadCharacter(character) {
    return {
        type: LOAD_CHARACTER,
        payload: character,
    };
}

export function clearLoadedCharacter() {
    return {
        type: CLEAR_LOADED_CHARACTER,
        payload: null,
    };
}

const builderState = {
    character: null,
};

export default function builder(state = builderState, action) {
    let newState = null;
    let optionKey = null;

    switch (action.type) {
        case SET_TEMPLATE:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            newState.character = character.create(action.payload);

            return newState;
        case UPDATE_CHARACTER_DIE_CODE:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            let skillOrAttribute = character.getAttributeOrSkill(newState.character, action.payload.identifier);

            skillOrAttribute.dice = action.payload.dice;
            skillOrAttribute.modifierDice = action.payload.modifierDice;
            skillOrAttribute.pips = action.payload.pips;
            skillOrAttribute.modifierPips = action.payload.modifierPips;

            return newState;
        case UPDATE_APPEARANCE:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            newState.character[action.payload.key] = action.payload.value;

            return newState;
        case EDIT_SPECIALIZATION:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            if (action.payload.uuid === null) {
                action.payload.uuid = uuid.v4();

                newState.character.specializations.push(action.payload);
            } else {
                for (let i = 0; i < newState.character.specializations.length; i++) {
                    if (newState.character.specializations[i].uuid === action.payload.uuid) {
                        newState.character.specializations[i] = {...action.payload};
                        break;
                    }
                }
            }

            return newState;
        case DELETE_SPECIALIZATION:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            for (let i = 0; i < newState.character.specializations.length; i++) {
                if (newState.character.specializations[i].uuid === action.payload.uuid) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                newState.character.specializations.splice(index, 1);
            }

            return newState;
        case ADD_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);

            newState = {
                ...state,
                character: {
                    ...state.character,
                    advantages: {
                        ...state.character.advantages,
                    },
                    complications: {
                        ...state.character.complications,
                    },
                    specialAbilities: {
                        ...state.character.specialAbilities,
                    },
                },
            };

            action.payload.item.uuid = uuid.v4();

            newState.character[optionKey].items.push(action.payload.item);

            return newState;
        case UPDATE_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);

            newState = {
                ...state,
                character: {
                    ...state.character,
                    advantages: {
                        ...state.character.advantages,
                    },
                    complications: {
                        ...state.character.complications,
                    },
                    specialAbilities: {
                        ...state.character.specialAbilities,
                    },
                },
            };

            for (let i = 0; i < newState.character[optionKey].items.length; i++) {
                if (newState.character[optionKey].items[i].uuid === action.payload.item.uuid) {
                    newState.character[optionKey].items[i] = {...action.payload.item};
                    break;
                }
            }

            return newState;
        case REMOVE_OPTION:
            optionKey = common.toCamelCase(action.payload.optionKey);
            newState = {
                ...state,
                character: {
                    ...state.character,
                    advantages: {
                        ...state.character.advantages,
                    },
                    complications: {
                        ...state.character.complications,
                    },
                    specialAbilities: {
                        ...state.character.specialAbilities,
                    },
                },
            };

            let index = -1;

            for (let i = 0; i < newState.character[optionKey].items.length; i++) {
                if (newState.character[optionKey].items[i].uuid === action.payload.item.uuid) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                newState.character[optionKey].items.splice(index, 1);
            }

            return newState;
        case UPDATE_HEALTH_SYSTEM:
            newState = {
                ...state,
                character: {
                    ...state.character,
                    health: {
                        ...state.character.health,
                    },
                },
            };

            newState.character.health.useBodyPoints = !newState.character.health.useBodyPoints;

            return newState;
        case UPDATE_WOUNDS:
            newState = {
                ...state,
                character: {
                    ...state.character,
                    health: {
                        ...state.character.health,
                        wounds: {...state.character.health.wounds},
                    },
                },
            };

            newState.character.health.wounds[action.payload] = !state.character.health.wounds[action.payload];

            return newState;
        case UPDATE_BODY_POINTS:
            newState = {
                ...state,
                character: {
                    ...state.character,
                    health: {
                        ...state.character.health,
                    },
                },
            };

            newState.character.health.bodyPoints[action.payload.key] = action.payload.value;

            return newState;
        case UPDATE_DEFENSE_SYSTEM:
            newState = {
                ...state,
                character: {
                    ...state.character,
                    defenses: {
                        ...state.character.defenses,
                    },
                },
            };

            newState.character.defenses.useStaticDefenses = !newState.character.defenses.useStaticDefenses;

            return newState;
        case UPDATE_STATIC_DEFENSE:
            newState = {
                ...state,
                character: {
                    ...state.character,
                    defenses: {
                        ...state.character.defenses,
                    },
                },
            };

            newState.character.defenses.staticDefenses[action.payload.key] = action.payload.value;

            return newState;
        case LOAD_CHARACTER:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            newState.character = typeof action.payload === 'string' ? JSON.parse(action.payload) : action.payload;

            return newState;
        case CLEAR_LOADED_CHARACTER:
            newState = {
                ...state,
                character: {
                    ...state.character,
                },
            };

            newState.character = null;

            return newState;
        default:
            return state;
    }
}
