import { Alert } from 'react-native';
import { common } from './Common';
import { file } from './File';

export const OPTION_ADVANTAGES = 'Advantages';

export const OPTION_COMPLICATIONS = 'Complications';

export const OPTION_SPECIAL_ABILITIES = 'Special Abilities';

const DEFAULT_VALUE = '--'

class Template {
    getAttributeIndex(name, template) {
        for (let i = 0; i < template.attributes.length; i++) {
            if (name === template.attributes[i].name) {
                return i;
            }
        }

        return null;
    }

    getSkillIndex(attribute, skill) {
        for (let i = 0; i < attribute.skills.length; i++) {
            if (attribute.skills[i].name === skill.name) {
                return i;
            }
        }

        return null;
    }

    getOptionIndex(optionKey, option, template) {
        let key = common.toCamelCase(optionKey);

        for (let i = 0; i < template[key].length; i++) {
            if (option.id === template[key][i].id) {
                return i;
            }
        }

        return null;
    }

    isAttributeNameUnique(attribute, index, template) {
        for (let i = 0; i < template.attributes.length; i++) {
            if (index === i) {
                continue;
            }

            if (template.attributes[i].name === attribute.name) {
                return false;
            }
        }

        return true;
    }

    isSkillNameUnique(attribute, skill, index, template) {
        for (let i = 0; i < template.attributes.length; i++) {
            if (template.attributes[i].name === attribute.name) {
                for (let j = 0; j < template.attributes[i].skills.length; j++) {
                    if (index === j) {
                        continue;
                    }

                    if (template.attributes[i].skills[j].name === skill.name) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    createOption(optionKey, template) {
        return {
           "id": this._getNextId(optionKey, template),
           "name": "",
           "displayNote": null,
           "rank": 1,
           "multipleRanks": false,
           "totalRanks": 1,
           "description": ""
       };
    }

    _getNextId(optionKey, template) {
        let lastOption = template[optionKey][template[optionKey].length - 1];

        return lastOption.id % 100 === 0 ? lastOption.id + 100 : 100 * Math.ceil(lastOption.id / 100);
    }
}

export let template = new Template();