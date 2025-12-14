import { flatten } from "lodash-es";

// prettier-ignore
const AZURE_REGIONS = [];

/**
 * @see https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview?tabs=breakdownseries%2Cgeneralsizelist%2Ccomputesizelist%2Cmemorysizelist%2Cstoragesizelist%2Cgpusizelist%2Cfpgasizelist%2Chpcsizelist#general-purpose
 */
// prettier-ignore
const AZURE_INSTANCE_TYPES_BY_FAMILY = {
    "Fasv7": ["Standard_F1as_v7", "Standard_F2as_v7", "Standard_F4as_v7", "Standard_F8as_v7", "Standard_F16as_v7", "Standard_F32as_v7", "Standard_F48as_v7", "Standard_F64as_v7", "Standard_F80as_v7"],
    "Fadsv7": ["Standard_F1ads_v7", "Standard_F2ads_v7", "Standard_F4ads_v7", "Standard_F8ads_v7", "Standard_F16ads_v7", "Standard_F32ads_v7", "Standard_F48ads_v7", "Standard_F64ads_v7", "Standard_F80ads_v7"],
    "Famsv7": ["Standard_F1ams_v7", "Standard_F2ams_v7", "Standard_F4ams_v7", "Standard_F8ams_v7", "Standard_F16ams_v7", "Standard_F32ams_v7", "Standard_F48ams_v7", "Standard_F64ams_v7", "Standard_F80ams_v7"],
    "Famdsv7": ["Standard_F1amds_v7", "Standard_F2amds_v7", "Standard_F4amds_v7", "Standard_F8amds_v7", "Standard_F16amds_v7", "Standard_F32amds_v7", "Standard_F48amds_v7", "Standard_F64amds_v7", "Standard_F80amds_v7"],
    "Falsv7": ["Standard_F1als_v7", "Standard_F2als_v7", "Standard_F4als_v7", "Standard_F8als_v7", "Standard_F16als_v7", "Standard_F32als_v7", "Standard_F48als_v7", "Standard_F64als_v7", "Standard_F80als_v7"],
    "Faldsv7": ["Standard_F1alds_v7", "Standard_F2alds_v7", "Standard_F4alds_v7", "Standard_F8alds_v7", "Standard_F16alds_v7", "Standard_F32alds_v7", "Standard_F48alds_v7", "Standard_F64alds_v7", "Standard_F80alds_v7"],
    "Fasv6": ["Standard_F2as_v6", "Standard_F4as_v6", "Standard_F8as_v6", "Standard_F16as_v6", "Standard_F32as_v6", "Standard_F48as_v6", "Standard_F64as_v6"],
    "Falsv6": ["Standard_F2als_v6", "Standard_F4als_v6", "Standard_F8als_v6", "Standard_F16als_v6", "Standard_F32als_v6", "Standard_F48als_v6", "Standard_F64als_v6"],
    "Famsv6": ["Standard_F2ams_v6", "Standard_F4ams_v6", "Standard_F8ams_v6", "Standard_F16ams_v6", "Standard_F32ams_v6", "Standard_F48ams_v6", "Standard_F64ams_v6"],
    "Fsv2": ["Standard_F2s_v2", "Standard_F4s_v2", "Standard_F8s_v2", "Standard_F16s_v2", "Standard_F32s_v2", "Standard_F48s_v2", "Standard_F64s_v2", "Standard_F72s_v2"],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
    "": [],
};

const AZURE_INSTANCE_TYPES = flatten(
    Object.values(AZURE_INSTANCE_TYPES_BY_FAMILY)
);

// prettier-ignore
const AZURE_LAMBDA_RUNTIMES = [];

export {
    AZURE_INSTANCE_TYPES,
    AZURE_INSTANCE_TYPES_BY_FAMILY,
    AZURE_LAMBDA_RUNTIMES,
    AZURE_REGIONS,
};
