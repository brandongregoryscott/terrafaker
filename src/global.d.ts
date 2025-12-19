declare module "hcl2-parser" {
    function parseToString(input: string): string;
    function parseToObject(input: string): any;

    export { parseToObject, parseToString };
}
