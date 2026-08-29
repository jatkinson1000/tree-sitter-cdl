#include "tree_sitter/array.h"
#include "tree_sitter/parser.h"
#include <wctype.h>

// External scanner for CDL paths (absolute, slash-separated references such
// as /g1/g2/t1 - see the 'path' rule in grammar.js). It provides the two
// tokens the tree-sitter DSL cannot express: a single '/' that is never
// confused with the '//' comment, and a path_identifier that matches the
// identifier rule but is valid only where a path element may appear.

// Order matches `externals: ['/', $.path_identifier]` in grammar.js:
enum TokenType {
  SLASH,
  IDENTIFIER,
};

// ignore current character and advance
static inline void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

// Historically all NC identifiers started with a letter or underscore
static bool is_letter_or_underscore(int32_t c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

// The original NC character set.
// These do not need to be escaped for backwards compatibility
static bool is_nc_special(int32_t c) {
  return is_letter_or_underscore(c) || (c >= '0' && c <= '9') ||
         c == '.' || c == '@' || c == '+' || c == '-';
}

// Today identifiers can start with and contain UTF8 characters
static bool is_utf8_char(int32_t c) { return c >= 0x80; }

// Today identifiers can start with an escaped digit
static bool is_escaped_digit(TSLexer *lexer) {
  if (lexer->lookahead == '\\') {
    lexer->advance(lexer, false);
    if (lexer->lookahead >= '0' && lexer->lookahead <= '9') {
      while (lexer->lookahead >= '0' && lexer->lookahead <= '9') {
        lexer->advance(lexer, false);
      }
      return true;
    }
  }
  return false;
}

// Certain ascii characters need to be escaped in identifiers
static bool is_escaped_char(TSLexer *lexer) {
  if (lexer->lookahead == '\\') {
    lexer->advance(lexer, false);
    int32_t c = lexer->lookahead;
    if (strchr(" !\"#$%&'()*,:;<=>?[\\]^`{|}~", c)) {
      lexer->advance(lexer, false);
      return true;
    }
  }
  return false;
}

// Starting characters today can be letter or underscore, escaped digit, or UTF8
static bool is_ident_starter(TSLexer *lexer) {
  int32_t c = lexer->lookahead;
  return is_letter_or_underscore(c) ||
         is_utf8_char(c) ||
         is_escaped_digit(lexer);
}

// Reports whether the current position starts an identifier character.
// *consumed is set to true when the character is an escape pair, which
// is_escaped_char has already advanced past; plain characters still need
// advancing past by the caller.
static bool is_ident_value(TSLexer *lexer, bool *consumed) {
  int32_t c = lexer->lookahead;
  *consumed = false;
  if (is_nc_special(c) || is_utf8_char(c))
    return true;
  if (is_escaped_char(lexer)) {
    *consumed = true;
    return true;
  }
  return false;
}

void *tree_sitter_cdl_external_scanner_create() { return NULL; }

void tree_sitter_cdl_external_scanner_destroy(void *payload) {
  // ...
}

unsigned tree_sitter_cdl_external_scanner_serialize(void *payload,
                                                    char *buffer) {
  return 0;
}

void tree_sitter_cdl_external_scanner_deserialize(void *payload,
                                                  const char *buffer,
                                                  unsigned length) {}

// Called by tree-sitter whenever the current parse state allows an external
// token; valid_symbols[] says which (indexed by the enum above). Consume the
// characters of one such token, set lexer->result_symbol, and return true;
// otherwise return false to fall back to the internal lexer.
bool tree_sitter_cdl_external_scanner_scan(void *payload, TSLexer *lexer,
                                           const bool *valid_symbols) {
  // Emit exactly one '/' as the path separator. The scanner is only invoked
  // where a path may follow, so this '/' can never open a '//' comment.
  if (valid_symbols[SLASH] && lexer->lookahead == '/') {
    lexer->advance(lexer, false);
    lexer->result_symbol = SLASH;
    return true;
  }

  if (valid_symbols[IDENTIFIER]) {
    // Start
    if (is_ident_starter(lexer)) {
      // Continue
      bool consumed;
      while (is_ident_value(lexer, &consumed)) {
        // Only advance past plain characters; escape pairs were already
        // consumed by is_escaped_char (advancing again would swallow - and
        // mis-tokenise - the following character, e.g. a '/' separator).
        if (!consumed)
          lexer->advance(lexer, false);
      }
      // Token ends at the last char consumed, so no mark_end() is needed.
      lexer->result_symbol = IDENTIFIER;
      return true;
    }
  }

  return false;
}
