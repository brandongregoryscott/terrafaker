import ora from "ora";
import type { HelpMessage } from "../enums/help-messages.js";
import type { VcsProviderName } from "../enums/vcs-providers.js";
import { HelpMessages } from "../enums/help-messages.js";
import { VcsProviderNames } from "../enums/vcs-providers.js";
import { BaseCommand } from "../utilities/base-command.js";
import { StringUtils } from "../utilities/string-utils.js";

interface CheckVcsCliOptions {
    check: () => Promise<boolean>;
    helpMessage: HelpMessage;
    provider: VcsProviderName;
    type: "authenticated" | "installed";
}

interface CheckWithSpinnerOptions {
    check: () => Promise<boolean>;
    failureMessage: string;
    loadingMessage: string;
    successMessage: string;
}

class Health extends BaseCommand {
    static description = "Utility command for checking overall CLI status.";

    async run(): Promise<void> {
        await this.parse(Health);
        await this.#checkGithubCli();
        await this.#checkGitlabCli();
        await this.#checkAzureCli();
    }

    async #checkAzureCli(): Promise<void> {
        const provider = VcsProviderNames.Azure;

        await this.#checkVcsCli({
            check: this.isAzureCliInstalled,
            helpMessage: HelpMessages.InstallAzureCli,
            provider,
            type: "installed",
        });

        await this.#checkWithSpinner({
            check: this.isAzureCliDevopsExtensionInstalled,
            failureMessage: `${provider} CLI is missing \`azure-devops\` extension.${StringUtils.formatInstructions(HelpMessages.InstallAzureCli)}`,
            loadingMessage: `Checking for ${provider} CLI \`azure-devops\` extension`,
            successMessage: `${provider} CLI has \`azure-devops\` extension installed`,
        });

        await this.#checkVcsCli({
            check: this.isAzureCliAuthenticated,
            helpMessage: HelpMessages.AuthenticateAzureCli,
            provider,
            type: "authenticated",
        });

        await this.#checkWithSpinner({
            check: this.isAzureCliDefaultOrganizationConfigured,
            failureMessage: `${provider} CLI is missing a default organization.\n${StringUtils.formatInstructions(HelpMessages.ConfigureAzureCliDefaultOrganization)}`,
            loadingMessage: `Checking for ${provider} CLI default organization`,
            successMessage: `${provider} CLI has a default organization configured`,
        });

        await this.#checkWithSpinner({
            check: this.isAzureCliDefaultProjectConfigured,
            failureMessage: `${provider} CLI is missing a default project.\n${StringUtils.formatInstructions(HelpMessages.ConfigureAzureCliDefaultProject, HelpMessages.CreateAzureProject)}`,
            loadingMessage: `Checking for ${provider} CLI default project`,
            successMessage: `${provider} CLI has a default project configured`,
        });
    }

    async #checkGithubCli(): Promise<void> {
        const provider = VcsProviderNames.Github;

        await this.#checkVcsCli({
            check: this.isGithubCliInstalled,
            helpMessage: HelpMessages.InstallGithubCli,
            provider,
            type: "installed",
        });

        await this.#checkVcsCli({
            check: this.isGithubCliAuthenticated,
            helpMessage: HelpMessages.AuthenticateGithubCli,
            provider,
            type: "authenticated",
        });
    }

    async #checkGitlabCli(): Promise<void> {
        const provider = VcsProviderNames.Gitlab;

        await this.#checkVcsCli({
            check: this.isGitlabCliInstalled,
            helpMessage: HelpMessages.InstallGitlabCli,
            provider,
            type: "installed",
        });

        await this.#checkVcsCli({
            check: this.isGitlabCliAuthenticated,
            helpMessage: HelpMessages.AuthenticateGitlabCli,
            provider,
            type: "authenticated",
        });
    }

    async #checkVcsCli(options: CheckVcsCliOptions) {
        const { check, helpMessage, provider, type } = options;

        return this.#checkWithSpinner({
            check,
            failureMessage: `${provider} CLI is not ${type}.\n${StringUtils.formatInstructions(helpMessage)}`,
            loadingMessage: `Checking ${provider} CLI ${type === "authenticated" ? "authentication" : "installation"}`,
            successMessage: `${provider} CLI is ${type}`,
        });
    }

    async #checkWithSpinner(options: CheckWithSpinnerOptions) {
        const { check, failureMessage, loadingMessage, successMessage } =
            options;
        const spinner = ora(loadingMessage).start();
        const result = await check();
        if (result) {
            spinner.succeed(successMessage);
            return;
        }

        spinner.fail(failureMessage);
    }
}

export { Health };
