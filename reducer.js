import { Alert } from 'react-native';
import {
    OPTION_ADVANTAGES,
    OPTION_COMPLICATIONS,
    TEMPLATE_FANTASY,
    character
} from './src/lib/Character';
import uuid from 'react-native-uuid';
import { common } from './src/lib/Common';

export const UPDATE_ROLLER = 'UPDATE_ROLLER';

export const UPDATE_MASS_ROLLER = 'UPDATE_MASS_ROLLER';

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

export const SET_SETTING = 'SET_SETTING';

export const LOAD_CHARACTER = 'LOAD_CHARACTER';

export const CLEAR_LOADED_CHARACTER = 'CLEAR_LOADED_CHARACTER';

export const EDIT_INITIATIVE = 'EDIT_INITIATIVE';

export const EDIT_INITIATIVE_ORDER = 'EDIT_INITIATIVE_ORDER';

export const REMOVE_INITIATIVE = 'REMOVE_INITIATIVE';

export const SORT_INITIATIVE = 'SORT_INITIATIVE';

export const SET_ARCHITECT_TEMPLATE = 'SET_ARCHITECT_TEMPLATE';

export function updateRoller(dice, pips) {
    return {
        type: UPDATE_ROLLER,
        payload: {
            dice: dice,
            pips: pips
        }
    };
}

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

export function updateHealthSystem(isBodyPoints) {
    return {
        type: UPDATE_HEALTH_SYSTEM,
        payload: null
    };
}

export function updateWounds(woundLevel) {
    return {
        type: UPDATE_WOUNDS,
        payload: woundLevel
    };
}

export function updateBodyPoints(key, value) {
    return {
        type: UPDATE_BODY_POINTS,
        payload: {
            key: key,
            value: value
        }
    };
}

export function updateDefenseSystem() {
    return {
        type: UPDATE_DEFENSE_SYSTEM,
        payload: null
    };
}

export function updateStaticDefense(key, value) {
    return {
        type: UPDATE_STATIC_DEFENSE,
        payload: {
            key: key,
            value: value
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

export function clearLoadedCharacter() {
    return {
        type: CLEAR_LOADED_CHARACTER,
        payload: null
    }
}

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

export function setArchitectTemplate(template) {
    return {
        type: SET_ARCHITECT_TEMPLATE,
        payload: template
    }
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    },
    massRoller: {
        rolls: 1,
        dice: 1,
        pips: 0
    },
    builder: {
        character: null
    },
    architect: {
        template: null
    },
    initiativeEntries: null,
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
        case UPDATE_MASS_ROLLER:
            newState = {...state};
            newState.massRoller.rolls = parseInt(action.payload.rolls, 10);
            newState.massRoller.dice = parseInt(action.payload.dice, 10);
            newState.massRoller.pips = parseInt(action.payload.pips, 10);

            return newState;
        case SET_TEMPLATE:
            newState = {...state};
            newState.builder.character = character.create(action.payload);

            return newState;
        case UPDATE_CHARACTER_DIE_CODE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };
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
        case UPDATE_HEALTH_SYSTEM:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        health: {
                            ...state.builder.character.health
                        }
                    }
                }
            };

            newState.builder.character.health.useBodyPoints = !newState.builder.character.health.useBodyPoints;

            return newState;
        case UPDATE_WOUNDS:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        health: {
                            ...state.builder.character.health
                        }
                    }
                }
            };

            newState.builder.character.health.wounds[action.payload] = !newState.builder.character.health.wounds[action.payload];

            return newState;
        case UPDATE_BODY_POINTS:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        health: {
                            ...state.builder.character.health
                        }
                    }
                }
            };

            newState.builder.character.health.bodyPoints[action.payload.key] = action.payload.value;

            return newState;
        case UPDATE_DEFENSE_SYSTEM:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        defenses: {
                            ...state.builder.character.defenses
                        }
                    }
                }
            };

            newState.builder.character.defenses.useStaticDefenses = !newState.builder.character.defenses.useStaticDefenses;;

            return newState;
        case UPDATE_STATIC_DEFENSE:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character,
                        defenses: {
                            ...state.builder.character.defenses
                        }
                    }
                }
            };

            newState.builder.character.defenses.staticDefenses[action.payload.key] = action.payload.value;

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
        case CLEAR_LOADED_CHARACTER:
            newState = {
                ...state,
                builder: {
                    ...state.builder,
                    character: {
                        ...state.builder.character
                    }
                }
            };

            newState.builder.character = null;

            return newState;
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
        case SET_ARCHITECT_TEMPLATE:
            newState = {
                ...state,
                architect: {
                    ...state.architect,
                    template: {
                        ...state.architect.template
                    }
                }
            };

            newState.architect.template = action.payload;

            return newState;
        default:
            return state;
    }
}