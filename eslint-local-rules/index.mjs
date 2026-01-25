import preferPrivateClassMembers from "./prefer-private-class-members.mjs";

/**
 * ESLint plugin exporting custom rules
 * @type {ESLintPlugin}
 */
const plugin = {
    rules: {
        "prefer-private-class-members": preferPrivateClassMembers,
    },
};

export default plugin;
