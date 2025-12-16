/**
 * Returns a property's value if it can be found. It's expected that the provided Terraform
 * would only contain the property once, or the first instance found is the instance that is
 * being asserted against.
 */
const getTerraformPropertyValue = (
    terraform: string,
    property: string
): string | undefined => {
    const needle = `${property} = `;
    const lines = terraform.split("\n");
    const propertyLine = lines.find((line) => line.startsWith(needle));
    return propertyLine?.replace(needle, "").replace(/"/g, "");
};

export { getTerraformPropertyValue };
