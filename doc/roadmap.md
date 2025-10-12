## Project Roadmap

> [!NOTE]  
> This project is still in early stages and therefore subject to significant
> changes.

Of particular use are the YAAC parser file
[`ncgen.y`](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l)
and the corresponding lexer file
[`ncgen.l`](https://github.com/Unidata/netcdf-c/blob/main/ncgen/ncgen.l) from `netcdf-c`.

A rough outline is as follows:

- [x] Run tree-sitter-init and generate base repository
- [ ] Implement rules in the grammar file
    - [x] Basic syntax (names, comments, whitespace)
    - [x] Types
    - [x] Dimensions
    - [x] Variables
    - [ ] Data
        - [x] Datalists
        - [ ] Enum values in data
    - [ ] Attributes
        - [x] Generic attributes
        - [ ] Global attributes
        - [ ] Special attributes
    - [ ] Groups
- [ ] Build and ship external bindings
    - [ ] Rust
    - [ ] Python
- [ ] Syntax highlighting
    - [x] tree-sitter queries
    - [ ] TextMate
- [ ] Contribute to external libraries
    - [ ] Neovim tree-sitter
    - [ ] VSCode (Requires TextMate)?
- [ ] Build own libraries
    - [ ] Formatter
    - [ ] Linter
