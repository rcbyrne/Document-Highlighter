/**
 * Container Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const folder = "form";

module.exports = {
  description: 'Add a Form Container',
  prompts: [{
    type: 'list',
    name: 'type',
    message: 'Select the Component Type',
    default: 'Stateless Function',
    choices: () => ['PureComponent', 'Component'],
  },{
    type: 'input',
    name: 'name',
    message: 'What should it be called?',
    default: 'form',
    validate: (value) => {
      if ((/.+/).test(value)) {
        return componentExists(value) ? 'A component or container with this name already exists' : true;
      }

      return 'The name is required';
    },
  }],
  actions: (data) => {
    // Generate Files
    const actions = [{
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.js',
      templateFile: `./${folder}/class.js.hbs`,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../src/containers/{{properCase name}}/{{properCase name}}.css',
      templateFile: `./${folder}/styles.css.hbs`,
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
