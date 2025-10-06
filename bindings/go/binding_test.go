package tree_sitter_cdl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_cdl "github.com/jatkinson1000/tree-sitter-cdl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cdl.Language())
	if language == nil {
		t.Errorf("Error loading Common Data Language grammar")
	}
}
