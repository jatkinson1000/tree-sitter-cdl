/**
 * @file Tree-sitter grammar for the Common Data Language for representing NetCDF data.
 * @author Jack Atkinson <jack.atkinson1000@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// Constants
const decimalDigits = /\d+/;
const letterOrUnderscore = /[a-zA-Z_]/;
const ncSpecialChars = /[a-zA-Z0-9_.@+-]/; // Original set - do not need to be escaped
const ncUnlimited = /unlimited|UNLIMITED/;
const utf8Chars = /[\u0080-\uFFFF]/;

const escapedDigits = seq('\\', /\d+/);
const escapedChars = seq('\\', /[ !"#$%&'()*,:;<=>?\[\\\]^`{|}~]/);

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
      $.dataset_id,
      '{',
      optional($.dimensions_section),
      '}',
    ),

    // Dimensions
    // Can be a comma-separated list
    dimensions_section: $ => seq(
      'dimensions:',
      repeat(
        seq(
          $.dimension,
          repeat(seq(',', $.dimension)),
          ';',
        ),
      ),
    ),

    dimension: $ => seq(
      field('name', $.identifier),
      '=',
      field('size', choice(decimalDigits, ncUnlimited)),
    ),

    // Dataset ID can be any character except '{'
    // Note also that the CDL dataset ID is irrelevant as generated file is named based
    // on filename, not dataset ID. Ideally they should match as occurs with ncdump.
    dataset_id: $ => token(/[^{][^{]*/),

    // Old spec: Identifiers start with a-zA-Z_ be non-zero length and contain a-zA-Z0-9_.+-@
    identifier_old: $ => token(/[a-zA-Z_][a-zA-Z0-9_.+\-@]*/),

    // Current spec: Identifiers
    identifier: $ => token(
      seq(
        // Starts with a letter or underscore, escaped digit, or UTF-8 character (allowed set)
        choice(
          letterOrUnderscore,
          escapedDigits,
          utf8Chars,
        ),
        // Then contains any unescaped ncSpecialChars, UTF-8, or escaped special characters
        repeat(
          choice(
            ncSpecialChars,
            escapedChars,
            utf8Chars,
          ),
        ),
      ),
    ),

    // Comments exist anywhere on one line preceded by //
    comment: $ => token(seq('//', /.*/)),

    // Statements should end in a ;
    statement: $ => seq($.identifier, ';'),
  },

});
