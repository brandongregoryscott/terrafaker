const HelpMessages = {
    RequiresGhCli: `Requires the \`gh\` CLI to be installed. To install, run \`brew install gh\`.`,
    RequiresGlabCli: `Requires the \`glab\` CLI to be installed. To install, run \`brew install glab\`.`,
    RequiresVcsCLI: `Requires the \`gh\` or \`glab\` CLI to be installed. To install, run \`brew install gh|glab\`.`,
} as const;

export { HelpMessages };
