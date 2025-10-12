# Syntax highlighting in text editors

Many text editors support the use of Tree-sitter in syntax highlighting and various
other features a parser can provide.


## Neovim

To use this code in Neovim requires the
[nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/tree/main)
plugin to be installed.

The precise method for this will depend on your choice of plugin manager, but for Plug it is something like this:
```lua
local Plug = vim.fn['plug#']
vim.call('plug#begin', vim.fn.stdpath('data') .. '/site/plugged')

-- Install Tree-sitter
Plug('nvim-treesitter/nvim-treesitter', { ['branch'] = 'main', ['do'] = ':TSUpdate' })  -- TreeSitter

vim.call('plug#end')
```

> [!NOTE]  
> We specify the use of the `main` branch rather than the deprecated `master`.
> Many people still use the `master` branch whilst the changes to `main`
> are stabilising which can be installed by ommitting the `['branch'] = 'main'`
> from the install command.

### Latest version of nvim-treesitter (`main`)

Details of generic tree-sitter setup are in the
[nvim-treesitter documentation](https://github.com/nvim-treesitter/nvim-treesitter/tree/main?tab=readme-ov-file#setup).
Once this is complete the CDL language can be installed with the following steps:

1. Add a `User TSUpdate` autocommand to your lua config to add the grammar:
   ```lua
   vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
   callback = function()
     require('nvim-treesitter.parsers').cdl = {
       install_info = {
         url = 'https://github.com/jatkinson1000/tree-sitter-cdl',
         -- revision = '<hash>', -- commit hash for revision to check out
         queries = 'queries',
       },
     }
   end})
   ```
   Note you can uncomment and provide by a commit `<hash>` to get a specific
   version (e.g. latest release).

2. Add a `FileType` autocommand to your lua config to recognise the `.cdl`
   filetype and run tree-sitter:
   ```lua
   vim.api.nvim_create_autocmd('FileType', {
     pattern = { 'cdl' },
     callback = function() vim.treesitter.start() end,
   })
   ```

3. Start Neovim and run `:TSInstall cdl`.

4. Open a cdl file and see the highlights and use the Tree-sitter features.

### Legacy versions of nvim-treesitter (`master`)

Details of generic setup are in the
[nvim-treesitter documentation](https://github.com/nvim-treesitter/nvim-treesitter/tree/master).
Once this is complete the CDL language can be installed with the following steps:

1. Add a parser install command to your lua config to add the grammar.
   ```lua
   local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
   parser_config.cdl = {
       install_info = {
           url = 'https://github.com/jatkinson1000/tree-sitter-cdl',
           -- revision = '<hash>', -- commit hash for revision to check out
           files = { 'src/parser.c' },
           branch = "main",
           generate_reqires_npm = false,
           requires_generate_from_grammar = false,
       },
       -- The filetype you want it registered as
       filetype = 'cdl',
   }
   ```
   Note you can uncomment and provide by a commit `<hash>` to get a specific
   version (e.g. latest release).

2. Copy the contents of
   [queries/](https://github.com/jatkinson1000/tree-sitter-cdl/tree/main/queries)
   to your Neovim config `~/.config/nvim/queries/cdl/` to enable syntax
   highlighting and more.

3. Start Neovim and run `:TSInstall cdl`.

4. Open a cdl file and see the highlights and use the Tree-sitter features.


## emacs

emacs comes with built in support for tree-sitter since version 29+.

Grammars can be installed using the `treesit-install-language-grammar` command:
```
M-x treesit-install-language-grammar

Language: cdl
There is no recipe for c, do you want to build it interactively? (y or n) y
Enter the URL of the Git repository of the language grammar: https://github.com/jatkinson1000/tree-sitter-cdl
Enter the tag or branch (default: default branch): <RET>
Enter the subdirectory in which the parser.c file resides (default: "src"): <RET>
Enter the C compiler to use (default: auto-detect): <RET>
Enter the C++ compiler to use (default: auto-detect): <RET>

Cloning repository
Compiling library
Library installed to ~/.emacs.d/tree-sitter/libtree-sitter-cdl.dll
```
