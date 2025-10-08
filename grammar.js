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
      optional($.variables_section),
      '}',
    ),

    // Dimensions
    // Can be a comma-separated list
    dimensions_section: $ => seq(
      'dimensions:',
      repeat($.dimension_declarations),
    ),

    dimension_declarations: $ => seq(
      commaSep($.dimension),
      ';',
    ),

    dimension: $ => seq(
      field('name', $.identifier),
      '=',
      field('size', choice(decimalDigits, ncUnlimited)),
    ),

    // Variables
    // Can be a comma-separated list
    variables_section: $ => seq(
      'variables:',
      repeat($.variable_declarations),
    ),

    variable_declarations: $ => seq(
      field('type', $.type),
      commaSep($.variable),
      ';',
    ),

    variable: $ => seq(
      field('name', $.identifier),
      optional(field('dimensions', $.dimension_spec)),
    ),

    dimension_spec: $ => seq(
      '(',
      commaSep($.identifier),
      ')',
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

    // Types used in declarations
    type: $ => choice(
      'byte', 'char', 'short', 'int', 'float', 'double', 'ubyte', 'ushort', 'uint', 'int64', 'uint64', 'string',
    ),

    // Comments exist anywhere on one line preceded by //
    comment: $ => token(seq('//', /.*/)),

    // Statements should end in a ;
    statement: $ => seq($.identifier, ';'),
  },

});

/**
 * Creates a rule to match one or more of the rules separated by a comma
 * Based on similar rule from tree-sitter-json
 *
 * @param {RuleOrLiteral} rule
 *
 * @returns {SeqRule}
 */
function commaSep(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
