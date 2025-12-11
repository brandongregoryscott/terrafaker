# terrafaker

CLI for easily generating terraform files and repos

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/terrafaker.svg)](https://npmjs.org/package/terrafaker)
[![Downloads/week](https://img.shields.io/npm/dw/terrafaker.svg)](https://npmjs.org/package/terrafaker)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
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

- [`terrafaker hello PERSON`](#terrafaker-hello-person)
- [`terrafaker hello world`](#terrafaker-hello-world)
- [`terrafaker help [COMMAND]`](#terrafaker-help-command)
- [`terrafaker plugins`](#terrafaker-plugins)
- [`terrafaker plugins add PLUGIN`](#terrafaker-plugins-add-plugin)
- [`terrafaker plugins:inspect PLUGIN...`](#terrafaker-pluginsinspect-plugin)
- [`terrafaker plugins install PLUGIN`](#terrafaker-plugins-install-plugin)
- [`terrafaker plugins link PATH`](#terrafaker-plugins-link-path)
- [`terrafaker plugins remove [PLUGIN]`](#terrafaker-plugins-remove-plugin)
- [`terrafaker plugins reset`](#terrafaker-plugins-reset)
- [`terrafaker plugins uninstall [PLUGIN]`](#terrafaker-plugins-uninstall-plugin)
- [`terrafaker plugins unlink [PLUGIN]`](#terrafaker-plugins-unlink-plugin)
- [`terrafaker plugins update`](#terrafaker-plugins-update)

## `terrafaker hello PERSON`

Say hello

```
USAGE
  $ terrafaker hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ terrafaker hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/hello/index.ts)_

## `terrafaker hello world`

Say hello world

```
USAGE
  $ terrafaker hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ terrafaker hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `terrafaker plugins`

List installed plugins.

```
USAGE
  $ terrafaker plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ terrafaker plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/index.ts)_

## `terrafaker plugins add PLUGIN`

Installs a plugin into terrafaker.

```
USAGE
  $ terrafaker plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into terrafaker.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TERRAFAKER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TERRAFAKER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ terrafaker plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ terrafaker plugins add myplugin

  Install a plugin from a github url.

    $ terrafaker plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ terrafaker plugins add someuser/someplugin
```

## `terrafaker plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ terrafaker plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ terrafaker plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/inspect.ts)_

## `terrafaker plugins install PLUGIN`

Installs a plugin into terrafaker.

```
USAGE
  $ terrafaker plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into terrafaker.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the TERRAFAKER_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the TERRAFAKER_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ terrafaker plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ terrafaker plugins install myplugin

  Install a plugin from a github url.

    $ terrafaker plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ terrafaker plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/install.ts)_

## `terrafaker plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ terrafaker plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ terrafaker plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/link.ts)_

## `terrafaker plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ terrafaker plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ terrafaker plugins unlink
  $ terrafaker plugins remove

EXAMPLES
  $ terrafaker plugins remove myplugin
```

## `terrafaker plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ terrafaker plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/reset.ts)_

## `terrafaker plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ terrafaker plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ terrafaker plugins unlink
  $ terrafaker plugins remove

EXAMPLES
  $ terrafaker plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/uninstall.ts)_

## `terrafaker plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ terrafaker plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ terrafaker plugins unlink
  $ terrafaker plugins remove

EXAMPLES
  $ terrafaker plugins unlink myplugin
```

## `terrafaker plugins update`

Update installed plugins.

```
USAGE
  $ terrafaker plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.54/src/commands/plugins/update.ts)_

<!-- commandsstop -->
