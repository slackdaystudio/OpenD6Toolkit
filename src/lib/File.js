import { Alert } from 'react-native';

import { Toast } from 'native-base';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { common } from './Common';

const CHARACTER_DIR = RNFetchBlob.fs.dirs.DocumentDir + '/OpenD6Toolkit/characters/';

class File {
    async load(characterName, startLoad, endLoad) {1
        let path = this._getCharacterPath(characterName, false);

        startLoad();
        this._make_save_location();

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

    async save(character) {
        this._make_save_location();

        await RNFetchBlob.fs.writeFile(this._getCharacterPath(character.name), JSON.stringify(character), 'utf8').then(() => {
            Toast.show({
                text: 'Character saved',
                position: 'bottom',
                buttonText: 'OK'
            });
        });
    }

    async getCharacters() {
        this._make_save_location();
        let characters = [];

        await RNFetchBlob.fs.ls(CHARACTER_DIR).then((files) => {
            characters = files;
        });

        return characters;
    }

    async delete(fileName) {
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

    _make_save_location() {
        RNFetchBlob.fs.exists(CHARACTER_DIR).then((exist) => {
            if (!exist) {
                RNFetchBlob.fs.mkdir(CHARACTER_DIR).catch((error) => {
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

    _stripInvalidCharacters(text) {
        return text.replace(/[/\\?%*:|"<>]/g, '_');
    }
}

export let file = new File();