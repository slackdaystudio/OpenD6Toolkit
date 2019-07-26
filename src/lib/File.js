import { Platform, PermissionsAndroid, AsyncStorage, Alert } from 'react-native';
import { Toast } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { common } from './Common';

const ANDROID_CHARACTER_DIR = '/storage/emulated/0/OpenD6Toolkit/characters/'

const ANDROID_TEMPLATE_DIR = '/storage/emulated/0/OpenD6Toolkit/templates/'

const DEFAULT_CHARACTER_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/characters/';

const DEFAULT_TEMPLATE_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/templates/';

class File {
    async loadGameTemplate(startLoad, endLoad) {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });

            if (result === null) {
                return;
            }

            if (result.name.toLowerCase().endsWith('.json')) {
                this._saveTemplate(result.uri, startLoad, endLoad);
            } else {
                Toast.show({
                    text: 'Unsupported file type: ' + result.type,
                    position: 'bottom',
                    buttonText: 'OK',
                    textStyle: {color: '#fde5d2'},
                    buttonTextStyle: { color: '#f57e20' },
                    duration: 3000
                });

                return;
            }
        } catch (error) {
            const isCancel = await DocumentPicker.isCancel(error);

            if (!isCancel) {
                Alert.alert(error.message);
            }
        }
    }

    async getTemplates() {
        try {
            let path = await this._getPath(DEFAULT_TEMPLATE_DIR);
            let files = await RNFetchBlob.fs.ls(path);
            let templates = [];
            let template = null;
            let templatePath = null;

            for (let file of files) {
                templatePath = await this._getTemplatePath(file, false);
                template = await RNFetchBlob.fs.readFile(templatePath, 'utf8')

                templates.push(template);
            }

            return templates;
        } catch(error) {
            Alert.alert(error.message);
        }
    }

    async deleteTemplate(template) {
        let path = await this._getTemplatePath(template.name, true);

        try {
            await RNFetchBlob.fs.unlink(path);

            Toast.show({
                text: 'Template deleted',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    async loadCharacter(characterName, startLoad, endLoad) {
        startLoad();

        let character = null;

        try {
            let path = await this._getCharacterPath(characterName, false);
            character = await RNFetchBlob.fs.readFile(path, 'utf8');

            Toast.show({
                text: 'Character successfully loaded',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } catch (error) {
            Toast.show({
                text: error.message,
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } finally {
            endLoad(character);
        }
    }

    async saveCharacter(character) {
        let characterPath = await this._getCharacterPath(character.name);

        await RNFetchBlob.fs.writeFile(characterPath, JSON.stringify(character), 'utf8');

        Toast.show({
            text: 'Character saved',
            position: 'bottom',
            buttonText: 'OK',
            textStyle: {color: '#fde5d2'},
            buttonTextStyle: { color: '#f57e20' },
            duration: 3000
        });
    }

    async getCharacters() {
        let path = await this._getPath(DEFAULT_CHARACTER_DIR);
        let characters = await RNFetchBlob.fs.ls(path);

        return characters;
    }

    async deleteCharacter(fileName) {
        let path = await this._getCharacterPath(fileName, false);

        try {
            await RNFetchBlob.fs.unlink(path);

            Toast.show({
                text: 'Character deleted',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    async _ask_for_write_permission() {
        if (Platform.OS === 'android') {
            try {
                let check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

                if (check === PermissionsAndroid.RESULTS.GRANTED) {
                    return check;
                }

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        'title': 'OpenD6 Toolkit File System Permission',
                        'message': 'OpenD6 Toolkit needs read/write access to your device to save characters and game templates'
                    }
                );

                return granted;
            } catch (error) {
                Alert.alert(error.message);
            }
        }

        return null;
    }

    async _make_save_location(location) {
        let exists =  await RNFetchBlob.fs.exists(location);

        if (!exists) {
            RNFetchBlob.fs.mkdir(location).catch((error) => {
                Alert.alert('Cannot create save directory');
            });
        }
    }

    async _getPath(defaultPath) {
        let path = defaultPath;
        let androidWritePermission = await this._ask_for_write_permission();

        if (androidWritePermission === PermissionsAndroid.RESULTS.GRANTED) {
            if (path === DEFAULT_CHARACTER_DIR) {
                path = ANDROID_CHARACTER_DIR;
            } else {
                path = ANDROID_TEMPLATE_DIR;
            }
        }

        await this._make_save_location(path);

        return path;
    }


    async _getCharacterPath(characterName, withExtension=true) {
        let path = await this._getPath(DEFAULT_CHARACTER_DIR);

        return path + this._stripInvalidCharacters(characterName) + (withExtension ? '.json' : '');
    }

    async _getTemplatePath(templateName, withExtension=true) {
        let path = await this._getPath(DEFAULT_TEMPLATE_DIR);

        return path + this._stripInvalidCharacters(templateName) + (withExtension ? '.json' : '');
    }

    _stripInvalidCharacters(text) {
        return text.replace(/[/\\?%*:|"<>]/g, '_');
    }

    async _saveTemplate(uri, startLoad, endLoad) {
        startLoad();

        try {
            let data = await RNFetchBlob.fs.readFile(uri, 'utf8');
            let template = JSON.parse(data);
            let path = await this._getTemplatePath(template.name);

            await RNFetchBlob.fs.writeFile(path, data, '', 'utf8');

            Toast.show({
                text: 'Template saved',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } catch (error) {
            Alert.alert(error.message);
        } finally {
            endLoad();
        }
    }
}

export let file = new File();
