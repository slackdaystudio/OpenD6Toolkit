import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { common } from './Common';

const SETTINGS_KEY = 'settings';

class Settings {
    async init() {
        const settings = {
            isLegend: false
        };

        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            common.toast(error.message);
        }

        return settings;
    }

    async getSettings() {
        let settings = undefined;

        try {
            settings = await AsyncStorage.getItem(SETTINGS_KEY);
        } catch (error) {
            common.toast(error.message);
        }

        return JSON.parse(settings);
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