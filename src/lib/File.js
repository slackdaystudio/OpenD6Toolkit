import { Platform, AsyncStorage, Alert } from 'react-native';
import { Toast } from 'native-base';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { common } from './Common';

const CHARACTER_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/characters/';

const TEMPLATE_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/templates/';

class File {
    loadGameTemplate(startLoad, endLoad) {
        if (common.isIPad()) {
            DocumentPicker.show({
                top: 0,
                left: 0,
                filetype: ['public.data']
            }, (error, uri) => {
                this._saveTemplate(uri.uri, startLoad, endLoad);
            });
        } else {
            DocumentPicker.show({filetype: [DocumentPickerUtil.allFiles()]},(error, result) => {
                if (result === null) {
                    return;
                }

		        if ((Platform.OS === 'ios' && result.fileName.endsWith('.json')) || result.type === 'application/json') {
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
            });
        }
    }

    async getTemplates() {
        try {
            await this._make_save_location(TEMPLATE_DIR);

            let files = await RNFetchBlob.fs.ls(TEMPLATE_DIR);
            let promises = files.map((file) => {
                let path = this._getTemplatePath(file, false);

                return RNFetchBlob.fs.readFile(path, 'utf8');
            });

            let templates = await Promise.all(promises);

            return templates;
        } catch(error) {
            Alert.alert(error.message);
        }
    }

    async deleteTemplate(template) {
        let path = this._getTemplatePath(template.name, true);

        RNFetchBlob.fs.unlink(path).then(() => {
            Toast.show({
                text: 'Template deleted',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });
    }

    async loadCharacter(characterName, startLoad, endLoad) {1
        let path = this._getCharacterPath(characterName, false);

        startLoad();
        await this._make_save_location(CHARACTER_DIR);

        await RNFetchBlob.fs.readFile(path, 'utf8').then((character) => {
            Toast.show({
                text: 'Character successfully loaded',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });

            endLoad(character);
        }).catch((error) => {
            Toast.show({
                text: error.message,
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });

            endLoad(null);
        });
    }

    async saveCharacter(character) {
        await this._make_save_location(CHARACTER_DIR);

        await RNFetchBlob.fs.writeFile(this._getCharacterPath(character.name), JSON.stringify(character), 'utf8').then(() => {
            Toast.show({
                text: 'Character saved',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        });
    }

    async getCharacters() {
        await this._make_save_location(CHARACTER_DIR);
        let characters = [];

        await RNFetchBlob.fs.ls(CHARACTER_DIR).then((files) => {
            characters = files;
        });

        return characters;
    }

    async deleteCharacter(fileName) {
        let path = this._getCharacterPath(fileName, false);

        RNFetchBlob.fs.unlink(path).then(() => {
            Toast.show({
                text: 'Character deleted',
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });
    }

    async _make_save_location(location) {
        let exists =  await RNFetchBlob.fs.exists(location);

        if (!exists) {
            RNFetchBlob.fs.mkdir(location).catch((error) => {
                Alert.alert('Cannot create save directory');
            });
        }
    }

    _getCharacterPath(characterName, withExtension=true) {
        return CHARACTER_DIR + this._stripInvalidCharacters(characterName) + (withExtension ? '.json' : '');
    }

    _getTemplatePath(templateName, withExtension=true) {
        return TEMPLATE_DIR + this._stripInvalidCharacters(templateName) + (withExtension ? '.json' : '');
    }

    _stripInvalidCharacters(text) {
        return text.replace(/[/\\?%*:|"<>]/g, '_');
    }

    async _saveTemplate(uri, startLoad, endLoad) {
        await this._make_save_location(TEMPLATE_DIR);

        startLoad();

        RNFetchBlob.fs.readFile(uri, 'utf8').then((data) => {
            let template = JSON.parse(data);

            RNFetchBlob.fs.writeFile(this._getTemplatePath(template.name), data, '', 'utf8').then(() => {
                Toast.show({
                    text: 'Template saved',
                    position: 'bottom',
                    buttonText: 'OK',
                    textStyle: {color: '#fde5d2'},
                    buttonTextStyle: { color: '#f57e20' },
                    duration: 3000
                });
            });

            endLoad();
        }).catch((error) => {
            endLoad();
            Alert.alert(error.message);
        });
    }
}

export let file = new File();