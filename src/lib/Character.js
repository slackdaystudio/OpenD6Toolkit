const fantasyTemplate = require('../../public/templates/fantasy.json');

export const TEMPLATE_FANTASY = 'Fantasy';

class Character {
    create(template) {
        return {
            template: template,
            name: '',
            attributes: this._initAttributes(template.attributes, template.attributeMin)
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
                value: min,
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
                value: 0
            });
        });

        return skills;
    }
}

export let character = new Character();