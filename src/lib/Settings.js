import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { common } from './Common';

const SETTINGS_KEY = 'settings';

export const DEFAULT_SETTINGS = {
    isLegend: false,
    useMaxima: true
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
        let settings = undefined;

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
        let settings = undefined;

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
        let settings = undefined;

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
