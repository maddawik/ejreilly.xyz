---
title: "Discovering Atlantis"
date: 2025-11-26T21:55:57-05:00
# weight: 1
# aliases: ["/first"]
# tags: ["not-tagged"]
# author: "EJ Reilly"
# author: ["Me", "You"] # multiple authors
showToc: false
TocOpen: false
draft: true
hidemeta: false
comments: false
description: "FOSS Terraform Automation"
disableHLJS: true # to disable highlightjs
disableShare: true
hideSummary: false
searchHidden: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
---

[Atlantis](https://www.runatlantis.io/) isn't just a lost city. It's also an
open-source tool for terraform automation that uses a pull-request workflow,
making it easier to work collaboratively on infrastructure as code (IaC).

We're going to walk through setting up our own Atlantis server locally, running
against our own locally-hosted git server.

## Setup
