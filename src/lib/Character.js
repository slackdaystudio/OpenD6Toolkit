import { Alert } from 'react-native';

const fantasyTemplate = require('../../public/templates/fantasy.json');

export const TEMPLATE_FANTASY = 'Fantasy';

const DEFAULT_VALUE = '--'

class Character {
    create(template) {
        return {
            template: template,
            name: '',
            height: '',
            weight: '',
            species: '',
            hairColor: '',
            eyeColor: '',
            attributes: this._initAttributes(template.attributes, template.attributeMin),
            getDieCode: function(name) {
                let skillOrAttribute = this.getAttributeOrSkill(name);

                return {
                    dice: skillOrAttribute.dice,
                    modifierDice: skillOrAttribute.modifierDice,
                    pips: skillOrAttribute.pips,
                    modifierPips: skillOrAttribute.modifierPips
                }
            },
            getTotalDieCode: function(dieCode) {
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
            },
            getFormattedDieCode: function(dieCode) {
                let finalDieCode = this.getTotalDieCode(dieCode);

                return finalDieCode.dice + 'D' + (finalDieCode.pips > 0 ? '+' + finalDieCode.pips : '');
            },
            isSkill: function(name) {
                let attributeOrSkill = this._getAttributeOrSkill(name, this.attributes);

                return 'skills' in attributeOrSkill ? false : true;
            },
            getAttributeOrSkill: function(name) {
                return this._getAttributeOrSkill(name, this.attributes);
            },
            getTemplateSkillOrAttribute: function(name) {
                return this._getAttributeOrSkill(name, this.template.attributes);
            },
            _getAttributeOrSkill: function(name, attributes) {
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
        };
    }

    getTemplates() {
        let templates = [];

        templates.push(fantasyTemplate);

        return templates;
    }

    loadTemplate(name) {
        switch(name) {
            case TEMPLATE_FANTASY:
                return fantasyTemplate;
            default:
                // do nothing
        }
    }

    _initAttributes(templateAttributes, min) {
        let attributes = [];

        templateAttributes.map((templateAttribute, index) => {
            attributes.push({
                name: templateAttribute.name,
                dice: min,
                modifierDice: 0,
                pips: 0,
                modifierPips: 0,
                skills: this._initSkills(templateAttribute.skills)
            });
        });

        return attributes;
    }

    _initSkills(attributeSkills) {
        let skills = [];

        attributeSkills.map((skill, index) => {
            skills.push({
                name: skill.name,
                dice: 0,
                modifierDice: 0,
                pips: 0,
                modifierPips: 0
            });
        });

        return skills;
    }
}

export let character = new Character();