# tree-sitter-cdl

[CDL (Common Data Language)](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html)
grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

CDL is used to represent data from [NetCDF](https://docs.unidata.ucar.edu/netcdf-c)
files in a text-based, human-readable format.


## Project Progress

> [!NOTE]  
> This project is in early stages and therefore subject to significant
> changes.

It follows the tree-sitter guidance for
[adding new parsers](https://tree-sitter.github.io/tree-sitter/creating-parsers/index.html)
and uses the CDL syntax
[outlined in the NetCDF User Guide](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html).

Of particular use are the YAAC parser file
[`ncgen.y`](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)
and the corresponding lexer file
[`ncgen.l`](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l) from `netcdf-c`.

A rough outline is as follows:

- [x] Run tree-sitter-init and generate base repository
- [ ] Implement rules in the grammar file
    - [x] Basic syntax (names, comments, whitespace)
    - [x] Dimensions
    - [ ] Variables
    - [ ] Data
    - [ ] Types
    - [ ] ...
- [ ] Implement syntax highlighting for TextMate and use


## Setup and Use

WIP


## License

Copyright &copy; Jack Atkinson

_tree-sitter-cdl_ is distributed under the [MIT Licence](https://github.com/jatkinson1000/tree-sitter-cdl/blob/main/LICENSE).


## Contributions

Contributions and collaborations are welcome.

For bugs, feature requests, and clear suggestions for improvement please
[open an issue](https://github.com/jatkinson1000/tree-sitter-cdl/issues).

If you have built something upon _tree-sitter-cdl_ that would be useful to others, or
can address an [open issue](https://github.com/jatkinson1000/tree-sitter-cdl/issues),
please [fork the repository](https://github.com/jatkinson1000/tree-sitter-cdl/fork) and
open a pull request.

### Code of Conduct
Everyone participating in the _tree-sitter-cdl_ project, and in particular in the
issue tracker, pull requests, and social media activity, is expected to treat other
people with respect and, more generally, to follow the guidelines articulated in the
[Python Community Code of Conduct](https://www.python.org/psf/codeofconduct/).

### Developer guidelines

Code quality is enforced through a linting workflow that checks the `grammar.js` file
using [eslint](https://github.com/eslint/eslint) and GitHub workflows using
[zizmor](https://github.com/zizmorcore/zizmor).


## Authors and Acknowledgment

_tree-sitter-cdl_ is currently a hobby project by [Jack Atkinson](https://jackatkinson.net/)
maintained in spare time.

See [Contributors](https://github.com/jatkinson1000/tree-sitter-cdl/graphs/contributors)
for a full list of contributors.

If you make use of this please do let me know so that I can feature your work here.
