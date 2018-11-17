import { Alert } from 'react-native';
import { common } from './Common';

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

class Character {
    create(template) {
        let templateAdvantages = null;
        let templateComplications = null;
        let templateSpecialAbilities = null;

        if (template.name === 'Adventure' || template.name === 'Fantasy' || template.name === 'Space') {
            templateAdvantages = this._getOptions(OPTION_ADVANTAGES);
            templateComplications = this._getOptions(OPTION_COMPLICATIONS);
            templateSpecialAbilities = this._getOptions(OPTION_SPECIAL_ABILITIES);
        } else {
            templateAdvantages = template.advantages || null;
            templateComplications = template.complications || null;
            templateSpecialAbilities = template.specialAbilities || null;
        }

        return {
            template: template,
            name: '',
            height: '',
            weight: '',
            species: '',
            hairColor: '',
            eyeColor: '',
            attributes: this._initAttributes(template.attributes, template.attributeMin),
            specializations: [],
            advantages: {
                template: templateAdvantages,
                items: []
            },
            complications: {
                template: templateComplications,
                items: []
            },
            specialAbilities: {
                template: templateSpecialAbilities,
                items: []
            }
        };
    }

    getDieCode(character, name) {
        let skillOrAttribute = this.getAttributeOrSkill(character, name);

        return {
            dice: skillOrAttribute.dice,
            modifierDice: skillOrAttribute.modifierDice,
            pips: skillOrAttribute.pips,
            modifierPips: skillOrAttribute.modifierPips
        }
    }

    getTotalPoints(character) {
        let itemNames = ['advantages', 'specialAbilities'];
        let totalPoints = 0;
        let totalAttributePips = 0;
        let totalSkillPips = 0;

        for (let attribute of character.attributes) {
            totalPoints += attribute.dice * 4;
            totalAttributePips += attribute.pips;

            for (let skill of attribute.skills) {
                totalPoints += skill.dice > 0 ? skill.dice: 0;
                totalSkillPips += skill.pips > 0 ? skill.pips : 0;
            }
        }

        totalPoints += this._calculatePipValue(totalAttributePips, POINT_MOD_ATTRIBUTE);
        totalPoints += this._calculatePipValue(totalSkillPips, POINT_MOD_SKILL);
        totalPoints += this._calculateSpecializationPoints(character);

        for (let itemName of itemNames) {
            for (let item of character[itemName].items) {
                if (item.multipleRanks) {
                    totalPoints += item.totalRanks * item.rank;
                } else {
                    totalPoints += item.rank;
                }
            }
        }

        return totalPoints;
    }

    getComplicationPoints(character) {
        let complicationPoints = 0;

        for (let item of character.complications.items) {
            if (item.multipleRanks) {
                complicationPoints += item.totalRanks * item.rank;
            } else {
                complicationPoints += item.rank;
            }
        }

        return complicationPoints;
    }

    getTotalDieCode(dieCode) {
        let totalDieCode = {
            dice: dieCode.dice + (dieCode.modifierDice || 0),
            pips: dieCode.pips + (dieCode.modifierPips || 0)
        }

        switch (totalDieCode.pips) {
            case -2:
                totalDieCode.dice--;
                totalDieCode.pips = 1;
                break;
            case -1:
                totalDieCode.dice--;
                totalDieCode.pips = 2;
                break;
            case 3:
                totalDieCode.dice++;
                totalDieCode.pips = 0;
                break;
            case 4:
                totalDieCode.dice++;
                totalDieCode.pips = 1;
                break;
            default:
                // do nothing
        }

        return totalDieCode;
    }

    getFormattedDieCode(dieCode) {
        let finalDieCode = this.getTotalDieCode(dieCode);

        return finalDieCode.dice + 'D' + (finalDieCode.pips > 0 ? '+' + finalDieCode.pips : '');
    }

    isExtranormal(character, name) {
        let skillOrAttribute = this.getAttributeOrSkill(character, name);

        return skillOrAttribute.isExtranormal;
    }

    isSkill(character, name) {
        let attributeOrSkill = this._getAttributeOrSkill(name, character.attributes);

        return 'skills' in attributeOrSkill ? false : true;
    }

    getAttributeOrSkill(character, name) {
        return this._getAttributeOrSkill(name, character.attributes);
    }

