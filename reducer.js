const fantasyTemplate = require('./public/templates/fantasy.json');

export const TEMPLATE_FANTASY = 'fantasy';

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

export function loadTemplate(name) {
    let template = {}

    switch (name.trim().lowerCase()) {
        case TEMPLATE_FANTASY:
            template = fantasyTemplate;
        default:
            // do nothing
    }

    return {
        type: SET_TEMPLATE,
        payload: template
    }
}

initialState = {
    roller: {
        dice: 1,
        pips: 0
    },
    builder: {
        template: fantasyTemplate
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
            newState.builder.template = action.payload;

            return newState;
        default:
            return state;
    }
}