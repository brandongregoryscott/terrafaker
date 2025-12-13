/**
 * @see https://docs.cloud.google.com/compute/docs/regions-zones
 */
// prettier-ignore
const GCP_REGIONS = ["africa-south1-a", "africa-south1-b", "africa-south1-c", "asia-east1-a", "asia-east1-b", "asia-east1-c", "asia-east2-a", "asia-east2-b", "asia-east2-c", "asia-northeast1-a", "asia-northeast1-b", "asia-northeast1-c", "asia-northeast2-a", "asia-northeast2-b", "asia-northeast2-c", "asia-northeast3-a", "asia-northeast3-b", "asia-northeast3-c", "asia-south1-a", "asia-south1-b", "asia-south1-c", "asia-south2-a", "asia-south2-b", "asia-south2-c", "asia-southeast1-a", "asia-southeast1-b", "asia-southeast1-c", "asia-southeast2-a", "asia-southeast2-b", "asia-southeast2-c", "australia-southeast1-a", "australia-southeast1-b", "australia-southeast1-c", "australia-southeast2-a", "australia-southeast2-b", "australia-southeast2-c", "europe-central2-a", "europe-central2-b", "europe-central2-c", "europe-north1-a", "europe-north1-b", "europe-north1-c", "europe-north2-a", "europe-north2-b", "europe-north2-c", "europe-southwest1-a", "europe-southwest1-b", "europe-southwest1-c", "europe-west1-b", "europe-west1-c", "europe-west1-d", "europe-west2-a", "europe-west2-b", "europe-west2-c", "europe-west3-a", "europe-west3-b", "europe-west3-c", "europe-west4-a", "europe-west4-b", "europe-west4-c", "europe-west6-a", "europe-west6-b", "europe-west6-c", "europe-west8-a", "europe-west8-b", "europe-west8-c", "europe-west9-a", "europe-west9-b", "europe-west9-c", "europe-west10-a", "europe-west10-b", "europe-west10-c", "europe-west12-a", "europe-west12-b", "europe-west12-c", "me-central1-a", "me-central1-b", "me-central1-c", "me-central2-a", "me-central2-b", "me-central2-c", "me-west1-a", "me-west1-b", "me-west1-c", "northamerica-northeast1-a", "northamerica-northeast1-b", "northamerica-northeast1-c", "northamerica-northeast2-a", "northamerica-northeast2-b", "northamerica-northeast2-c", "northamerica-south1-a", "northamerica-south1-b", "northamerica-south1-c", "southamerica-east1-a", "southamerica-east1-b", "southamerica-east1-c", "southamerica-west1-a", "southamerica-west1-b", "southamerica-west1-c", "us-central1-a", "us-central1-b", "us-central1-c", "us-central1-f", "us-east1-b", "us-east1-c", "us-east1-d", "us-east4-a", "us-east4-b", "us-east4-c", "us-east5-a", "us-east5-b", "us-east5-c", "us-south1-a", "us-south1-b", "us-south1-c", "us-west1-a", "us-west1-b", "us-west1-c", "us-west2-a", "us-west2-b", "us-west2-c", "us-west3-a", "us-west3-b", "us-west3-c", "us-west4-a", "us-west4-b", "us-west4-c"];

/**
 * @see https://docs.cloud.google.com/compute/docs/general-purpose-machines
 */
