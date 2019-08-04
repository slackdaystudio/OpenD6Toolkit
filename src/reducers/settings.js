import { Alert } from 'react-native';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const SET_SETTING = 'SET_SETTING';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function setSetting(setting, value) {
    return {
        type: SET_SETTING,
        payload: {
            setting: setting,
            value: value
        }
    }
}

settingsState = {
    isLegend: false
};

export default function settings(state = settingsState, action) {
    let newState = null

    switch (action.type) {
        case SET_SETTING:
            newState = {...state};

            if (newState.hasOwnProperty(action.payload.setting)) {
                newState[action.payload.setting] = action.payload.value;
            }

            return newState;
        default:
            return state;
    }
}