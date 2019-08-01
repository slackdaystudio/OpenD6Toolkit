import { Alert } from 'react-native';
import { common } from './Common';
import { file } from './File';

const TEMPLATE_FANTASY = require('../../public/templates/fantasy.json');

const TEMPLATE_ADVENTURE = require('../../public/templates/adventure.json');

const TEMPLATE_SPACE = require('../../public/templates/space.json');

const BASE_ADVANTAGES = require('../../public/templates/advantages/1/advantages.json');

const BASE_COMPLICATIONS = require('../../public/templates/complications/1/complications.json');

const BASE_SPECIAL_ABILITIES = require('../../public/templates/special_abilities/1/special_abilities.json');

const POINT_MOD_ATTRIBUTE = 4;

const POINT_MOD_SKILL = 1;

export const TEMPLATE_FANTASY_NAME = 'Fantasy';

export const TEMPLATE_ADVENTURE_NAME = 'Adventure';

export const TEMPLATE_SPACE_NAME = 'Space';

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
}

export let template = new Template();