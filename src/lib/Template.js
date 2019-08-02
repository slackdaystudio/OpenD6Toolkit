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
}

export let template = new Template();