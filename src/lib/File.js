import {Platform} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ReactNativeBlobUtil from 'react-native-blob-util';
import moment from 'moment';
import {zip, unzip} from 'react-native-zip-archive';
import {common} from './Common';
import {TEMPLATE_FANTASY_NAME, TEMPLATE_ADVENTURE_NAME, TEMPLATE_SPACE_NAME} from './Character';

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

const DEFAULT_ROOT_DIR = ReactNativeBlobUtil.fs.dirs.DocumentDir;

const DEFAULT_CHARACTER_DIR = DEFAULT_ROOT_DIR + '/characters/';

const DEFAULT_TEMPLATE_DIR = DEFAULT_ROOT_DIR + '/templates/';

export const BUILT_IN_TEMPLATE_NAMES = [TEMPLATE_FANTASY_NAME, TEMPLATE_ADVENTURE_NAME, TEMPLATE_SPACE_NAME];

class File {
    async importTemplate(startLoad, endLoad) {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory',
            });

            if (result === null) {
                return;
            }

            result.fileCopyUri = Platform.OS === 'ios' ? decodeURIComponent(result.fileCopyUri) : result.fileCopyUri;

            if (result.name.toLowerCase().endsWith('.json')) {
                await this._saveTemplate(result.fileCopyUri, startLoad, endLoad);
            } else {
                common.toast('Unsupported file type: ' + result.type);

                return;
            }
        } catch (error) {
            if (!DocumentPicker.isCancel(error)) {
                console.error(error.message);
            }
        }
    }

    async getCustomTemplates() {
        let templates = [];

        try {
            const existingTemplates = await this.getTemplates();
            let currentTemplate = {};

            for (let existingTemplate of existingTemplates) {
                currentTemplate = JSON.parse(existingTemplate);

                if (!BUILT_IN_TEMPLATE_NAMES.includes(currentTemplate.name)) {
                    templates.push(currentTemplate);
                }
            }

            return templates;
        } catch (error) {
            console.error(error.message);
        }
    }

    async saveTemplate(template) {
        let message = 'Unable to save template';

        try {
            let templatePath = await this._getTemplatePath(template.name);

            if (BUILT_IN_TEMPLATE_NAMES.includes(template.name)) {
                message = 'You cannot name a template identically to one of the 3 built in templates';
            } else {
                await ReactNativeBlobUtil.fs.writeFile(templatePath, JSON.stringify(template), 'utf8');

                message = `Template "${template.name}" was saved`;
            }
        } catch (error) {
            message = error.message;
        } finally {
            common.toast(message);
        }
    }

    async getTemplates() {
        try {
            let path = await this._getPath(DEFAULT_TEMPLATE_DIR);
            let files = await ReactNativeBlobUtil.fs.ls(path);
            let templates = [];
            let template = null;
            let templatePath = null;

            for (let file of files) {
                templatePath = await this._getTemplatePath(file, false);
                template = await this._readFile(templatePath);

                templates.push(template);
            }

            return templates;
        } catch (error) {
            console.error(error.message);
        }
    }

    async deleteTemplate(template) {
        let path = await this._getTemplatePath(template.name, true);

        try {
            await ReactNativeBlobUtil.fs.unlink(path);

            common.toast('Template deleted');
        } catch (error) {
            console.error(error.message);
        }
    }

    async importCharacter(startLoad, endLoad) {
        try {
            let character = null;

            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory',
            });

            if (result === null) {
                return;
            }

            result.fileCopyUri = Platform.OS === 'ios' ? decodeURIComponent(result.fileCopyUri) : result.fileCopyUri;

            if (result.name.toLowerCase().endsWith('.json')) {
                let rawCharacter = await this._readFile(result.fileCopyUri);
                character = JSON.parse(rawCharacter);

                await this.saveCharacter(character, true);
                await this.loadCharacter(character.name + '.json', startLoad, endLoad, true);

                return character;
            } else {
                common.toast('Unsupported file type: ' + result.type);

                return;
            }
        } catch (error) {
            const isCancel = DocumentPicker.isCancel(error);

            if (!isCancel) {
                console.error(error.message);
            }
        }
    }

    async loadCharacter(characterName, startLoad, endLoad, isImport = false) {
        let character = null;

        try {
            startLoad();

            let path = await this._getCharacterPath(characterName, false);
            character = await this._readFile(path);

            common.toast('Character successfully ' + (isImport ? ' imported' : 'loaded'));
        } catch (error) {
            console.error(error.message);
        } finally {
            endLoad(character);
        }
    }

    async saveCharacter(character, silent = false) {
        let characterPath = await this._getCharacterPath(character.name);

        try {
            await ReactNativeBlobUtil.fs.writeFile(characterPath, JSON.stringify(character), 'utf8');
        } catch (error) {
            console.error(error);
        }

        if (!silent) {
            common.toast('Character saved');
        }
    }

    async getCharacters() {
        const characters = [];

        try {
            const path = await this._getPath(DEFAULT_CHARACTER_DIR);
            const chars = await ReactNativeBlobUtil.fs.ls(path);

            for (const c of chars) {
                characters.push(c);
            }
        } catch (error) {
            console.error(error);
        }

        return characters;
    }

    async deleteCharacter(fileName) {
        let path = await this._getCharacterPath(fileName, false);

        try {
            await ReactNativeBlobUtil.fs.unlink(path);

            common.toast('Character deleted');
        } catch (error) {
            console.error(error.message);
        }
    }

    async backup() {
        let result = {
            backupSuccess: false,
            backupName: null,
            backupFolder: null,
            error: null,
        };

        try {
            const now = moment().format('YYYYMMDDhhmmss');
            const backupName = `OpenD6Toolkit_${now}.zip`;
            const appDir = await this._getPath(DEFAULT_ROOT_DIR);
            const archiveDir = Platform.OS === 'ios' ? ReactNativeBlobUtil.fs.dirs.DocumentDir : ReactNativeBlobUtil.fs.dirs.LegacyDownloadDir;
            const characterDir = await this._getPath(DEFAULT_CHARACTER_DIR);
            const templateDir = await this._getPath(DEFAULT_TEMPLATE_DIR);
            const backupDir = `${appDir}/backup_${now}`;

            await this._makeBackupDir(backupDir);
            await this._copyCharactersAndTemplates(backupDir, characterDir, templateDir);
            await zip([backupDir], `${archiveDir}/${backupName}`);

            result.backupSuccess = true;
            result.backupName = backupName;

            const archiveDirParts = archiveDir.split('/');

            result.backupFolder = archiveDirParts[archiveDirParts.length - 1];
        } catch (error) {
            result.error = error.message;
        }

        return result;
    }

    async restore() {
        let result = {
            loadSuccess: false,
            backupName: null,
            error: null,
            cancelled: false,
        };
        let pickerResults = null;

        try {
            pickerResults = await DocumentPicker.pickSingle({
                type: ['public.archive', 'application/zip'],
                copyTo: 'cachesDirectory',
            });

            if (pickerResults === null) {
                return result;
            }

            pickerResults.fileCopyUri = Platform.OS === 'ios' ? decodeURIComponent(pickerResults.fileCopyUri) : pickerResults.fileCopyUri;

            if (pickerResults.name.toLowerCase().endsWith('.zip')) {
                await this._restoreCharactersAndTemplates(pickerResults.fileCopyUri, result);
            } else {
                throw 'Unsupported file type: ' + pickerResults.type;
            }
        } catch (error) {
            const isCancel = DocumentPicker.isCancel(error);

            if (isCancel) {
                result.cancelled = true;
            } else {
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
            fileNames = await ReactNativeBlobUtil.fs.ls(dir);

            for (let fileName of fileNames) {
                if (/\.json$/i.test(fileName)) {
                    await ReactNativeBlobUtil.fs.cp(`${dir}/${fileName}`, `${backupDir}/${pathParts[pathParts.length - 2]}/${fileName}`);
                }
            }
        }
    }

    async _restoreCharactersAndTemplates(uri, result) {
        const appDir = await this._getPath(DEFAULT_ROOT_DIR);
        const characterDir = await this._getPath(DEFAULT_CHARACTER_DIR);
        const templateDir = await this._getPath(DEFAULT_TEMPLATE_DIR);
        const charactersDirExists = await ReactNativeBlobUtil.fs.exists(characterDir);
        const templateDirExists = await ReactNativeBlobUtil.fs.exists(templateDir);

        if (charactersDirExists) {
            await ReactNativeBlobUtil.fs.unlink(characterDir);
        }

        if (templateDirExists) {
            await ReactNativeBlobUtil.fs.unlink(templateDir);
        }

        let fileName = uri.startsWith('file://') ? uri.substring(7) : uri;

        if (/raw:/i.test(decodeURIComponent(uri))) {
            let parts = decodeURIComponent(uri).split('raw:');

            fileName = parts[1];
        }

        await unzip(fileName, appDir);

        const fileNameParts = decodeURIComponent(uri).split('/');

        result.loadSuccess = true;
        result.backupName = fileNameParts[fileNameParts.length - 1];
    }

    async _makeSaveLocation(location) {
        try {
            const exists = await ReactNativeBlobUtil.fs.exists(location);

            if (!exists) {
                await ReactNativeBlobUtil.fs.mkdir(location);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async _makeBackupDir(location) {
        const exists = await ReactNativeBlobUtil.fs.exists(location);

        if (exists) {
            await ReactNativeBlobUtil.fs.unlink(location);
        }

        await ReactNativeBlobUtil.fs.mkdir(location);
        await ReactNativeBlobUtil.fs.mkdir(`${location}/characters`);
        await ReactNativeBlobUtil.fs.mkdir(`${location}/templates`);
    }

    async _getPath(defaultPath) {
        let path = defaultPath;

        if (path === DEFAULT_CHARACTER_DIR) {
            path = DEFAULT_CHARACTER_DIR;
        } else if (path === DEFAULT_TEMPLATE_DIR) {
            path = DEFAULT_TEMPLATE_DIR;
        } else if (path === DEFAULT_ROOT_DIR) {
            path = DEFAULT_ROOT_DIR;
        } else {
            throw 'Unknown path: {$path}';
        }

        await this._makeSaveLocation(path);

        return path;
    }

    async _getCharacterPath(characterName, withExtension = true) {
        let path = await this._getPath(DEFAULT_CHARACTER_DIR);

        return path + this._stripInvalidCharacters(characterName) + (withExtension ? '.json' : '');
    }

    async _getTemplatePath(templateName, withExtension = true) {
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

            await ReactNativeBlobUtil.fs.writeFile(path, data, 'utf8');

            common.toast('Template saved');
        } catch (error) {
            console.error(error.message);
        } finally {
            endLoad();
        }
    }

    async _readFile(uri) {
        if (uri.startsWith('file://')) {
            uri = uri.substring(7);
        }

        return await ReactNativeBlobUtil.fs.readFile(decodeURIComponent(uri), 'utf8');
    }
}

export let file = new File();
