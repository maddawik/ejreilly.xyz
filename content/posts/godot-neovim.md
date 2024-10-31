---
title: 'Godot & Neovim'
date: 2024-03-22T22:15:15-04:00
# weight: 1
# aliases: ["/first"]
tags: ["godot", "neovim", "lazyvim"]
author: "EJ Reilly"
# author: ["Me", "You"] # multiple authors
showToc: false
TocOpen: false
draft: false
hidemeta: false
comments: false
description: "How to configure Neovim for game development with Godot"
# canonicalURL: "https://canonical.url/to/page"
disableHLJS: true # to disable highlightjs
disableShare: true
disableHLJS: false
hideSummary: false
searchHidden: true
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
# cover:
    # image: "<image path/url>" # image path/url
    # alt: "<alt text>" # alt text
    # caption: "<text>" # display caption under cover
    # relative: false # when using page bundles set this to true
# hidden: true # only hide on current single page
# editPost:
    # URL: "https://github.com/mawdac/blog/content"
    # Text: "Suggest Changes" # edit text
    # appendFilePath: true # to append file path to Edit link
---

## Motivation

Not using vim-motions to edit code is painful. Godot has no vim-mode builtin,
so we need to configure neovim for editing our code. Fortunately for us, this
is not only pretty easy - but allows us a few extra benefits we can't get with
Godots builtin editor.

> 📌 This configuration was initially done using neovim `0.9.5` and godot
> `4.2.1` and assumes these versions (or later) are what you're using.

## Neovim Configuration

This example uses the [lazy.nvim](https://github.com/folke/lazy.nvim) package manager.

Feel free to use all of this, or just pick our the bits you need. Each piece
is commented to explain it's use, so just check it out!

```lua
-- Try to connect to the godot-lsp server whenever we open a gdscript file
vim.api.nvim_create_autocmd("FileType", {
  group = vim.api.nvim_create_augroup("godot_lsp", { clear = true }),
  pattern = { "gd", "gdscript" },
  callback = function()
    -- Make sure the port you connect to here matches what under
    -- Editor > Editor Settings > Network > Language Server > Remote Port
    local cmd = vim.lsp.rpc.connect("127.0.0.1", 6005)

    vim.lsp.start({
      name = "gdscript",
      filetypes = { "gdscript" },
      cmd = cmd,
      autostart = true,
      root_dir = vim.fs.dirname(vim.fs.find({ "project.godot", ".git" }, { upward = true })[1]),
    })
  end,
  desc = "Enable godot LSP for gdscript files",
})
-- Add a commentstring for godot so we can easily comment code
vim.api.nvim_create_autocmd("FileType", {
  group = vim.api.nvim_create_augroup("godot_commentstring", { clear = true }),
  pattern = { "gd", "gdscript" },
  callback = function()
    vim.bo.commentstring = "# %s"
  end,
  desc = "Change commentstring for gdscript files",
})

return {
  -- Install Treesitter grammar
  {
    "nvim-treesitter/nvim-treesitter",
    -- I also use LazyVim, so to extend the list of treesitter parsers I want
    -- installed I do it this way. If you don't use LazyVim, you can do it the
    -- same way mason is configured below.
    opts = function(_, opts)
      vim.list_extend(opts.ensure_installed, {
        "gdscript",
      })
    end,
  },
  -- Install linting and formatting tools
  {
    "williamboman/mason.nvim",
    opts = {
      ensure_installed = {
        "gdtoolkit",
      },
    },
  },
  -- Configure linting
  {
    "mfussenegger/nvim-lint",
    opts = {
      linters_by_ft = {
        gdscript = { "gdlint" },
      },
    },
  },
  -- Configure formatting
  {
    "stevearc/conform.nvim",
    opts = {
      formatters_by_ft = {
        gdscript = { "gdformat" },
      },
      formatters = {
        gdformat = {
          prepend_args = { "--line-length", "120" },
        },
      },
    },
  },
}
```

> ❗There's a [known
> issue](https://github.com/Scony/godot-gdscript-toolkit/issues/264) with
> installing gdtoolkit that you may run into.
> In my case I had to do the following on MacOS:

```sh
# cd to where mason installs gdtoolkit
cd ~/.local/share/nvim/mason/packages/gdtoolkit

# Use the virtualenv that mason uses
source venv/bin/activate

# Check for setuptools
pip list

# If not installed...
pip install setuptools
```

## Opening Files in Neovim from Godot

With Neovim configured you can get by just fine at this point. However if you
want it so that clicking a file in Godot will open the appropriate file in
Neovim - it requires a couple extra steps.

Neovim has a client/server mode builtin for remote development. We can use this
to interact with it from Godot. By running `nvim --listen /path/to/file.pipe .`
we can run neovim in server mode with a pipe or socket it will use for
communication.

For convenience you can create an alias in your shell. For `bash` or `zsh`, add
this to your `~/.bashrc` or `~/.zshrc` respectively. For fish add it to your
`~/.config/fish/config.fish`. Or wherever you organize your aliases.

```sh
# bash/zsh
alias nvg='nvim --listen /tmp/godot.pipe .'

# fish
alias nvg 'nvim --listen /tmp/godot.pipe .'
```

Now whenever we run `nvg` it will listen to a `/tmp/godot.pipe` file. Let's go
create that file.

### Godot configuration

Inside Godot navigate to `Editor > Editor Settings > Text Editor > External`

{{< figure src="/posts/images/godot-editor-settings.png" >}}

From here you should:

1. Toggle "Use External Editor" on
2. Set the "Exec Path" to your neovim installation (you can get the path by
   running `which nvim`)
3. Set the "Exec Flags" to:

```sh
--server /tmp/godot.pipe --remote-send "<C-\><C-N>:n {file}<CR>:call cursor({line},{col})<CR>"`
```

Now each time we run Godot, it will run neovim in server mode and communicate
over the `/tmp/godot.pipe` file we specified! Huzzah!

## Success

Now we have:

- LSP Integration
- Treesitter
- Formatting
- Linting
- We can open files from godot

This is a pretty great improvement on the in-editor experience with godot!
