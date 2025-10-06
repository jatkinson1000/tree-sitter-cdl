/**
 * @file Tree-sitter grammar for the Common Data Language for representing NetCDF data.
 * @author Jack Atkinson <jack.atkinson1000@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'cdl',

  rules: {
    dataset: $ => seq(
      'netcdf',
      $.identifier,
      '{',
      '}',
    ),

    // Tokens
    // Names must start with a-zA-Z_ be non-zero length and contain a-zA-Z0-9_.+-@
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_.+\-@]*/,

  },

});
