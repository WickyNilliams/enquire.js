Package.describe({
  // Short two-sentence summary.
  summary: "A lightweight, pure javascript library for programmatically responding to media queries.",
  // Version number.
  version: "2.1.2",
  // Optional.  Default is package directory name.
  name: "patrickleet:enquire",
  // Optional github URL to your source repository.
  git: "https://github.com/WickyNilliams/enquire.js.git"
});

/* This defines your actual package */
Package.onUse(function (api) {
  api.export('enquire', 'client');
  api.addFiles('dist/enquire.js', 'client');
});