/**
 * @file Tree-sitter grammar for the Common Data Language for representing NetCDF data.
 * @author Jack Atkinson <jack.atkinson1000@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'cdl',

  // Whitespace (spaces, tabs, newlines) can appear anywhere
  // Single-line comments can appear anywhere to end a line
  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    dataset: $ => seq(
      'netcdf',
      $.identifier,
      '{',
      '}',
    ),

    // Names must start with a-zA-Z_ be non-zero length and contain a-zA-Z0-9_.+-@
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_.+\-@]*/,

    // Comments exist anywhere on one line preceded by //
    comment: $ => token(seq('//', /.*/)),

    // Statements should end in a ;
    statement: $ => seq($.identifier, ';'),
  },

});
