---
title: "Ink in Neovim"
date: 2023-12-12T23:14:41-05:00
description: "How to configure Neovim for writing stories with ink"
---

## Intro

Let's start with the basics:

[Ink](https://www.inklestudios.com/ink/) is an open-source narrative
scripting language created by the company Inkle. It comes with its own editor
called [inky](https://github.com/inkle/inky/releases).

The ink language allows you to write complex branching stories with many choices
in a "controlled-chaos" manner. It also comes with a compiler that lets you play
your stories as well as diagnose issues - it's called [inklecate](https://github.com/inkle/ink#ink-inky-ink-unity-integration-inkjs-inklecate-inkle-oh-my)

Inky is an excellent tool that lets you write your story, playtest it, view the
knots/stitches in a tree view, and so much more. It is a great piece of
software that I think you should use - but if you're like me and you want
to take advantage of vim-motions or your existing neovim config, then keep
reading.

---

### Syntax Highlighting

Unfortunately there isn't a treesitter grammar written for ink yet. Someone has
created regex-based highlighting though, and that will do for now.

```lua
-- lazy.nvim
return {
  "ahayworth/ink-syntax-vim",
  ft = "ink",
}
```

Voila! We now have syntax highlighting for a lot of the language. Moving on.

### Language Server?

There is no official LSP for ink. The inklecate compiler however does provide
errors and warnings that we can parse using
[none-ls](https://github.com/nvimtools/none-ls.nvim).

The first step is to download the [latest
release](https://github.com/inkle/ink/releases) of the compiler. Place it
somewhere on your computer, and then add that location to your `PATH` variable
if necessary.

Next you'll configure `none-ls` to use it.

```lua
local nls = require("null-ls")
local helpers = require("null-ls.helpers")
local inklecate = {
  method = nls.methods.DIAGNOSTICS,
  filetypes = { "ink" },
  -- null_ls.generator creates an async source
  -- that spawns the command with the given arguments and options
  generator = nls.generator({
    command = "inklecate",
    args = { "$FILENAME" },
    to_stdin = false,
    from_stderr = false,
    -- choose an output format (raw, json, or line)
    format = "line",
    check_exit_code = function(code, stderr)
      local success = code <= 1
      if not success then
        -- can be noisy for things that run often (e.g. diagnostics), but can
        -- be useful for things that run on demand (e.g. formatting)
        print(stderr)
      end
      return success
    end,
    -- use helpers to parse the output from string matchers,
    -- or parse it manually with a function
    on_output = helpers.diagnostics.from_patterns({
      {
        pattern = [[([^:]+): '([^']+)' line (%d+): (.*)]],
        groups = { "severity", "filename", "row", "message" },
        overrides = {
          severities = {
            ["ERROR"] = 1,
            ["WARNING"] = 2,
            ["TODO"] = 3,
          }
        },
      },
    }),
  }),
}
nls.register(inklecate)
```

This gives us the same LSP functionality as in Inky!

## What next

Sadly that's all I've been able to replicate so far in neovim. I'll continue to
update this blog as I find new ways to integrate ink into neovim, so check back
later. 🙃

Next steps for the ink-neovim community:

- treesitter grammar
- playtesting plugin
- tree view
- multi-file support
