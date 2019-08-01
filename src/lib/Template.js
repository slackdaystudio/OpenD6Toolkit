import { Alert } from 'react-native';
import { common } from './Common';
import { file } from './File';

export const OPTION_ADVANTAGES = 'Advantages';

export const OPTION_COMPLICATIONS = 'Complications';

export const OPTION_SPECIAL_ABILITIES = 'Special Abilities';

const DEFAULT_VALUE = '--'

class Template {
    getAttributeIndex(name, template) {
        let index = null;

        for (let i = 0; i < template.attributes.length; i++) {
            if (name === template.attributes[i].name) {
                index = i;
            }
        }

        return index;
    }

    isAttributeNameUnique(attribute, index, template) {
        for (let i = 0; i < template.attributes.length; i++) {
            if (index == i) {
                continue;
            }

            if (template.attributes[i].name == attribute.name) {
                return false;
            }
        }

        return true;
    }
}

export let template = new Template();