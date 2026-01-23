import type { ObjectValues } from "../types/object-values.js";

const HelpMessages = {
    AuthenticateAzureCli: `Run \`az login --allow-no-subscriptions\` and try again.`,
    AuthenticateGithubCli: `Run \`gh auth login\` and try again.`,
    AuthenticateGitlabCli: `Run \`glab auth login\` and try again.`,
    ConfigureAzureCliDefaultOrganization:
        "To configure a default organization, run \`az devops configure --defaults organization=https://dev.azure.com/brandongregoryscott\`.",
    ConfigureAzureCliDefaultProject:
        "To configure a default project, run \`az devops configure --defaults project=terrafaker\`.",
    CreateAzureProject:
        "To create a project, run \`az devops project create --name=terrafaker\`.",
    InstallAzureCli: `To install, run \`brew install azure-cli && az extension add --name azure-devops\`.`,
    InstallGithubCli: `To install, run \`brew install gh\`.`,
    InstallGitlabCli: `To install, run \`brew install glab\`.`,
    RequiresAzureCli: `Requires the \`az\` CLI to be installed.`,
    RequiresGhCli: "Requires the \`gh\` CLI to be installed.",
    RequiresGitlabCli: `Requires the \`glab\` CLI to be installed.`,
    RequiresVcsCLI: `Requires the \`gh\`, \`glab\` or \`az\` CLIs to be installed.`,
} as const;

type HelpMessage = ObjectValues<typeof HelpMessages>;

export type { HelpMessage };
export { HelpMessages };
