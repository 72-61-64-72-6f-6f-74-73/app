import { lc } from "$lib/client";
import { location_geohash } from "@radroots/utils";

export const location_gcs_add = async (): Promise<boolean> => {
    try {
        const loc_gcs = await lc.geo.current();
        if (
            loc_gcs &&
            typeof loc_gcs !== `string`
        ) {
            const loc_gcs_label =
                await lc.dialog.prompt({
                    title: `Geolocation Label`,
                    message: `What is the name of the location.`,
                    input_placeholder: `Enter location name`,
                });
            if (loc_gcs_label === false) return false;

            const { lat, lng } = loc_gcs;
            const geohash = location_geohash(
                lat,
                lng,
            );
            const fields = {
                lat: lat.toString(),
                lng: lng.toString(),
                geohash,
                label: loc_gcs_label,
            };
            const exe_res =
                await lc.db.location_gcs_add(
                    fields,
                );
            if (
                typeof exe_res !== `string` &&
                `id` in exe_res
            ) {
                return true;
            } else if (
                typeof exe_res === `string` &&
                exe_res ===
                `*-location-gcs-geohash-unique`
            ) {
                await lc.dialog.alert(
                    `This location has already been added.`,
                );
            }
        } else if (
            loc_gcs &&
            typeof loc_gcs === `string`
        ) {
            const dcf_res = await lc.dialog.confirm(
                `Location permissions are required to read geolocation.`,
            );
            if (dcf_res) {
                await lc.settings.open(
                    lc.platform === `ios`
                        ? {
                            ios: {
                                setting: `LocationServices`,
                            },
                        }
                        : {
                            android: {
                                setting: `Location`,
                            },
                        },
                );
            }
        }
        return false;
    } catch (e) {
        console.log(`(error) location_gcs_add `, e);
        return false;
    }
};