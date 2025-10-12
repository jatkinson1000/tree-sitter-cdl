# tree-sitter-cdl

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jatkinson1000/tree-sitter-cdl/ci.yaml?style=plastic&label=CI)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jatkinson1000/tree-sitter-cdl/lint.yaml?style=plastic&label=Quality)

[CDL (Common Data Language)](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html)
grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

CDL is used to represent data from [NetCDF](https://docs.unidata.ucar.edu/netcdf-c)
files in a text-based, human-readable format.


## Setup and Use

### Basic setup

1. **Install the tree-sitter CLI.**\
   There are [several ways of doing this](https://tree-sitter.github.io/tree-sitter/creating-parsers/1-getting-started.html#installation).
   The easiest, assuming you
   [have Rust on your system](https://rust-lang.org/tools/install/), is using
   [cargo](https://doc.rust-lang.org/cargo/getting-started/installation.html):
   ```
   cargo install tree-sitter-cli --locked
   ```

2. **Clone this repository.**

3. [**Set up tree-sitter**](https://tree-sitter.github.io/tree-sitter/cli/init-config.html)
   by running:
   ```
   tree-sitter init-config
   ```
   and [edit the resulting configuration file](https://tree-sitter.github.io/tree-sitter/cli/init-config.html#parser-directories)
   to add the directory **containing** `tree-sitter-cdl/` to the `parser-directories`
   array. Note: you must add the _containing_ directory, not the directory itself!

4. **Build the CDL grammar**\
   Navigate to the `tree-sitter-cdl` directory that you cloned and run:
   ```
   tree-sitter generate
   ```
   You can test if this was successful by running `tree-sitter dump-languages`
   from somewhere else which should show information for the cdl language.

4. **Run**\
   You should now be able to run syntax highlighting on a `.cdl` file from the
   command line by running:
   ```
   tree-sitter highlight myfile.cdl
   ```

For the many ways in which you can use a tree-sitter grammar and parser see the
[official tree-sitter documentation](https://tree-sitter.github.io/tree-sitter/index.html).


### Highlighting for `ncdump`

To get syntax highlighting on the results of the `ncdump` command we need to pipe
the output to the tree-sitter highlight query.
Since we cannot detect the file type from the extension (`.cdl`) we need to tell
tree-sitter which scope to use.
```
ncdump myfile.nc | tree-sitter highlight --scope source.cdl
```

If you want this to be the default behaviour for ncdump then add the following to
your `.bashrc` or `.zshrc` file:
```bash
ncdump() {
  command ncdump "$@" | tree-sitter highlight --scope source.cdl
}
```
This will create a function that automatically replaces ncdump to pipe through
tree-sitter whilst preserving options like `-h` or `-v var` etc.

If you want to preserve `ncdump` you could instead name it `nccolordump` or similar.


### Highlighting in text editors

Many text editors have support for tree-sitter including
[Neovim](https://github.com/nvim-treesitter/nvim-treesitter/tree/main)
and [emacs](https://www.emacswiki.org/emacs/Tree-sitter).
For specifics see [instructions for text-editors](https://github.com/jatkinson1000/tree-sitter-cdl/blob/main/doc/text-editors.md).


## License

Copyright &copy; Jack Atkinson

_tree-sitter-cdl_ is distributed under the
[MIT Licence](https://github.com/jatkinson1000/tree-sitter-cdl/blob/main/LICENSE).


## Project Roadmap

Detailed plans for development of this project can be seen in the 
[roadmap](https://github.com/jatkinson1000/tree-sitter-cdl/blob/main/doc/roadmap.md)
document.

These include future features and integration with other codes.


## Contributions

Contributions and collaborations are welcome.

For bugs, feature requests, and clear suggestions for improvement please
[open an issue](https://github.com/jatkinson1000/tree-sitter-cdl/issues).

If you have built something upon _tree-sitter-cdl_ that would be useful to others, or
can address an [open issue](https://github.com/jatkinson1000/tree-sitter-cdl/issues),
please [fork the repository](https://github.com/jatkinson1000/tree-sitter-cdl/fork) and
open a pull request.

Further details of the development process are available in the
[developer guidelines](https://github.com/jatkinson1000/tree-sitter-cdl/blob/main/doc/develop.md).


### Code of Conduct
Everyone participating in the _tree-sitter-cdl_ project, in particular in issues
and pull requests, is expected to treat other people with respect and, more
generally, to follow the guidelines articulated in the
[Python Community Code of Conduct](https://www.python.org/psf/codeofconduct/).


## Authors and Acknowledgment

_tree-sitter-cdl_ is currently a hobby project by [Jack Atkinson](https://jackatkinson.net/)
maintained in spare time.

If you make use of this please do let me know so that I can feature your work here.


## References

- [NetCDF User Guide: CDL Syntax](https://docs.unidata.ucar.edu/nug/2.0-draft/cdl.html).
- `ncgen.y` [YACC Parser from ncgen in NetCDF-C](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)
- `ncgen.l` [Lexer from ncgen in NetCDF-C](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)
