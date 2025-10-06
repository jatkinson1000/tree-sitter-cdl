import XCTest
import SwiftTreeSitter
import TreeSitterCdl

final class TreeSitterCdlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_cdl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Common Data Language grammar")
    }
}
