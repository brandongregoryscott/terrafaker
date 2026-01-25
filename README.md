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
- Generate git repos with multiple files (and optionally push them to a remote VCS)
- Bulk clone and delete generated repos on a remote VCS by prefix

`terrafaker` can be used to randomly generate a file or repo of files like this:

```tf
provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_instance" "awful_tan_squirrel" {
  ami           = "ami-11060228d352"
  instance_type = "m8a.metal-48xl"
  tags = {
    Environment = "Dev"
    Service     = "service"
  }
}

resource "aws_lambda_function" "irresponsible_lavender_elephant" {
  ami           = "ami-3934ae468a90"
  runtime       = "python3.13"
  handler       = "exports.run"
  function_name = "run"
  memory_size   = 8960
  role          = "arn:aws:iam::0c23f323cc2f:mfa/gummy_lavender_fox"
  tags = {
    Environment = "Dev"
    Service     = "service"
  }
}
```

### Supported VCS providers

| VCS Provider | Supported | Dependency                                                                                                                                                            |
| ------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub       | ✅        | [`brew install gh`](https://cli.github.com/)                                                                                                                          |
| GitLab       | ✅        | [`brew install glab`](https://docs.gitlab.com/cli/)                                                                                                                   |
| Azure        | ✅        | [`brew install azure-cli`](https://learn.microsoft.com/en-us/cli/azure)[`&& az extension add --name azure-devops`](https://learn.microsoft.com/en-us/cli/azure/repos) |

### Supported cloud providers and IAC tooling

| Cloud Provider | Terraform | CloudFormation | CDK | Pulumi |
| -------------- | --------- | -------------- | --- | ------ |
| AWS            | ✅        | ✅             | ❌  | ❌     |
| GCP            | ✅        | ⛔️            | ⛔️ | ❌     |
| Azure          | ✅        | ⛔️            | ⛔️ | ❌     |

### Supported resources

| Resource Type     | AWS | GCP | Azure |
| ----------------- | --- | --- | ----- |
| Compute Instances | ✅  | ✅  | ✅    |
| Functions         | ✅  | ✅  | ✅    |
| Object Storage    | ❌  | ❌  | ❌    |
| Managed Databases | ❌  | ❌  | ❌    |

## Usage

See [`COMMANDS.MD`](./COMMANDS.md) for documentation on available commands.

<!-- usage -->

```sh-session
$ npm install -g terrafaker
$ terrafaker COMMAND
running command...
$ terrafaker (--version)
terrafaker/0.0.10 darwin-arm64 node-v24.8.0
$ terrafaker --help [COMMAND]
USAGE
  $ terrafaker COMMAND
...
```

<!-- usagestop -->

## Issues

If you find a bug, feel free to [open up an issue](https://github.com/brandongregoryscott/terrafaker/issues/new) and try to describe it in detail with reproduction steps if possible.

If you would like to see a feature, and it isn't [already documented](https://github.com/brandongregoryscott/terrafaker/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement), feel free to open up a new issue and describe the desired behavior.
