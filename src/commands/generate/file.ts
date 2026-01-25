import { Flags } from "@oclif/core";
import { FlagNames } from "../../enums/flag-names.js";
import { BaseCommand } from "../../utilities/base-command.js";
import {
    chaosTagsFlag,
    cloudProviderFlag,
    formatFlag,
    getTagsOption,
    iacTypeFlag,
    noTagsFlag,
    quietFlag,
    resourceCountFlag,
    tagsFlag,
    toCamelCaseFlags,
} from "../../utilities/flags.js";
import { FileGenerator } from "../../utilities/generators/file-generator.js";
import { StringUtils } from "../../utilities/string-utils.js";

class File extends BaseCommand {
    static description = "Generates an infrastructure-as-code file.";
    static flags = {
        [FlagNames.ChaosTags]: chaosTagsFlag,
        [FlagNames.CloudProvider]: cloudProviderFlag(),
        [FlagNames.Format]: formatFlag,
        [FlagNames.IacType]: iacTypeFlag(),
        [FlagNames.Name]: Flags.string({
            description: `Name for the generated file (extension added automatically based on ${FlagNames.IacType})`,
        }),
        [FlagNames.NoTags]: noTagsFlag,
        [FlagNames.Quiet]: quietFlag,
        [FlagNames.ResourceCount]: resourceCountFlag,
        [FlagNames.Tags]: tagsFlag(),
    };

    async run(): Promise<void> {
        const { flags } = await this.parse(File);
        const { cloudProvider, format, iacType, name, quiet, resourceCount } =
            toCamelCaseFlags(flags);
        const tags = getTagsOption(flags);

        const fileName = StringUtils.formatFileName({
            fileName: name,
            iacType,
        });

        FileGenerator.generate({
            cloudProvider,
            fileName,
            format,
            iacType,
            resourceCount,
            tags,
        });

        if (quiet) {
            return;
        }

        this.log(StringUtils.success(`Successfully generated '${fileName}'`));
    }
}

export { File };
