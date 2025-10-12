# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Tree-sitter package fr the CDL language
- Grammar support includes:
    - CDL files
        - comments
        - whitespace
    - Types
        - enum
        - opaque
        - vlen
        - compound
    - Dimensions
        - single and multi-line declarations
        - `unlimited` attribute
    - Variables
        - single and multi-line declarations
        - variable dimensions
    - Attributes
        - `type variable : field = values ;` format
        - type and variable optional
        - known ambiguity between type and variable assumed to be type
          as per the CDL specification. Set with precedence key.
    - Data
        - data assignments of single values, comma-separated lists
        - datalists `{ ... }` for compound types
        - fill value `_`
    - Identifiers
        - CDL names syntax: starting letter, underscore, escaped digit or UTF8
        - rimitive CDL types
        - derived types
        - values: float, integer (decimal, octal, hex), byte, char, string
- Comprehensive test suite for implemented features
- Syntax highlighting through queries
- User and developer documentation
