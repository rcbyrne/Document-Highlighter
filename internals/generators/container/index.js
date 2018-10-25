/**
 * Container Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const folder = "container";

module.exports = {
  description: 'Add a Container',
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
    default: 'NewPage',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {
    // Generate Files
    let containerTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        containerTemplate = `./${folder}/stateless.js.hbs`;
        break;
      }
      default: {
        containerTemplate = `./${folder}/class.js.hbs`;
      }
    }

    const actions = [{
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.js',
      templateFile: containerTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.scss',
      templateFile: `./${folder}/styles.scss.hbs`,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/containers/{{properCase name}}/tests/{{properCase name}}.test.js',
      templateFile: `./${folder}/test.js.hbs`,
      abortOnFail: true,
    }];

    return actions;
  },
};
