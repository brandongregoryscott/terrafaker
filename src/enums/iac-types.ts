import type { ObjectValues } from "../types/object-values.js";

const IacTypes = {
    CloudFormation: "cloudformation",
    Terraform: "terraform",
} as const;

type IacType = ObjectValues<typeof IacTypes>;

export type { IacType };
export { IacTypes };
