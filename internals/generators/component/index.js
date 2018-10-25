/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const folder = "component";

module.exports = {
  description: 'Add a Component',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Select the Component Type',
    default: 'Stateless Function',
    choices: () => ['Stateless Function', 'PureComponent', 'Component'],
  },{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'Button',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {
    // Generate Files
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = `./${folder}/stateless.js.hbs`;
        break;
      }
      default: {
        componentTemplate = `./${folder}/class.js.hbs`;
      }
    }

    const actions = [{
      type: 'add',
      path: '../../src/components/{{properCase name}}/{{properCase name}}.js',
      templateFile: componentTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/components/{{properCase name}}/{{properCase name}}.scss',
      templateFile: `./${folder}/styles.scss.hbs`,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/components/{{properCase name}}/tests/{{properCase name}}.test.js',
      templateFile: `./${folder}/test.js.hbs`,
      abortOnFail: true,
    }];

    return actions;
  },
};
