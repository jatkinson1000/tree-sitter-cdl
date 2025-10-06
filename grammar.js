/**
 * @file Tree-sitter grammar for the Common Data Language for representing NetCDF data.
 * @author Jack Atkinson <jack.atkinson1000@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "cdl",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
