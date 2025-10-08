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

// integer suffixes s/S Short 16bit, l/L Long 32bit (deprecated), ll/LL Long Long 64bit
// and u/U Unsigned.
// u should be allowed either side of specifier by the CDL spec, but ncgen gives an error if after.
const integer_suffix = choice(
  /[uU]/, // Unsigned
  /[sS]/, // Short
  /[lL]{1,2}/, // Long or Long Long
  /[uU][lL]{1,2}/, // Unsigned Long or Unsigned Long Long
  // /[lL]{1,2}[uU]/, // Long Unsigned or Long Long Unsigned
  /[uU][sS]/, // Unsigned Short
  // /[sS][uU]/, // Short Unsigned
);


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
      field('size', $.dimension_size),
    ),

    dimension_size: $ => choice(decimalDigits, ncUnlimited),

    // Variables
    // Can be a comma-separated list
    variables_section: $ => seq(
      'variables:',
      repeat(
        choice(
          $.variable_declarations,
          $.attribute,
        ),
      ),
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

    // Attributes
    attribute: $ => seq(
      optional(field('type', $.type)),
      optional(field('variable', $.identifier)),
      ':',
      field('name', $.identifier),
      '=',
      field('value', commaSep($.value)),
      ';',
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

    // Types used in declarations
    type: $ => choice(
      'char', 'byte', 'short', 'int', 'long', 'float', 'real', 'double', 'ubyte', 'ushort', 'uint', 'int64', 'uint64', 'string',
    ),

    // Constants used in CDL.
    // These follow C: https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html#constants
    // with a few additional caveats
    value: $ => choice(
      $.integer,
    ),

    // Decimals, Octal, or Hex
    integer: $ => token(
      seq(
        choice(
          /-?\d+/, // Decimal
          /-?0[0-7]+/, // Octal
          /-?0[xX][0-9a-fA-F]+/, // Hexadecimal
        ),
        optional(integer_suffix),
      ),
    ),

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
