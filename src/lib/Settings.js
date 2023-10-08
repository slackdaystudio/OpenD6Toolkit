import AsyncStorage from '@react-native-async-storage/async-storage';
import {common} from './Common';

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

const SETTINGS_KEY = 'settings';

export const DEFAULT_SETTINGS = {
    isLegend: false,
    useMaxima: true,
    animations: true,
};

class Settings {
    async init() {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        } catch (error) {
            common.toast(error.message);
        }

        return DEFAULT_SETTINGS;
    }

    async getSettings() {
        let settings;

        try {
            let updateSettings = false;
            settings = await AsyncStorage.getItem(SETTINGS_KEY);
            settings = JSON.parse(settings);

            // Initialize props to default values if none exist
            if (settings === null) {
                return this.init();
            }

            // Reconcile existing settings by filling in any missing values
            for (let prop in DEFAULT_SETTINGS) {
                if (!settings.hasOwnProperty(prop)) {
                    settings[prop] = DEFAULT_SETTINGS[prop];
                    updateSettings = true;
                }
            }

            if (updateSettings) {
                settings = await this.updateSettings(settings);
            }
        } catch (error) {
            common.toast(error.message);
        }

        return settings;
    }

    async getSetting(setting) {
        let settings;

        try {
            settings = await this.getSettings();

            if (settings.hasOwnProperty(setting)) {
                return settings[setting];
            }
        } catch (error) {
            common.toast(error.message);
        }

        return settings;
    }

    async updateSettings(settings) {
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            common.toast(error.message);
        }

        return settings;
    }

    async updateSetting(setting, value) {
        let settings;

        try {
            settings = await this.getSettings();

            if (settings.hasOwnProperty(setting)) {
                settings[setting] = value;

                settings = await this.updateSettings(settings);
            }
        } catch (error) {
            common.toast(error.message);
        }

        return settings;
    }
}

export let settings = new Settings();
