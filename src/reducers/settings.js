import { Alert } from 'react-native';
import { settings as appSettings } from '../lib/Settings';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export const SET_SETTINGS = 'SET_SETTINGS';

export const SET_SETTING = 'SET_SETTING';

export const RESET_SETTING = 'RESET_SETTING';

//////////////////////////////
// REDUCERS                 //
//////////////////////////////

export function setSettings(settings) {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
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

export function resetSettings() {
    return {
        type: RESET_SETTING,
        payload: null
    }
}

settingsState = {
    isLegend: false
};

export default function settings(state = settingsState, action) {
    let newState = null

    switch (action.type) {
        case SET_SETTINGS:
            newState = {...state};
            newState = action.payload;

            appSettings.updateSettings(newState).then(() => {console.log('Set settings')});

            return newState;
        case SET_SETTING:
            newState = {...state};
            newState[action.payload.setting] = action.payload.value;

            appSettings.updateSettings(newState);

            return newState;
        case RESET_SETTING:
            newState = {...state};
            newState = settings;

            appSettings.init()

            return newState;
        default:
            return state;
    }
}