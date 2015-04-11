// package metadata file for Meteor.js
'use strict';

var packageName = 'patrickleet:enquire';  // https://atmospherejs.com/patrickleet/enquire

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: "A lightweight library for programmatically responding to media queries.",
  version: packageJson.version,
  git: 'https://github.com/patrickleet/enquire.js.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.export('enquire');
  api.addFiles([
    'dist/enquire.js',
    'meteor/export.js'
  ], ['client']);
});

Package.onTest(function (api) {
  api.use(packageName);
  api.use('tinytest');

  api.addFiles('meteor/test.js');
});
