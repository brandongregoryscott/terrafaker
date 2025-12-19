import { describe, expect, it } from "vitest";
import {
    findFirstResource,
    findFirstResourceByType,
    findFirstResourceByTypeOrThrow,
    findFirstResourceOrThrow,
} from "./test-utils.js";

describe("test-utils", () => {
    describe("findFirstResource", () => {
        describe("when no resources exist", () => {
            it("returns undefined", () => {
                const terraform = `
                    provider "azurerm" {
                        region = "newzealandnorth"
                    }`;

                const result = findFirstResource(terraform);

                expect(result).toBeUndefined();
            });
        });

        describe("when multiple resources of the same type exist", () => {
            it("returns first resource", () => {
                const expectedName = "noxious_azure_dog";
                const terraform = `
                    resource "azurerm_linux_virtual_machine" "${expectedName}" {
                        size = "Standard_D32plds_v6"
                    }

                    resource "azurerm_linux_virtual_machine" "spiteful_black_rabbit" {
                        size = "Standard_HB120-16rs_v3"
                    }`;

                const result = findFirstResource(terraform);

                expect(result?.name).toBe(expectedName);
            });
        });

        describe("when multiple resource types exist", () => {
            it("returns first resource for first type", () => {
                // We're expecting this resource instead of the VM because the resource types will be
                // returned alphabetically, and "azurerm_linux_function_app" will be ordered first.
                const expectedName = "terrible_mint_green_bear";
                const terraform = `
                    resource "azurerm_linux_virtual_machine" "noxious_azure_dog" {
                        size = "Standard_D32plds_v6"
                    }

                    resource "azurerm_linux_function_app" "${expectedName}" {
                        runtime_name          = "powershell"
                        runtime_version       = "7.4"
                    }`;

                const result = findFirstResource(terraform);

                expect(result?.name).toBe(expectedName);
            });
        });
    });

    describe("findFirstResourceOrThrow", () => {
        describe("when no resources exist", () => {
            it("throws", () => {
                const terraform = `
                    provider "azurerm" {
                        region = "newzealandnorth"
                    }`;

                try {
                    findFirstResourceOrThrow(terraform);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }

                expect.assertions(1);
            });
        });
    });

    describe("findFirstResourceByType", () => {
        it("returns first resource of type", () => {
            const expectedName = "noxious_azure_dog";
            const resourceType = "azurerm_linux_virtual_machine";
            const terraform = `
                resource "${resourceType}" "${expectedName}" {
                    size = "Standard_D32plds_v6"
                }

                resource "azurerm_linux_function_app" "terrible_mint_green_bear" {
                    runtime_name          = "powershell"
                    runtime_version       = "7.4"
                }`;

            const result = findFirstResourceByType(terraform, resourceType);

            expect(result?.name).toBe(expectedName);
        });

        describe("when no resources of type exist", () => {
            it("returns undefined", () => {
                const resourceType = "azurerm_linux_virtual_machine";
                const terraform = `
                    resource "azurerm_linux_function_app" "terrible_mint_green_bear" {
                        runtime_name          = "powershell"
                        runtime_version       = "7.4"
                    }`;

                const result = findFirstResourceByType(terraform, resourceType);

                expect(result).toBeUndefined();
            });
        });
    });

    describe("findFirstResourceByTypeOrThrow", () => {
        describe("when no resources of type exist", () => {
            it("throws", () => {
                const resourceType = "azurerm_linux_virtual_machine";
                const terraform = `
                    resource "azurerm_linux_function_app" "terrible_mint_green_bear" {
                        runtime_name          = "powershell"
                        runtime_version       = "7.4"
                    }`;

                try {
                    findFirstResourceByTypeOrThrow(terraform, resourceType);
                } catch (error) {
                    expect(error).toBeInstanceOf(Error);
                }

                expect.assertions(1);
            });
        });
    });
});
