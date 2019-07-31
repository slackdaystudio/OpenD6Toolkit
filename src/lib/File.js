import { Platform, PermissionsAndroid, AsyncStorage, Alert } from 'react-native';
import { Toast } from 'native-base';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import moment from "moment";
import { zip, unzip } from 'react-native-zip-archive';
import { common } from './Common';

const ANDROID_ROOT_DIR = RNFetchBlob.fs.dirs.SDCardDir + '/OpenD6Toolkit';

const ANDROID_CHARACTER_DIR = ANDROID_ROOT_DIR + '/characters/';

const ANDROID_TEMPLATE_DIR = ANDROID_ROOT_DIR + '/templates/';

const DEFAULT_ROOT_DIR = RNFetchBlob.fs.dirs.DocumentDir;

const DEFAULT_CHARACTER_DIR = DEFAULT_ROOT_DIR + '/characters/';

const DEFAULT_TEMPLATE_DIR = DEFAULT_ROOT_DIR + '/templates/';

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
                template = await this._readFile(templatePath)

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
        let character = null;

        try {
	        startLoad();

            let path = await this._getCharacterPath(characterName, false);
            character = await this._readFile(path);

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

    async backup() {
        let result = {
            backupSuccess: false,
            backupName: null,
            error: null
        };

        try {
            const now = moment().format('YYYYMMDDhhmmss');
            const backupName = `OpenD6Toolkit_${now}.zip`;
            const appDir = await this._getPath(DEFAULT_ROOT_DIR);
            const archiveDir = Platform.os === 'ios' ? RNFetchBlob.fs.dirs.DocumentDir : RNFetchBlob.fs.dirs.DownloadDir;
            const characterDir = await this._getPath(DEFAULT_CHARACTER_DIR);
            const templateDir = await this._getPath(DEFAULT_TEMPLATE_DIR);
            const backupDir = `${appDir}/backup_${now}`;

            await this._makeBackupDir(backupDir);
            await this._copyCharactersAndTemplates(backupDir, characterDir, templateDir);
            await zip(backupDir, `${archiveDir}/${backupName}`);
            await RNFetchBlob.fs.unlink(backupDir);

            result.backupSuccess = true;
            result.backupName = backupName;
        } catch (error) {
            result.error = error.message;
        }

        return result;
    }

    async restore() {
        let result = {
            loadSuccess: false,
            backupName: null,
            error: null
        };
        let pickerResults = null;

        try {
            if (Platform.OS === 'android') {
                const androidWritePermission = await this._ask_for_write_permission();

                if (androidWritePermission === PermissionsAndroid.RESULTS.GRANTED) {
                    pickerResults = await DocumentPicker.pick({
                        type: [DocumentPicker.types.allFiles],
                    });
                } else {
                    return result;
                }
            } else {
                pickerResults = await DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                });
            }

            if (pickerResults === null) {
                return result;
            }

            if (pickerResults.name.toLowerCase().endsWith('.zip')) {
                await this._restoreCharactersAndTemplates(pickerResults.uri, result);
            } else {
                throw 'Unsupported file type: ' + pickerResults.type;
            }
        } catch (error) {
            const isCancel = await DocumentPicker.isCancel(error);

            if (!isCancel) {
               result.error = error.message;
            }
        }

        return result;
    }

    async _copyCharactersAndTemplates(backupDir, characterDir, templateDir) {
        let fileNames = [];
        let pathParts = [];

        for (let dir of [characterDir, templateDir]) {
            pathParts = dir.split('/');
            fileNames = await RNFetchBlob.fs.ls(dir);

            for (let fileName of fileNames) {
                if (/\.json$/i.test(fileName)) {
                    await RNFetchBlob.fs.cp(`${dir}/${fileName}`, `${backupDir}/${pathParts[pathParts.length - 2]}/${fileName}`);
                }
            }
        }
    }

    async _restoreCharactersAndTemplates(uri, result) {
        const appDir = await this._getPath(DEFAULT_ROOT_DIR);
        const characterDir = await this._getPath(DEFAULT_CHARACTER_DIR);
        const templateDir = await this._getPath(DEFAULT_TEMPLATE_DIR);
        const charactersDirExists = await RNFetchBlob.fs.exists(characterDir);
        const templateDirExists = await RNFetchBlob.fs.exists(templateDir);

        if (charactersDirExists) {
            await RNFetchBlob.fs.unlink(characterDir);
        }

        if (templateDirExists) {
            await RNFetchBlob.fs.unlink(templateDir);
        }

        let fileName = uri;

        if (/raw\:/i.test(decodeURIComponent(uri))) {
            let parts = decodeURIComponent(uri).split('raw:');

            fileName = parts[1];
        }

        await unzip(fileName, appDir);

        const fileNameParts = decodeURIComponent(uri).split('/');

        result.loadSuccess = true;
        result.backupName = fileNameParts[fileNameParts.length - 1];
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

    async _makeSaveLocation(location) {
        try {
            const exists =  await RNFetchBlob.fs.exists(location);

            if (!exists) {
                await RNFetchBlob.fs.mkdir(location);
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    async _makeBackupDir(location) {
        const exists =  await RNFetchBlob.fs.exists(location);

        if (exists) {
            await RNFetchBlob.fs.unlink(location)
        }

        await RNFetchBlob.fs.mkdir(location);
        await RNFetchBlob.fs.mkdir(`${location}/characters`);
        await RNFetchBlob.fs.mkdir(`${location}/templates`);
    }

    async _getPath(defaultPath) {
        let path = defaultPath;
        let androidWritePermission = await this._ask_for_write_permission();

        if (androidWritePermission === PermissionsAndroid.RESULTS.GRANTED) {
            if (path === DEFAULT_CHARACTER_DIR) {
                path = ANDROID_CHARACTER_DIR;
            } else if (path === DEFAULT_TEMPLATE_DIR) {
                path = ANDROID_TEMPLATE_DIR;
            } else if (path === DEFAULT_ROOT_DIR) {
                path = Platform.OS === 'ios' ? RNFetchBlob.dirs.DocumentDir : ANDROID_ROOT_DIR;
            } else {
                throw `Unknown path: {$path}`;
            }
        }

        await this._makeSaveLocation(path);

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
        try {
	    startLoad();

            let data = await this._readFile(uri);
            let template = JSON.parse(data);
            let path = await this._getTemplatePath(template.name);

            await RNFetchBlob.fs.writeFile(path, data, 'utf8');

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

    async _readFile(uri) {
        let filePath = uri.startsWith('file://') ? uri.substring(7) : uri;

        if (Platform.OS === 'ios' && !common.isIPad() && /OpenD6Toolkit\-Inbox/.test(filePath) === false) {
            let arr = uri.split('/');
            const dirs = RNFetchBlob.fs.dirs;
            filePath = `${dirs.DocumentDir}/${arr[arr.length - 2]}/${arr[arr.length - 1]}`;
        }

        return await RNFetchBlob.fs.readFile(decodeURI(filePath), 'utf8')
    }
}

export let file = new File();
