import { geoc, lc } from "$lib/client";
import type { LocationGcsFormFields } from "@radroots/models";
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
            else if (!loc_gcs_label) {
                await lc.dialog.alert(`A location name is required.`);
                return false;
            }
            const opts: LocationGcsFormFields = {
                lat: loc_gcs.lat.toString(),
                lng: loc_gcs.lng.toString(),
                geohash: location_geohash(loc_gcs),
                label: loc_gcs_label,
            }
            const gc_reverse = await geoc.reverse({
                point: loc_gcs
            });
            if (typeof gc_reverse !== `string` && gc_reverse.results.length > 0) {
                const gc_result = gc_reverse.results[0];
                opts.gc_id = gc_result.id.toString();
                opts.gc_name = gc_result.name;
                opts.gc_admin1_id = gc_result.admin1_id.toString();
                opts.gc_admin1_name = gc_result.admin1_name;
                opts.gc_country_id = gc_result.country_id;
                opts.gc_country_name = gc_result.country_name;
            };
            console.log(JSON.stringify(opts, null, 4), `opts`)
            const exe_res =
                await lc.db.location_gcs_add(opts);
            console.log(`exe_res `, exe_res)
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