    getTemplateSkillOrAttribute(character, name) {
        return this._getAttributeOrSkill(name, character.template.attributes);
    }

    getAttributeBySkill(skillName, attributes) {
        let parentAttribute = null;

        for (let attribute of attributes) {
            for (let skill of attribute.skills) {
                if (skill.name === skillName) {
                    parentAttribute = attribute;
                    break;
                }
            }
        }

        return parentAttribute;
    }

    getTemplates() {
        let templates = [];

        templates.push(TEMPLATE_FANTASY);
        templates.push(TEMPLATE_ADVENTURE);
        templates.push(TEMPLATE_SPACE);

        return templates;
    }

    loadTemplate(name) {
        switch(name) {
            case TEMPLATE_FANTASY_NAME:
                return TEMPLATE_FANTASY;
            case TEMPLATE_ADVENTURE_NAME:
                return TEMPLATE_ADVENTURE;
            case TEMPLATE_SPACE_NAME:
                return TEMPLATE_SPACE;
            default:
                // do nothing
        }
    }

    _getOptions(optionsKey) {
        let options = null;

        switch (optionsKey) {
            case OPTION_ADVANTAGES:
                options = BASE_ADVANTAGES;
                break;
            case OPTION_COMPLICATIONS:
                options = BASE_COMPLICATIONS;
                break;
            case OPTION_SPECIAL_ABILITIES:
                options = BASE_SPECIAL_ABILITIES;
                break;
            default:
                // do nothing
        }

        return options;
    }

    _initAttributes(templateAttributes, min) {
        let attributes = [];

        templateAttributes.map((templateAttribute, index) => {
            attributes.push({
                name: templateAttribute.name,
                isExtranormal: templateAttribute.isExtranormal,
                dice: templateAttribute.isExtranormal ? 0 : min,
                modifierDice: 0,
                pips: 0,
                modifierPips: 0,
                skills: this._initSkills(templateAttribute.skills, templateAttribute.isExtranormal)
            });
        });

        return attributes;
    }

    _initSkills(attributeSkills, isExtranormal) {
        let skills = [];

        attributeSkills.map((skill, index) => {
            skills.push({
                name: skill.name,
                isExtranormal: isExtranormal,
                dice: 0,
                modifierDice: 0,
                pips: 0,
                modifierPips: 0
            });
        });

        return skills;
    }

    _getAttributeOrSkill(name, attributes) {
        let infoFound = false;
        let skillOrAttribute = {name: DEFAULT_VALUE, description: DEFAULT_VALUE};

        for (let attribute of attributes) {
            if (attribute.name === name) {
                skillOrAttribute = attribute;
                break;
            } else {
                for (let skill of attribute.skills) {
                    if (skill.name === name) {
                        skillOrAttribute = skill;
                        infoFound = true;
                        break;
                    }
                }

                if (infoFound) {
                    break;
                }
            }
        }

        return skillOrAttribute;
    }

    _calculatePipValue(pips, pointMultiplier) {
        let totalPoints = 0;

        if (pips > 0) {
            let result = pips / 3;

            if (pips < 4) {
                totalPoints += pointMultiplier;
            } else if (common.isInt(result)) {
                totalPoints += result * pointMultiplier;
            } else {
                totalPoints += Math.trunc(result) * pointMultiplier + pointMultiplier;
            }
        }

        return totalPoints;
    }

    _calculateSpecializationPoints(character) {
        let totalPoints = 0;
        let dice = 0;
        let pips = 0;

        character.specializations.map((specialization, index) => {
            dice += specialization.dice;
            pips += specialization.pips;
        });


        let diceAndPips = this._pipsToDice(dice, pips);

        if (diceAndPips.dice > 0 || diceAndPips.pips > 0) {
            let result = diceAndPips.dice / 3;

            if (common.isFloat(result) || diceAndPips.pips > 0) {
                result += 1;
            }

            totalPoints += Math.trunc(result);
        }

        return totalPoints;
    }

    _pipsToDice(dice, pips) {
        let result = pips / 3;

        if (common.isInt(result)) {
            dice += result;
        } else {
            dice += Math.trunc(result);
            pips = 3 - Math.ceil(3 * Math.round(result / 3 % 1 * 100) / 100);
        }

        return {
            dice: dice,
            pips: pips
        }
    }
}

export let character = new Character();