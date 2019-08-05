import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Settings {
    async init() {
        let settings = {
            isLegend: false,
            useBodyPoints: false,
            useStaticDefenses: false
        };

        await AsyncStorage.setItem('settings', JSON.stringify(settings));

        return settings;
    }

    async getSettings() {
        let settings = await AsyncStorage.getItem('settings');

        return JSON.parse(settings);
    }

    async getSetting(setting) {
        let settings = await this.getSettings();

        if (settings.hasOwnProperty(setting)) {
            return settings[setting];
        }

        return undefined;
    }

    async updateSettings(settings) {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));

        return settings;
    }

    async updateSetting(setting, value) {
        let settings = await this.getSettings();

        if (settings.hasOwnProperty(setting)) {
            settings[setting] = value;

            settings = await this.updateSettings(settings);
        }

        return settings;
    }
}

export let settings = new Settings();