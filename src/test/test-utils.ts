import { first, isEmpty } from "lodash-es";
import { parseToObject } from "hcl2-parser";

// Rough shape of the parsed object returned from `hcl2-parser`, may need to be adjusted for
// more complex Terraform configurations.
interface ParsedTerraform {
    provider?: {
        [provider: string]: Array<Record<string, unknown>>;
    };
    resource?: {
        [resourceType: string]: {
            [name: string]: Array<Record<string, unknown>>;
        };
    };
}

const parseTerraformToObject = (terraform: string): ParsedTerraform => {
    const parsed = parseToObject(terraform);
    return parsed[0];
};

interface Resource {
    name: string;
    value: Record<string, unknown>;
}

const findFirstResource = (terraform: string): Resource | undefined => {
    const parsed = parseTerraformToObject(terraform);
    if (parsed.resource === undefined) {
        return undefined;
    }

    const firstResource = first(Object.values(parsed.resource));
    if (firstResource === undefined) {
        return undefined;
    }

    const name = first(Object.keys(firstResource));
    if (name === undefined) {
        return undefined;
    }

    return { name, value: first(firstResource[name]) ?? {} };
};

const findFirstResourceOrThrow = (terraform: string): Resource => {
    const resource = findFirstResource(terraform);
    if (resource === undefined) {
        throw new Error("Unable to find resource in provided Terraform");
    }

    return resource;
};

const findFirstResourceByType = (
    terraform: string,
    resourceType: string
): Resource | undefined => {
    const parsed = parseTerraformToObject(terraform);
    const resourcesByType = parsed.resource?.[resourceType];
    if (isEmpty(resourcesByType)) {
        return undefined;
    }

    const name = first(Object.keys(resourcesByType));
    if (name === undefined) {
        return undefined;
    }

    return { name, value: first(resourcesByType[name]) ?? {} };
};

const findFirstResourceByTypeOrThrow = (
    terraform: string,
    resourceType: string
): Resource => {
    const resource = findFirstResourceByType(terraform, resourceType);
    if (resource === undefined) {
        throw new Error(
            `Unable to find '${resourceType}' resource in provided Terraform`
        );
    }

    return resource;
};

export {
    findFirstResource,
    findFirstResourceByType,
    findFirstResourceByTypeOrThrow,
    findFirstResourceOrThrow,
};
