# terrafaker

CLI for easily generating terraform files and repos

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/terrafaker.svg)](https://npmjs.org/package/terrafaker)
[![Downloads/week](https://img.shields.io/npm/dw/terrafaker.svg)](https://npmjs.org/package/terrafaker)

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
terrafaker/0.0.0 darwin-arm64 node-v24.8.0
$ terrafaker --help [COMMAND]
USAGE
  $ terrafaker COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`terrafaker generate`](#terrafaker-generate)
* [`terrafaker generate file`](#terrafaker-generate-file)
* [`terrafaker generate repo`](#terrafaker-generate-repo)
* [`terrafaker gh`](#terrafaker-gh)
* [`terrafaker gh clone-repos`](#terrafaker-gh-clone-repos)
* [`terrafaker gh delete-repos`](#terrafaker-gh-delete-repos)
* [`terrafaker help [COMMAND]`](#terrafaker-help-command)
* [`terrafaker util`](#terrafaker-util)
* [`terrafaker util format-psv PSV`](#terrafaker-util-format-psv-psv)

## `terrafaker generate`

Commands for generating terraform files.

```
USAGE
  $ terrafaker generate

DESCRIPTION
  Commands for generating terraform files.
```

_See code: [src/commands/generate/index.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/generate/index.ts)_

## `terrafaker generate file`

```
USAGE
  $ terrafaker generate file [--name <value>] [-f]

FLAGS
  -f, --[no-]format   Format the output terraform files. Requires `terraform` to be in your $PATH.
      --name=<value>  Name for the generated file, which must end in .tf
```

_See code: [src/commands/generate/file.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/generate/file.ts)_

## `terrafaker generate repo`

```
USAGE
  $ terrafaker generate repo [--directory <value>] [--count <value>] [--file-count <value>] [--resource-count
    <value>] [--prefix <value>] [-f] [--create-remote] [--public]

FLAGS
  -f, --[no-]format             Format the output terraform files. Requires `terraform` to be in your $PATH.
      --count=<value>           [default: 1] Number of repos to generate
      --create-remote           Create and push a remote GitHub repo. Requires the `gh` CLI to be installed and
                                authenticated.
      --directory=<value>       [default: .] Directory to generate the repo(s) in
      --file-count=<value>      [default: 3] Number of files per repo to generate
      --prefix=<value>          [default: tf_] Prefix for repo names, useful for quickly identifying generated content
      --public                  Whether the remote repo(s) created are public.
      --resource-count=<value>  [default: 3] Number of resources per file to generate
```

_See code: [src/commands/generate/repo.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/generate/repo.ts)_

## `terrafaker gh`

Utility commands that wrap the `gh` CLI. Requires the `gh` CLI to be installed. To install, run `brew install gh`.

```
USAGE
  $ terrafaker gh

DESCRIPTION
  Utility commands that wrap the `gh` CLI. Requires the `gh` CLI to be installed. To install, run `brew install gh`.
```

_See code: [src/commands/gh/index.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/gh/index.ts)_

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

_See code: [src/commands/gh/clone-repos.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/gh/clone-repos.ts)_

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

_See code: [src/commands/gh/delete-repos.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/gh/delete-repos.ts)_

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

## `terrafaker util`

Miscellaneous utility commands.

```
USAGE
  $ terrafaker util

DESCRIPTION
  Miscellaneous utility commands.
```

_See code: [src/commands/util/index.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/util/index.ts)_

## `terrafaker util format-psv PSV`

```
USAGE
  $ terrafaker util format-psv PSV

ARGUMENTS
  PSV  Pipe-separated value to format into a string array, i.e. 'm5.large | m5.xlarge | m5.2xlarge'.
       If the string is multiple lines, it will be formatted into an object where the key is the first column before a
       tab, i.e. 'M5	m5.large | m5.xlarge | m5.2xlarge'
```

_See code: [src/commands/util/format-psv.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/util/format-psv.ts)_
<!-- commandsstop -->
