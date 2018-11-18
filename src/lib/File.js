import { Platform, AsyncStorage, Alert } from 'react-native';
import { Toast } from 'native-base';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import settle from 'promise-settle';
import { common } from './Common';

const CHARACTER_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/OpenD6Toolkit/characters/';

const TEMPLATE_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/OpenD6Toolkit/templates/';

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
                        buttonText: 'OK'
                    });

                    return;
                }
            });
        }
    }

    async getTemplates() {
        try {
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

    async loadCharacter(characterName, startLoad, endLoad) {1
        let path = this._getCharacterPath(characterName, false);

        startLoad();
        this._make_save_location(CHARACTER_DIR);

        await RNFetchBlob.fs.readFile(path, 'utf8').then((character) => {
            Toast.show({
                text: 'Character successfully loaded',
                position: 'bottom',
                buttonText: 'OK'
            });

            endLoad(character);
        }).catch((error) => {
            Toast.show({
                text: error.message,
                position: 'bottom',
                buttonText: 'OK',
                duration: 3000
            });

            endLoad(null);
        });
    }

    async saveCharacter(character) {
        this._make_save_location(CHARACTER_DIR);

        await RNFetchBlob.fs.writeFile(this._getCharacterPath(character.name), JSON.stringify(character), 'utf8').then(() => {
            Toast.show({
                text: 'Character saved',
                position: 'bottom',
                buttonText: 'OK'
            });
        });
    }

    async getCharacters() {
        this._make_save_location(CHARACTER_DIR);
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
                buttonText: 'OK'
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });
    }

    _make_save_location(location) {
        RNFetchBlob.fs.exists(location).then((exist) => {
            if (!exist) {
                RNFetchBlob.fs.mkdir(location).catch((error) => {
                    Alert.alert('Cannot create save directory');
                });
            }
        }).catch((error) => {
            Alert.alert(error.message);
        });
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

    _saveTemplate(uri, startLoad, endLoad) {
        this._make_save_location(TEMPLATE_DIR);

        startLoad();

        RNFetchBlob.fs.readFile(uri, 'utf8').then((data) => {
            let template = JSON.parse(data);

            RNFetchBlob.fs.writeFile(this._getTemplatePath(template.name), data, '', 'utf8').then(() => {
                Toast.show({
                    text: 'Template saved',
                    position: 'bottom',
                    buttonText: 'OK'
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