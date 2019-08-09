import { Alert } from 'react-native';
import { settings as appSettings, DEFAULT_SETTINGS } from '../lib/Settings';

//////////////////////////////
// ACTION TYPES             //
//////////////////////////////

export const SET_SETTINGS = 'SET_SETTINGS';

export const SET_SETTING = 'SET_SETTING';

export const RESET_SETTING = 'RESET_SETTING';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export function setSettings(settings) {
    return async (dispatch) => {
        appSettings.updateSettings(settings).then(settings => {
            dispatch({
                type: SET_SETTINGS,
                payload: settings
            });
        });
    };
}

export function setSetting(setting, value) {
    return async (dispatch) => {
        appSettings.updateSetting(setting, value).then(settings => {
            dispatch({
                type: SET_SETTING,
                payload: settings
            });
        });
    };
}

export function resetSettings() {
    return async (dispatch) => {
        appSettings.init().then(settings => {
            dispatch({
                type: RESET_SETTING,
                payload: settings
            });
        });
    };
}

//////////////////////////////
// REDUCER                  //
//////////////////////////////

export default function settings(state = DEFAULT_SETTINGS, action) {
    let newState = null

    switch (action.type) {
        case SET_SETTINGS:
        case SET_SETTING:
        case RESET_SETTING:
            newState = {...state};
            newState = action.payload;

            return newState;
        default:
            return state;
    }
}
