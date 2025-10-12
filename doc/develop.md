# Developer guidelines

A good starting point is the Tree-sitter documentation for
[creating new parsers](https://tree-sitter.github.io/tree-sitter/creating-parsers/index.html)
and the
[CDL language specification](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html).


## Development environment

Tree-sitter-cdl is developed in javascript in a node environment.
It requires node and npm to be installed.

To set up the environment clone the repository and from the root run:
```
npm install
```
to install the dependencies.


## Development process

After editing the grammar in `grammar.js` it can be processed to create an
updated version:

1. Code quality\
   Run:
   ```
   npm lint
   ```
   to execute ESLint and ensure code is compliant.

2. Generate grammar and parser

   The grammar is developed in the `grammar.js` file.

   After modification an updated version of the grammar and parser can be generated using:
   ```
   tree-sitter generate
   ```

3. Run tests

   Tests are contained in `test/corpus/` as a series of `.txt` files.
   The format is a code snippet followed by the expected syntax tree.

   Run the tests with the new grammar:
   ```
   tree-sitter test
   ```
   Normally these should pass.

   If you have changed the grammar in a way that
   changes the expected output then _after checking_ they can be auto-updated by
   running:
   ```
   tree-sitter-test --update
   ```

4. Check highlighting and parsing

   Highlighting rules are defined for tokens and keywords in
   `queries/highlights.scm`. These should be updated for new tokens/rules as
   appropriate.

   Check highlighting by running:
   ```
   tree-sitter highlight myfile.cdl
   ```
   and observing the output.

   Parsing can also be checked, if desired, by running:
   ```
   tree-sitter parse myfile.cdl
   ```
   to output a syntax tree.

5. Update `tree-sitter.json`

   If required update the package details in `tree-sitter.json`.

6. Commit work

   Commits are expected to be [atomic](https://en.wikipedia.org/wiki/Atomic_commit)
   and follow the [Conventional commits](https://www.conventionalcommits.org)
   specification.

   Notable changes should also update the changelog.


## Code quality

Code quality is enforced through a linting workflow that checks:

- `grammar.js` using [ESLint](https://github.com/eslint/eslint)
- GitHub workflows using [zizmor](https://github.com/zizmorcore/zizmor)


## References

- [NetCDF User Guide: CDL Syntax](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html).
- `ncgen.y` [YACC Parser from ncgen in NetCDF-C](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)
- `ncgen.l` [Lexer from ncgen in NetCDF-C](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)

