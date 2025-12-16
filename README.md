# terrafaker

CLI for easily generating fake terraform files and repos

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/terrafaker.svg)](https://npmjs.org/package/terrafaker)
[![Downloads/week](https://img.shields.io/npm/dw/terrafaker.svg)](https://npmjs.org/package/terrafaker)

## Goals

The primary goal of this tool is to quickly generate seed data for testing out platforms that use infrastructure-as-code, like [Infracost](https://www.infracost.io/). The data used to generate the infrastructure configurations is based on public cloud provider docs, but there is no guarantee that the configurations are valid. For example, only some Azure VMs support _accelerators_ or GPU add-ons, but this tool does not encode any of that logic.

Obviously, you shouldn't use this tool to try to generate real production infrastructure.

## Features

- Generate individual files
- Generate git repos with multiple files (and optionally push them to GitHub)
- Bulk clone and delete generated repos by prefix

### Supported providers and resources

- AWS
    - Compute instances
    - Functions
- GCP
    - Compute instances
    - Functions
- Azure
    - Compute instances
    - Functions

## Issues

If you find a bug, feel free to [open up an issue](https://github.com/brandongregoryscott/terrafaker/issues/new) and try to describe it in detail with reproduction steps if possible.

If you would like to see a feature, and it isn't [already documented](https://github.com/brandongregoryscott/terrafaker/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement), feel free to open up a new issue and describe the desired behavior.

<!-- prettier-ignore-start -->
<!-- toc -->
* [terrafaker](#terrafaker)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g terrafaker
$ terrafaker COMMAND
running command...
$ terrafaker (--version)
terrafaker/0.0.4 darwin-arm64 node-v24.8.0
$ terrafaker --help [COMMAND]
USAGE
  $ terrafaker COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`terrafaker generate file`](#terrafaker-generate-file)
* [`terrafaker generate repo`](#terrafaker-generate-repo)
* [`terrafaker gh clone-repos`](#terrafaker-gh-clone-repos)
* [`terrafaker gh delete-repos`](#terrafaker-gh-delete-repos)
* [`terrafaker help [COMMAND]`](#terrafaker-help-command)

## `terrafaker generate file`

Generates a terraform file.

```
USAGE
  $ terrafaker generate file [--name <value>] [--provider aws|gcp|azure] [--resource-count <value>] [-f] [-q]

FLAGS
  -f, --[no-]format             Format the output terraform files. Requires `terraform` to be in your $PATH.
  -q, --quiet                   Suppress the logging output.
      --name=<value>            Name for the generated file, which must end in .tf
      --provider=<option>       Cloud provider to generate resources for
                                <options: aws|gcp|azure>
      --resource-count=<value>  [default: 3] Number of resources per file to generate

DESCRIPTION
  Generates a terraform file.
```

_See code: [src/commands/generate/file.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.4/src/commands/generate/file.ts)_

## `terrafaker generate repo`

Generates repo(s) with multiple terraform files.

```
USAGE
  $ terrafaker generate repo [--directory <value>] [--count <value>] [--file-count <value>] [--resource-count
    <value>] [--prefix <value>] [--provider aws|gcp|azure] [-f] [--create-remote] [--public] [-q]

FLAGS
  -f, --[no-]format             Format the output terraform files. Requires `terraform` to be in your $PATH.
  -q, --quiet                   Suppress the logging output.
      --count=<value>           [default: 1] Number of repos to generate
      --create-remote           Create and push a remote GitHub repo. Requires the `gh` CLI to be installed. To install,
                                run `brew install gh`.
      --directory=<value>       [default: .] Directory to generate the repo(s) in
      --file-count=<value>      [default: 3] Number of files per repo to generate
      --prefix=<value>          [default: tf_] Prefix for repo names, useful for quickly identifying generated content
      --provider=<option>       Cloud provider to generate resources for
                                <options: aws|gcp|azure>
      --public                  Whether the remote repo(s) created are public.
      --resource-count=<value>  [default: 3] Number of resources per file to generate

DESCRIPTION
  Generates repo(s) with multiple terraform files.
```

_See code: [src/commands/generate/repo.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.4/src/commands/generate/repo.ts)_

## `terrafaker gh clone-repos`

Clones repos from your Github account, useful for pulling down generated repos for manual modifications. Requires the `gh` CLI to be installed. To install, run `brew install gh`.

```
USAGE
  $ terrafaker gh clone-repos --prefix <value> [--directory <value>]

FLAGS
  --directory=<value>  [default: .] Directory to clone the repo(s) in
  --prefix=<value>     (required) Prefix for the repos to clone, such as 'tf_'

DESCRIPTION
  Clones repos from your Github account, useful for pulling down generated repos for manual modifications. Requires the
  `gh` CLI to be installed. To install, run `brew install gh`.
```

_See code: [src/commands/gh/clone-repos.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.4/src/commands/gh/clone-repos.ts)_

## `terrafaker gh delete-repos`

Deletes repos from your Github account, useful for cleaning up generated test data. Requires the `gh` CLI to be installed. To install, run `brew install gh`.

```
USAGE
  $ terrafaker gh delete-repos --prefix <value>

FLAGS
  --prefix=<value>  (required) Prefix for the repos to delete, such as 'tf_'

DESCRIPTION
  Deletes repos from your Github account, useful for cleaning up generated test data. Requires the `gh` CLI to be
  installed. To install, run `brew install gh`.

  If the deletion fails, you may need to refresh your CLI permissions with `gh auth refresh -s delete_repo`
```

_See code: [src/commands/gh/delete-repos.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.4/src/commands/gh/delete-repos.ts)_

## `terrafaker help [COMMAND]`

Display help for terrafaker.

```
USAGE
  $ terrafaker help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for terrafaker.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.36/src/commands/help.ts)_
<!-- commandsstop -->
<!-- prettier-ignore-end -->