// prettier-ignore
const GCP_INSTANCE_TYPES_BY_FAMILY = {
    "C4D standard": ["c4d-standard-2", "c4d-standard-4", "c4d-standard-8", "c4d-standard-16", "c4d-standard-32", "c4d-standard-48", "c4d-standard-64", "c4d-standard-96", "c4d-standard-192", "c4d-standard-384", "c4d-standard-384-metal2"],
    "C4D highcpu": ["c4d-highcpu-2", "c4d-highcpu-4", "c4d-highcpu-8", "c4d-highcpu-16", "c4d-highcpu-32", "c4d-highcpu-48", "c4d-highcpu-64", "c4d-highcpu-96", "c4d-highcpu-192", "c4d-highcpu-384", "c4d-highcpu-384-metal2"],
    "C4D highmem": ["c4d-highmem-2", "c4d-highmem-4", "c4d-highmem-8", "c4d-highmem-16", "c4d-highmem-32", "c4d-highmem-48", "c4d-highmem-64", "c4d-highmem-96", "c4d-highmem-192", "c4d-highmem-384", "c4d-highmem-384-metal2"],
    "C4D standard SSD": ["c4d-standard-8-lssd", "c4d-standard-16-lssd", "c4d-standard-32-lssd", "c4d-standard-48-lssd", "c4d-standard-64-lssd", "c4d-standard-96-lssd", "c4d-standard-192-lssd", "c4d-standard-384-lssd"],
    "C4D highmem SSD": ["c4d-highmem-8-lssd", "c4d-highmem-16-lssd", "c4d-highmem-32-lssd", "c4d-highmem-48-lssd", "c4d-highmem-64-lssd", "c4d-highmem-96-lssd", "c4d-highmem-192-lssd", "c4d-highmem-384-lssd"],
    "C4A standard": ["c4a-standard-1", "c4a-standard-2", "c4a-standard-4", "c4a-standard-8", "c4a-standard-16", "c4a-standard-32", "c4a-standard-48", "c4a-standard-64", "c4a-standard-72"],
    "C4A highcpu": ["c4a-highcpu-1", "c4a-highcpu-2", "c4a-highcpu-4", "c4a-highcpu-8", "c4a-highcpu-16", "c4a-highcpu-32", "c4a-highcpu-48", "c4a-highcpu-64", "c4a-highcpu-72"],
    "C4A highmem": ["c4a-highmem-1", "c4a-highmem-2", "c4a-highmem-4", "c4a-highmem-8", "c4a-highmem-16", "c4a-highmem-32", "c4a-highmem-48", "c4a-highmem-64", "c4a-highmem-72"],
    "C4A standard SSD": ["c4a-standard-4-lssd", "c4a-standard-8-lssd", "c4a-standard-16-lssd", "c4a-standard-32-lssd", "c4a-standard-48-lssd", "c4a-standard-64-lssd", "c4a-standard-72-lssd"],
    "C4A highmem SSD": ["c4a-highmem-4-lssd", "c4a-highmem-8-lssd", "c4a-highmem-16-lssd", "c4a-highmem-32-lssd", "c4a-highmem-48-lssd", "c4a-highmem-64-lssd", "c4a-highmem-72-lssd"],
    "C4 standard": ["c4-standard-2", "c4-standard-4", "c4-standard-8", "c4-standard-16", "c4-standard-24", "c4-standard-32", "c4-standard-48", "c4-standard-96", "c4-standard-144", "c4-standard-192", "c4-standard-288", "c4-standard-288-metal"],
    "C4 highcpu": ["c4-highcpu-2", "c4-highcpu-4", "c4-highcpu-8", "c4-highcpu-16", "c4-highcpu-24", "c4-highcpu-32", "c4-highcpu-48", "c4-highcpu-96", "c4-highcpu-144", "c4-highcpu-192", "c4-highcpu-288"],
    "C4 highmem": ["c4-highmem-2", "c4-highmem-4", "c4-highmem-8", "c4-highmem-16", "c4-highmem-24", "c4-highmem-32", "c4-highmem-48", "c4-highmem-96", "c4-highmem-144", "c4-highmem-192", "c4-highmem-288", "c4-highmem-288-metal"],
    "C4 standard SSD": ["c4-standard-4-lssd", "c4-standard-8-lssd", "c4-standard-16-lssd", "c4-standard-24-lssd", "c4-standard-32-lssd", "c4-standard-48-lssd", "c4-standard-96-lssd", "c4-standard-144-lssd", "c4-standard-192-lssd", "c4-standard-288-lssd", "c4-standard-288-lssd-metal"],
    "C4 highmem SSD": ["c4-highmem-4-lssd", "c4-highmem-8-lssd", "c4-highmem-16-lssd", "c4-highmem-24-lssd", "c4-highmem-32-lssd", "c4-highmem-48-lssd", "c4-highmem-96-lssd", "c4-highmem-144-lssd", "c4-highmem-192-lssd", "c4-highmem-288-lssd", "c4-highmem-288-lssd-metal"],
    "N4D standard": ["n4d-standard-2", "n4d-standard-4", "n4d-standard-8", "n4d-standard-16", "n4d-standard-32", "n4d-standard-48", "n4d-standard-64", "n4d-standard-80", "n4d-standard-96"],
    "N4D highcpu": ["n4d-highcpu-2", "n4d-highcpu-4", "n4d-highcpu-8", "n4d-highcpu-16", "n4d-highcpu-32", "n4d-highcpu-48", "n4d-highcpu-64", "n4d-highcpu-80", "n4d-highcpu-96"],
    "N4D highmem": ["n4d-highmem-2", "n4d-highmem-4", "n4d-highmem-8", "n4d-highmem-16", "n4d-highmem-32", "n4d-highmem-48", "n4d-highmem-64", "n4d-highmem-80", "n4d-highmem-96"],
    "N4A standard": ["n4a-standard-1", "n4a-standard-2", "n4a-standard-4", "n4a-standard-8", "n4a-standard-16", "n4a-standard-32", "n4a-standard-48", "n4a-standard-64"],
    "N4A highcpu": ["n4a-highcpu-1", "n4a-highcpu-2", "n4a-highcpu-4", "n4a-highcpu-8", "n4a-highcpu-16", "n4a-highcpu-32", "n4a-highcpu-48", "n4a-highcpu-64"],
    "N4A highmem": ["n4a-highmem-1", "n4a-highmem-2", "n4a-highmem-4", "n4a-highmem-8", "n4a-highmem-16", "n4a-highmem-32", "n4a-highmem-48", "n4a-highmem-64"],
    "N4 standard": ["n4-standard-2", "n4-standard-4", "n4-standard-8", "n4-standard-16", "n4-standard-32", "n4-standard-48", "n4-standard-64", "n4-standard-80"],
    "N4 highcpu": ["n4-highcpu-2", "n4-highcpu-4", "n4-highcpu-8", "n4-highcpu-16", "n4-highcpu-32", "n4-highcpu-48", "n4-highcpu-64", "n4-highcpu-80"],
    "N4 highmem": ["n4-highmem-2", "n4-highmem-4", "n4-highmem-8", "n4-highmem-16", "n4-highmem-32", "n4-highmem-48", "n4-highmem-64", "n4-highmem-80"],
    "C3D standard": ["c3d-standard-4", "c3d-standard-8", "c3d-standard-16", "c3d-standard-30", "c3d-standard-60", "c3d-standard-90", "c3d-standard-180", "c3d-standard-360"],
    "C3D highcpu": ["c3d-highcpu-4", "c3d-highcpu-8", "c3d-highcpu-16", "c3d-highcpu-30", "c3d-highcpu-60", "c3d-highcpu-90", "c3d-highcpu-180", "c3d-highcpu-360"],
    "C3D highmem": ["c3d-highmem-4", "c3d-highmem-8", "c3d-highmem-16", "c3d-highmem-30", "c3d-highmem-60", "c3d-highmem-90", "c3d-highmem-180", "c3d-highmem-360"],
    "C3D standard SSD": ["c3d-standard-8-lssd", "c3d-standard-16-lssd", "c3d-standard-30-lssd", "c3d-standard-60-lssd", "c3d-standard-90-lssd", "c3d-standard-180-lssd", "c3d-standard-360-lssd"],
    "C3D highmem SSD": ["c3d-highmem-8-lssd", "c3d-highmem-16-lssd", "c3d-highmem-30-lssd", "c3d-highmem-60-lssd", "c3d-highmem-90-lssd", "c3d-highmem-180-lssd", "c3d-highmem-360-lssd"],
    "C3 standard": ["c3-standard-4", "c3-standard-8", "c3-standard-22", "c3-standard-44", "c3-standard-88", "c3-standard-176", "c3-standard-192-metal"],
    "C3 highcpu": ["c3-highcpu-4", "c3-highcpu-8", "c3-highcpu-22", "c3-highcpu-44", "c3-highcpu-88", "c3-highcpu-176", "c3-highcpu-192-metal"],
    "C3 highmem": ["c3-highmem-4", "c3-highmem-8", "c3-highmem-22", "c3-highmem-44", "c3-highmem-88", "c3-highmem-176", "c3-highmem-192-metal"],
    "C3 standard SSD": ["c3-standard-4-lssd", "c3-standard-8-lssd", "c3-standard-22-lssd", "c3-standard-44-lssd", "c3-standard-88-lssd", "c3-standard-176-lssd"],
    "N2D standard": ["n2d-standard-2", "n2d-standard-4", "n2d-standard-8", "n2d-standard-16", "n2d-standard-32", "n2d-standard-48", "n2d-standard-64", "n2d-standard-80", "n2d-standard-96", "n2d-standard-128", "n2d-standard-224"],
    "N2D highcpu": ["n2d-highcpu-2", "n2d-highcpu-4", "n2d-highcpu-8", "n2d-highcpu-16", "n2d-highcpu-32", "n2d-highcpu-48", "n2d-highcpu-64", "n2d-highcpu-80", "n2d-highcpu-96", "n2d-highcpu-128", "n2d-highcpu-224"],
    "N2D highmem": ["n2d-highmem-2", "n2d-highmem-4", "n2d-highmem-8", "n2d-highmem-16", "n2d-highmem-32", "n2d-highmem-48", "n2d-highmem-64", "n2d-highmem-80", "n2d-highmem-96"],
    "N2 standard": ["n2-standard-2", "n2-standard-4", "n2-standard-8", "n2-standard-16", "n2-standard-32", "n2-standard-48", "n2-standard-64", "n2-standard-80", "n2-standard-96", "n2-standard-128"],
    "N2 highcpu": ["n2-highcpu-2", "n2-highcpu-4", "n2-highcpu-8", "n2-highcpu-16", "n2-highcpu-32", "n2-highcpu-48", "n2-highcpu-64", "n2-highcpu-80", "n2-highcpu-96"],
    "N2 highmem": ["n2-highmem-2", "n2-highmem-4", "n2-highmem-8", "n2-highmem-16", "n2-highmem-32", "n2-highmem-48", "n2-highmem-64", "n2-highmem-80", "n2-highmem-96", "n2-highmem-128"],
    "E2 standard": ["e2-standard-2", "e2-standard-4", "e2-standard-8", "e2-standard-16", "e2-standard-32"],
    "E2 highcpu": ["e2-highcpu-2", "e2-highcpu-4", "e2-highcpu-8", "e2-highcpu-16", "e2-highcpu-32"],
    "E2 highmem": ["e2-highmem-2", "e2-highmem-4", "e2-highmem-8", "e2-highmem-16"],
    "E2 sharedcore": ["e2-micro", "e2-small", "e2-medium"],
    "N1 standard": ["n1-standard-1", "n1-standard-2", "n1-standard-4", "n1-standard-8", "n1-standard-16", "n1-standard-32", "n1-standard-64", "n1-standard-96"],
};
