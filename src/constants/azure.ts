import { flatten } from "lodash-es";

// prettier-ignore
const AZURE_REGIONS = [];

/**
 * @see https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/overview?tabs=breakdownseries%2Cgeneralsizelist%2Ccomputesizelist%2Cmemorysizelist%2Cstoragesizelist%2Cgpusizelist%2Cfpgasizelist%2Chpcsizelist#general-purpose
 */
// prettier-ignore
const AZURE_INSTANCE_TYPES_BY_FAMILY = {
    "Av2": ["Standard_A1_v2", "Standard_A2_v2", "Standard_A4_v2", "Standard_A8_v2", "Standard_A2m_v2", "Standard_A4m_v2", "Standard_A8m_v2"],
    "Bsv2": ["Standard_B2ts_v2", "Standard_B2ls_v2", "Standard_B2s_v2", "Standard_B4ls_v2", "Standard_B4s_v2", "Standard_B8ls_v2", "Standard_B8s_v2", "Standard_B16ls_v2", "Standard_B16s_v2", "Standard_B32ls_v2", "Standard_B32s_v2"],
    "Basv2": ["Standard_B2ats_v2", "Standard_B2als_v2", "Standard_B2as_v2", "Standard_B4als_v2", "Standard_B4as_v2", "Standard_B8als_v2", "Standard_B8as_v2", "Standard_B16als_v2", "Standard_B16as_v2", "Standard_B32als_v2", "Standard_B32as_v2"],
    "Bpsv2": ["Standard_B2pts_v2", "Standard_B2pls_v2", "Standard_B2ps_v2", "Standard_B4pls_v2", "Standard_B4ps_v2", "Standard_B8pls_v2", "Standard_B8ps_v2", "Standard_B16pls_v2", "Standard_B16ps_v2"],
    "Dasv7": ["Standard_D2as_v7", "Standard_D4as_v7", "Standard_D8as_v7", "Standard_D16as_v7", "Standard_D32as_v7", "Standard_D48as_v7", "Standard_D64as_v7", "Standard_D96as_v7", "Standard_D128as_v7", "Standard_D160as_v7"],
    "Dadsv7": ["Standard_D2ads_v7", "Standard_D4ads_v7", "Standard_D8ads_v7", "Standard_D16ads_v7", "Standard_D32ads_v7", "Standard_D48ads_v7", "Standard_D64ads_v7", "Standard_D96ads_v7", "Standard_D128ads_v7", "Standard_D160ads_v7"],
    "Dalsv7": ["Standard_D2als_v7", "Standard_D4als_v7", "Standard_D8als_v7", "Standard_D16als_v7", "Standard_D32als_v7", "Standard_D48als_v7", "Standard_D64als_v7", "Standard_D96als_v7", "Standard_D128als_v7", "Standard_D160als_v7"],
    "Daldsv7": ["Standard_D2alds_v7", "Standard_D4alds_v7", "Standard_D8alds_v7", "Standard_D16alds_v7", "Standard_D32alds_v7", "Standard_D48alds_v7", "Standard_D64alds_v7", "Standard_D96alds_v7", "Standard_D128alds_v7", "Standard_D160alds_v7"],
    "Dsv6": ["Standard_D2s_v6", "Standard_D4s_v6", "Standard_D8s_v6", "Standard_D16s_v6", "Standard_D32s_v6", "Standard_D48s_v6", "Standard_D64s_v6", "Standard_D96s_v6", "Standard_D128s_v6", "Standard_D192s_v6"],
    "Ddsv6": ["Standard_D2ds_v6", "Standard_D4ds_v6", "Standard_D8ds_v6", "Standard_D16ds_v6", "Standard_D32ds_v6", "Standard_D48ds_v6", "Standard_D64ds_v6", "Standard_D96ds_v6", "Standard_D128ds_v6", "Standard_D192ds_v6"],
    "Dlsv6": ["Standard_D2ls_v6", "Standard_D4ls_v6", "Standard_D8ls_v6", "Standard_D16ls_v6", "Standard_D32ls_v6", "Standard_D48ls_v6", "Standard_D64ls_v6", "Standard_D96ls_v6", "Standard_D128ls_v6"],
    "Dldsv6": ["Standard_D2lds_v6", "Standard_D4lds_v6", "Standard_D8lds_v6", "Standard_D16lds_v6", "Standard_D32lds_v6", "Standard_D48lds_v6", "Standard_D64lds_v6", "Standard_D96lds_v6", "Standard_D128lds_v6"],
    "Dasv6": ["Standard_D2as_v6", "Standard_D4as_v6", "Standard_D8as_v6", "Standard_D16as_v6", "Standard_D32as_v6", "Standard_D48as_v6", "Standard_D64as_v6", "Standard_D96as_v6"],
    "Dadsv6": ["Standard_D2ads_v6", "Standard_D4ads_v6", "Standard_D8ads_v6", "Standard_D16ads_v6", "Standard_D32ads_v6", "Standard_D48ads_v6", "Standard_D64ads_v6", "Standard_D96ads_v6"],
    "Dalsv6": ["Standard_D2als_v6", "Standard_D4als_v6", "Standard_D8als_v6", "Standard_D16als_v6", "Standard_D32als_v6", "Standard_D48als_v6", "Standard_D64als_v6", "Standard_D96als_v6"],
    "Daldsv6": ["Standard_D2alds_v6", "Standard_D4alds_v6", "Standard_D8alds_v6", "Standard_D16alds_v6", "Standard_D32alds_v6", "Standard_D48alds_v6", "Standard_D64alds_v6", "Standard_D96alds_v6"],
    "Dpsv6": ["Standard_D2ps_v6", "Standard_D4ps_v6", "Standard_D8ps_v6", "Standard_D16ps_v6", "Standard_D32ps_v6", "Standard_D48ps_v6", "Standard_D64ps_v6", "Standard_D96ps_v6"],
    "Dpdsv6": ["Standard_D2pds_v6", "Standard_D4pds_v6", "Standard_D8pds_v6", "Standard_D16pds_v6", "Standard_D32pds_v6", "Standard_D48pds_v6", "Standard_D64pds_v6", "Standard_D96pds_v6"],
    "Dplsv6": ["Standard_D2pls_v6", "Standard_D4pls_v6", "Standard_D8pls_v6", "Standard_D16pls_v6", "Standard_D32pls_v6", "Standard_D48pls_v6", "Standard_D64pls_v6", "Standard_D96pls_v6"],
    "Dpldsv6": ["Standard_D2plds_v6", "Standard_D4plds_v6", "Standard_D8plds_v6", "Standard_D16plds_v6", "Standard_D32plds_v6", "Standard_D48plds_v6", "Standard_D64plds_v6", "Standard_D96plds_v6"],
    "Dv5": ["Standard_D2_v5", "Standard_D4_v5", "Standard_D8_v5", "Standard_D16_v5", "Standard_D32_v5", "Standard_D48_v5", "Standard_D64_v5", "Standard_D96_v5"],
    "Dsv5": ["Standard_D2s_v5", "Standard_D4s_v5", "Standard_D8s_v5", "Standard_D16s_v5", "Standard_D32s_v5", "Standard_D48s_v5", "Standard_D64s_v5", "Standard_D96s_v5"],
    "Ddv5": ["Standard_D2d_v5", "Standard_D4d_v5", "Standard_D8d_v5", "Standard_D16d_v5", "Standard_D32d_v5", "Standard_D48d_v5", "Standard_D64d_v5", "Standard_D96d_v5"],
    "Ddsv5": ["Standard_D2ds_v5", "Standard_D4ds_v5", "Standard_D8ds_v5", "Standard_D16ds_v5", "Standard_D32ds_v5", "Standard_D48ds_v5", "Standard_D64ds_v5", "Standard_D96ds_v5"],
    "Dasv5": ["Standard_D2as_v5", "Standard_D4as_v5", "Standard_D8as_v5", "Standard_D16as_v5", "Standard_D32as_v5", "Standard_D48as_v5", "Standard_D64as_v5", "Standard_D96as_v5"],
    "Dadsv5": ["Standard_D2ads_v5", "Standard_D4ads_v5", "Standard_D8ads_v5", "Standard_D16ads_v5", "Standard_D32ads_v5", "Standard_D48ads_v5", "Standard_D64ads_v5", "Standard_D96ads_v5"],
    "Dpsv5": ["Standard_D2ps_v5", "Standard_D4ps_v5", "Standard_D8ps_v5", "Standard_D16ps_v5", "Standard_D32ps_v5", "Standard_D48ps_v5", "Standard_D64ps_v5"],
    "Dpdsv5": ["Standard_D2pds_v5", "Standard_D4pds_v5", "Standard_D8pds_v5", "Standard_D16pds_v5", "Standard_D32pds_v5", "Standard_D48pds_v5", "Standard_D64pds_v5"],
    "Dplsv5": ["Standard_D2pls_v5", "Standard_D4pls_v5", "Standard_D8pls_v5", "Standard_D16pls_v5", "Standard_D32pls_v5", "Standard_D48pls_v5", "Standard_D64pls_v5"],
    "Dpldsv5": ["Standard_D2plds_v5", "Standard_D4plds_v5", "Standard_D8plds_v5", "Standard_D16plds_v5", "Standard_D32plds_v5", "Standard_D48plds_v5", "Standard_D64plds_v5"],
    "Dlsv5": ["Standard_D2ls_v5", "Standard_D4ls_v5", "Standard_D8ls_v5", "Standard_D16ls_v5", "Standard_D32ls_v5", "Standard_D48ls_v5", "Standard_D64ls_v5", "Standard_D96ls_v5"],
    "Dldsv5": ["Standard_D2lds_v5", "Standard_D4lds_v5", "Standard_D8lds_v5", "Standard_D16lds_v5", "Standard_D32lds_v5", "Standard_D48lds_v5", "Standard_D64lds_v5", "Standard_D96lds_v5"],
    "Dnsv6": ["Standard_D2ns_v6", "Standard_D4ns_v6", "Standard_D8ns_v6", "Standard_D16ns_v6", "Standard_D32ns_v6", "Standard_D48ns_v6", "Standard_D64ns_v6", "Standard_D96ns_v6", "Standard_D128ns_v6"],
    "Dndsv6": ["Standard_D2nds_v6", "Standard_D4nds_v6", "Standard_D8nds_v6", "Standard_D16nds_v6", "Standard_D32nds_v6", "Standard_D48nds_v6", "Standard_D64nds_v6", "Standard_D96nds_v6", "Standard_D128nds_v6"],
    "Dnlsv6": ["Standard_D2nls_v6", "Standard_D4nls_v6", "Standard_D8nls_v6", "Standard_D16nls_v6", "Standard_D32nls_v6", "Standard_D48nls_v6", "Standard_D64nls_v6", "Standard_D96nls_v6", "Standard_D128nls_v6"],
    "Dnldsv6": ["Standard_D2nlds_v6", "Standard_D4nlds_v6", "Standard_D8nlds_v6", "Standard_D16nlds_v6", "Standard_D32nlds_v6", "Standard_D48nlds_v6", "Standard_D64nlds_v6", "Standard_D96nlds_v6", "Standard_D128nlds_v6"],
    "Dv4": ["Standard_D2_v4", "Standard_D4_v4", "Standard_D8_v4", "Standard_D16_v4", "Standard_D32_v4", "Standard_D48_v4", "Standard_D64_v4"],
    "Dsv4": ["Standard_D2s_v4", "Standard_D4s_v4", "Standard_D8s_v4", "Standard_D16s_v4", "Standard_D32s_v4", "Standard_D48s_v4", "Standard_D64s_v4"],
    "Dav4": ["Standard_D2a_v41", "Standard_D4a_v4", "Standard_D8a_v4", "Standard_D16a_v4", "Standard_D32a_v4", "Standard_D48a_v4", "Standard_D64a_v4", "Standard_D96a_v4"],
    "Dasv4": ["Standard_D2as_v4", "Standard_D4as_v4", "Standard_D8as_v4", "Standard_D16as_v4", "Standard_D32as_v4", "Standard_D48as_v4", "Standard_D64as_v4", "Standard_D96as_v4"],
    "Ddv4": ["Standard_D2d_v4", "Standard_D4d_v4", "Standard_D8d_v4", "Standard_D16d_v4", "Standard_D32d_v4", "Standard_D48d_v4", "Standard_D64d_v4"],
    "Ddsv4": ["Standard_D2ds_v4", "Standard_D4ds_v4", "Standard_D8ds_v4", "Standard_D16ds_v4", "Standard_D32ds_v4", "Standard_D48ds_v4", "Standard_D64ds_v4"],
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
