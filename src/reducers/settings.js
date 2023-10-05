import {settings as appSettings, DEFAULT_SETTINGS} from '../lib/Settings';

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
// ACTION TYPES             //
//////////////////////////////

export const SET_SETTINGS = 'SET_SETTINGS';

export const SET_SETTING = 'SET_SETTING';

export const RESET_SETTING = 'RESET_SETTING';

//////////////////////////////
// ACTIONS                  //
//////////////////////////////

export function setSettings(settings) {
    return async dispatch => {
        appSettings.updateSettings(settings).then(settings => {
            dispatch({
                type: SET_SETTINGS,
                payload: settings,
            });
        });
    };
}

export function setSetting(setting, value) {
    return async dispatch => {
        appSettings.updateSetting(setting, value).then(settings => {
            dispatch({
                type: SET_SETTING,
                payload: settings,
            });
        });
    };
}

export function resetSettings() {
    return async dispatch => {
        appSettings.init().then(settings => {
            dispatch({
                type: RESET_SETTING,
                payload: settings,
            });
        });
    };
}

//////////////////////////////
// REDUCER                  //
//////////////////////////////

export default function settings(state = DEFAULT_SETTINGS, action) {
    let newState = null;

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
