import {template} from '../lib/Template';
import {character} from '../lib/Character';

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

export const SET_ARCHITECT_TEMPLATE = 'SET_ARCHITECT_TEMPLATE';

export const UPDATE_TEMPLATE_OVERVIEW = 'UPDATE_TEMPLATE_OVERVIEW';

export const EDIT_TEMPLATE_ATTRIBUTE = 'EDIT_TEMPLATE_ATTRIBUTE';

export const ADD_TEMPLATE_ATTRIBUTE = 'ADD_TEMPLATE_ATTRIBUTE';

export const DELETE_TEMPLATE_ATTRIBUTE = 'DELETE_TEMPLATE_ATTRIBUTE';

export const EDIT_TEMPLATE_SKILL = 'EDIT_TEMPLATE_SKILL';

export const ADD_TEMPLATE_SKILL = 'ADD_TEMPLATE_SKILL';

export const DELETE_TEMPLATE_SKILL = 'DELETE_TEMPLATE_SKILL';

export const DELETE_TEMPLATE_OPTION = 'DELETE_TEMPLATE_OPTION';

export const ADD_TEMPLATE_OPTION = 'ADD_TEMPLATE_OPTION';

export const EDIT_TEMPLATE_OPTION = 'EDIT_TEMPLATE_OPTION';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function setArchitectTemplate(template) {
    return {
        type: SET_ARCHITECT_TEMPLATE,
        payload: template,
    };
}

export function updateTemplateOverview(key, value) {
    return {
        type: UPDATE_TEMPLATE_OVERVIEW,
        payload: {
            key: key,
            value: value,
        },
    };
}

export function editTemplateAttribute(attribute, index) {
    return {
        type: EDIT_TEMPLATE_ATTRIBUTE,
        payload: {
            attribute: attribute,
            index: index,
        },
    };
}

export function addTemplateAttribute() {
    return {
        type: ADD_TEMPLATE_ATTRIBUTE,
        payload: null,
    };
}

export function deleteTemplateAttribute(attribute) {
    return {
        type: DELETE_TEMPLATE_ATTRIBUTE,
        payload: attribute,
    };
}

export function editTemplateSkill(attribute, skill, index) {
    return {
        type: EDIT_TEMPLATE_SKILL,
        payload: {
            attribute: attribute,
            skill: skill,
            index: index,
        },
    };
}

export function addTemplateSkill(attributeIndex) {
    return {
        type: ADD_TEMPLATE_SKILL,
        payload: attributeIndex,
    };
}

export function deleteTemplateSkill(name, skill) {
    return {
        type: DELETE_TEMPLATE_SKILL,
        payload: {
            name: name,
            skill: skill,
        },
    };
}

export function deleteTemplateOption(optionKey, option) {
    return {
        type: DELETE_TEMPLATE_OPTION,
        payload: {
            optionKey: optionKey,
            option: option,
        },
    };
}

export function addTemplateOption(optionKey) {
    return {
        type: ADD_TEMPLATE_OPTION,
        payload: optionKey,
    };
}

export function editTemplateOption(optionIndex, optionKey, option) {
    return {
        type: EDIT_TEMPLATE_OPTION,
        payload: {
            optionIndex: optionIndex,
            optionKey: optionKey,
            option: option,
        },
    };
}

const architectState = {
    template: null,
};

export default function architect(state = architectState, action) {
    let newState = null;

    switch (action.type) {
        case SET_ARCHITECT_TEMPLATE:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template = action.payload;

            return newState;
        case UPDATE_TEMPLATE_OVERVIEW:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template[action.payload.key] = action.payload.value;

            return newState;
        case EDIT_TEMPLATE_ATTRIBUTE:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template.attributes[action.payload.index] = action.payload.attribute;

            return newState;
        case ADD_TEMPLATE_ATTRIBUTE:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template.attributes.push(character.createAttribute());

            return newState;
        case DELETE_TEMPLATE_ATTRIBUTE:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            for (let i = 0; i < newState.template.attributes.length; i++) {
                if (newState.template.attributes[i].name === action.payload.name) {
                    newState.template.attributes.splice(i, 1);
                    break;
                }
            }

            return newState;
        case EDIT_TEMPLATE_SKILL:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            for (let i = 0; i < newState.template.attributes.length; i++) {
                if (newState.template.attributes[i].name === action.payload.attribute.name) {
                    newState.template.attributes[i].skills[action.payload.index] = action.payload.skill;
                    break;
                }
            }

            return newState;
        case ADD_TEMPLATE_SKILL:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template.attributes[action.payload].skills.push(character.createSkill());

            return newState;
        case DELETE_TEMPLATE_SKILL:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            for (let i = 0; i < newState.template.attributes.length; i++) {
                if (newState.template.attributes[i].name === action.payload.name) {
                    for (let j = 0; j < newState.template.attributes[i].skills.length; j++) {
                        if (newState.template.attributes[i].skills[j].name === action.payload.skill.name) {
                            newState.template.attributes[i].skills.splice(j, 1);
                            break;
                        }
                    }

                    break;
                }
            }

            return newState;
        case DELETE_TEMPLATE_OPTION:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            for (let i = 0; i < newState.template[action.payload.optionKey].length; i++) {
                if (newState.template[action.payload.optionKey][i].id === action.payload.option.id) {
                    newState.template[action.payload.optionKey].splice(i, 1);
                    break;
                }
            }

            return newState;
        case ADD_TEMPLATE_OPTION:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template[action.payload].push(template.createOption(action.payload, newState.template));

            return newState;
        case EDIT_TEMPLATE_OPTION:
            newState = {
                ...state,
                template: {
                    ...state.template,
                },
            };

            newState.template[action.payload.optionKey][action.payload.optionIndex] = action.payload.option;

            return newState;
        default:
            return state;
    }
}
