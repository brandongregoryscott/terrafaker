# Commands

<!-- commands -->

- [`terrafaker az repo clone`](#terrafaker-az-repo-clone)
- [`terrafaker az repo delete`](#terrafaker-az-repo-delete)
- [`terrafaker az repo list`](#terrafaker-az-repo-list)
- [`terrafaker generate file`](#terrafaker-generate-file)
- [`terrafaker generate repo`](#terrafaker-generate-repo)
- [`terrafaker gh repo clone`](#terrafaker-gh-repo-clone)
- [`terrafaker gh repo delete`](#terrafaker-gh-repo-delete)
- [`terrafaker gh repo list`](#terrafaker-gh-repo-list)
- [`terrafaker glab repo clone`](#terrafaker-glab-repo-clone)
- [`terrafaker glab repo delete`](#terrafaker-glab-repo-delete)
- [`terrafaker glab repo list`](#terrafaker-glab-repo-list)
- [`terrafaker health`](#terrafaker-health)
- [`terrafaker help [COMMAND]`](#terrafaker-help-command)

## `terrafaker az repo clone`

Clones repos from your Azure account, useful for pulling down generated repos for manual modifications.

```
USAGE
  $ terrafaker az repo clone --prefix <value> [--directory <value>]

FLAGS
  --directory=<value>  [default: .] Directory to create the repo(s) in
  --prefix=<value>     (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Clones repos from your Azure account, useful for pulling down generated repos for manual modifications.
```

_See code: [src/commands/az/repo/clone.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/az/repo/clone.ts)_

## `terrafaker az repo delete`

Deletes repos from your Azure account, useful for cleaning up generated test data.

```
USAGE
  $ terrafaker az repo delete --prefix <value>

FLAGS
  --prefix=<value>  (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Deletes repos from your Azure account, useful for cleaning up generated test data.
```

_See code: [src/commands/az/repo/delete.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/az/repo/delete.ts)_

## `terrafaker az repo list`

Lists repos from your Azure account, useful for debugging.

```
USAGE
  $ terrafaker az repo list

DESCRIPTION
  Lists repos from your Azure account, useful for debugging.
```

_See code: [src/commands/az/repo/list.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/az/repo/list.ts)_

## `terrafaker generate file`

Generates a terraform file.

```
USAGE
  $ terrafaker generate file [--chaos-tags | --tags <value> | --no-tags] [-f] [--name <value>] [--provider
    aws|azure|gcp] [-q] [--resource-count <value>]

FLAGS
  -f, --[no-]format
      Format the output terraform files. Requires `terraform` to be in your $PATH.

  -q, --quiet
      Suppress the logging output.

  --chaos-tags
      Generate random tag keys & values

  --name=<value>
      Name for the generated file, which must end in .tf

  --no-tags
      Disable any tag generation

  --provider=<option>
      Cloud provider to generate resources for
      <options: aws|azure|gcp>

  --resource-count=<value>
      [default: 3] Number of resources per file to generate

  --tags=<value>
      [default: Environment:Dev,Service:service] Custom tags to use for generated resources. Should be a comma-separated
      list of tag names to generate random values for, or tag names with values delimited by a colon.

      Examples:

      Specify just tag keys to have a random value generated.
      --tags Service,Team → {"Service":"(random value)","Team":"(random value)"}

      Specify value for a key with the : delimiter. This can be mixed with just keys that are randomly generated.
      --tags Service:web-app,Team → {"Service":"web-app","Team":"(random value)"}
      --tags Service:web-app,Team:core → {"Service":"web-app","Team":"core"}

      When specifying a key or value that has a space in it, the entire tag string needs to be quoted.
      --tags "Service:my awesome web app,Team Name:The Core Team" → {"Service":"my awesome web app","Team Name":"The Core
      Team"}

DESCRIPTION
  Generates a terraform file.
```

_See code: [src/commands/generate/file.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/generate/file.ts)_

## `terrafaker generate repo`

Generates repo(s) with multiple terraform files.

```
USAGE
  $ terrafaker generate repo [--chaos-tags | --tags <value> | --no-tags] [--count <value>] [--create-remote]
    [--directory <value>] [--file-count <value>] [-f] [--prefix <value>] [--provider aws|azure|gcp] [--public] [-q]
    [--resource-count <value>] [--vcs-provider azure|github|gitlab]

FLAGS
  -f, --[no-]format
      Format the output terraform files. Requires `terraform` to be in your $PATH.

  -q, --quiet
      Suppress the logging output.

  --chaos-tags
      Generate random tag keys & values

  --count=<value>
      [default: 1] Number of repos to generate

  --create-remote
      Create and push a remote repo. Requires the `gh`, `glab` or `az` CLIs to be installed.

  --directory=<value>
      [default: .] Directory to create the repo(s) in

  --file-count=<value>
      [default: 3] Number of files per repo to generate

  --no-tags
      Disable any tag generation

  --prefix=<value>
      [default: tf_] Prefix for repo names, useful for quickly identifying generated content

  --provider=<option>
      Cloud provider to generate resources for
      <options: aws|azure|gcp>

  --public
      Whether the remote repo(s) created are public.

  --resource-count=<value>
      [default: 3] Number of resources per file to generate

  --tags=<value>
      [default: Environment:Dev,Service:service] Custom tags to use for generated resources. Should be a comma-separated
      list of tag names to generate random values for, or tag names with values delimited by a colon.

      Examples:

      Specify just tag keys to have a random value generated.
      --tags Service,Team → {"Service":"(random value)","Team":"(random value)"}

      Specify value for a key with the : delimiter. This can be mixed with just keys that are randomly generated.
      --tags Service:web-app,Team → {"Service":"web-app","Team":"(random value)"}
      --tags Service:web-app,Team:core → {"Service":"web-app","Team":"core"}

      When specifying a key or value that has a space in it, the entire tag string needs to be quoted.
      --tags "Service:my awesome web app,Team Name:The Core Team" → {"Service":"my awesome web app","Team Name":"The Core
      Team"}

  --vcs-provider=<option>
      [default: github] Remote version control system to interact with
      <options: azure|github|gitlab>

DESCRIPTION
  Generates repo(s) with multiple terraform files.
```

_See code: [src/commands/generate/repo.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/generate/repo.ts)_

## `terrafaker gh repo clone`

Clones repos from your GitHub account, useful for pulling down generated repos for manual modifications.

```
USAGE
  $ terrafaker gh repo clone --prefix <value> [--directory <value>]

FLAGS
  --directory=<value>  [default: .] Directory to create the repo(s) in
  --prefix=<value>     (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Clones repos from your GitHub account, useful for pulling down generated repos for manual modifications.
```

_See code: [src/commands/gh/repo/clone.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/gh/repo/clone.ts)_

## `terrafaker gh repo delete`

Deletes repos from your GitHub account, useful for cleaning up generated test data.

```
USAGE
  $ terrafaker gh repo delete --prefix <value>

FLAGS
  --prefix=<value>  (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Deletes repos from your GitHub account, useful for cleaning up generated test data.

  If the deletion fails, you may need to refresh your CLI permissions with `gh auth refresh -s delete_repo`
```

_See code: [src/commands/gh/repo/delete.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/gh/repo/delete.ts)_

## `terrafaker gh repo list`

Lists repos from your GitHub account, useful for debugging.

```
USAGE
  $ terrafaker gh repo list

DESCRIPTION
  Lists repos from your GitHub account, useful for debugging.
```

_See code: [src/commands/gh/repo/list.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/gh/repo/list.ts)_

## `terrafaker glab repo clone`

Clones repos from your GitLab account, useful for pulling down generated repos for manual modifications.

```
USAGE
  $ terrafaker glab repo clone --prefix <value> [--directory <value>]

FLAGS
  --directory=<value>  [default: .] Directory to create the repo(s) in
  --prefix=<value>     (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Clones repos from your GitLab account, useful for pulling down generated repos for manual modifications.
```

_See code: [src/commands/glab/repo/clone.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/glab/repo/clone.ts)_

## `terrafaker glab repo delete`

Deletes repos from your GitLab account, useful for cleaning up generated test data.

```
USAGE
  $ terrafaker glab repo delete --prefix <value>

FLAGS
  --prefix=<value>  (required) Prefix for the repos, such as 'tf_'

DESCRIPTION
  Deletes repos from your GitLab account, useful for cleaning up generated test data.
```

_See code: [src/commands/glab/repo/delete.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/glab/repo/delete.ts)_

## `terrafaker glab repo list`

Lists repos from your GitLab account, useful for debugging.

```
USAGE
  $ terrafaker glab repo list

DESCRIPTION
  Lists repos from your GitLab account, useful for debugging.
```

_See code: [src/commands/glab/repo/list.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/glab/repo/list.ts)_

## `terrafaker health`

Utility command for checking overall CLI status.

```
USAGE
  $ terrafaker health

DESCRIPTION
  Utility command for checking overall CLI status.
```

_See code: [src/commands/health.ts](https://github.com/brandongregoryscott/terrafaker/blob/v0.0.9/src/commands/health.ts)_

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
