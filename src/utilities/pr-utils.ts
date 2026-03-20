import { promises as fs } from "node:fs";
import path from "node:path";
import { $ } from "zx";
import type { Repo } from "../types/repo.js";
import { IacTypes, type IacType } from "../enums/iac-types.js";
import { Random } from "./random.js";
import { StringUtils } from "./string-utils.js";

const SKIP_DIRS = new Set([".git", ".terraform", "dist", "node_modules"]);

interface SelectIacFileOptions {
    filePath?: string;
    iacType?: IacType;
    repoDirectory: string;
}

interface SelectedIacFile {
    directory: string;
    fileName: string;
    filePath: string;
    iacType: IacType;
}

async function ensureRepoClone(
    repo: Repo,
    baseDirectory: string
): Promise<string> {
    const repoDirectory = path.resolve(baseDirectory, repo.name);
    const gitDirectory = path.join(repoDirectory, ".git");

    const hasRepo = await exists(repoDirectory);
    const hasGit = await exists(gitDirectory);

    if (hasRepo && hasGit) {
        return repoDirectory;
    }

    if (hasRepo && !hasGit) {
        throw new Error(
            `Directory '${repoDirectory}' exists but is not a git repository.`
        );
    }

    await $`gh repo clone ${repo.fullName} ${repoDirectory}`;
    return repoDirectory;
}

function buildBranchName(prefix: string, index = 0): string {
    const timestamp = Date.now();
    const suffix = index > 0 ? `-${index + 1}` : "";
    return `${prefix}${timestamp}${suffix}`;
}

async function selectIacFile(
    options: SelectIacFileOptions
): Promise<SelectedIacFile> {
    const { filePath, iacType, repoDirectory } = options;

    if (filePath) {
        const absolutePath = path.isAbsolute(filePath)
            ? filePath
            : path.join(repoDirectory, filePath);
        const resolvedType =
            iacType ?? getIacTypeFromExtension(path.extname(absolutePath));
        const directory = path.dirname(absolutePath);
        const iac = resolvedType ?? IacTypes.Terraform;
        return finalizeSelection({
            directory,
            fileName: path.basename(absolutePath),
            iacType: iac,
        });
    }

    if (iacType === IacTypes.Terraform) {
        const tfFile = await findFirstFileByExtensions(repoDirectory, [".tf"]);
        if (tfFile) {
            return finalizeSelection({
                directory: path.dirname(tfFile),
                fileName: path.basename(tfFile),
                iacType: IacTypes.Terraform,
            });
        }
    }

    if (iacType === IacTypes.CloudFormation) {
        const cfnFile = await findFirstFileByExtensions(repoDirectory, [
            ".yaml",
            ".yml",
            ".json",
        ]);
        if (cfnFile) {
            return finalizeSelection({
                directory: path.dirname(cfnFile),
                fileName: path.basename(cfnFile),
                iacType: IacTypes.CloudFormation,
            });
        }
    }

    const terraformFile = await findFirstFileByExtensions(repoDirectory, [
        ".tf",
    ]);
    if (terraformFile) {
        return finalizeSelection({
            directory: path.dirname(terraformFile),
            fileName: path.basename(terraformFile),
            iacType: IacTypes.Terraform,
        });
    }

    const cloudformationFile = await findFirstFileByExtensions(repoDirectory, [
        ".yaml",
        ".yml",
        ".json",
    ]);
    if (cloudformationFile) {
        return finalizeSelection({
            directory: path.dirname(cloudformationFile),
            fileName: path.basename(cloudformationFile),
            iacType: IacTypes.CloudFormation,
        });
    }

    const fallbackType = iacType ?? IacTypes.Terraform;
    const fileName = Random.snakeSlug();
    return finalizeSelection({
        directory: repoDirectory,
        fileName,
        iacType: fallbackType,
    });
}

async function findFirstFileByExtensions(
    directory: string,
    extensions: string[]
): Promise<string | undefined> {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) {
                continue;
            }
            const nested = await findFirstFileByExtensions(
                fullPath,
                extensions
            );
            if (nested) {
                return nested;
            }
            continue;
        }

        if (extensions.includes(path.extname(entry.name))) {
            return fullPath;
        }
    }

    return undefined;
}

async function exists(target: string): Promise<boolean> {
    try {
        await fs.stat(target);
        return true;
    } catch {
        return false;
    }
}

function getIacTypeFromExtension(extension: string): IacType | undefined {
    switch (extension) {
        case ".tf":
            return IacTypes.Terraform;
        case ".json":
        case ".yaml":
        case ".yml":
            return IacTypes.CloudFormation;
        default:
            return undefined;
    }
}

function finalizeSelection(options: {
    directory: string;
    fileName: string;
    iacType: IacType;
}): SelectedIacFile {
    const formattedFileName = StringUtils.formatFileName({
        fileName: options.fileName,
        iacType: options.iacType,
    });
    const filePath = path.join(options.directory, formattedFileName);
    return {
        directory: options.directory,
        fileName: formattedFileName,
        filePath,
        iacType: options.iacType,
    };
}

export type { SelectedIacFile };
export { buildBranchName, ensureRepoClone, selectIacFile };
