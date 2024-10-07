import { geoc, lc } from "$lib/client";
import type { GeocoderReverseResult } from "@radroots/geocoder";
import type { LocationGcsFormFields } from "@radroots/models";
import { location_geohash } from "@radroots/utils";

export const location_gcs_add_geoc = async (opts: {
    geoc: GeocoderReverseResult;
    label?: string;
}): Promise<{ id: string } | undefined> => {
    try {
        const { geoc } = opts;
        const fields: LocationGcsFormFields = {
            lat: geoc.latitude.toString(),
            lng: geoc.longitude.toString(),
            geohash: location_geohash({ lat: geoc.latitude, lng: geoc.longitude }),
            gc_id: geoc.id.toString(),
            gc_name: geoc.name,
            gc_admin1_id: geoc.admin1_id.toString(),
            gc_admin1_name: geoc.admin1_name,
            gc_country_id: geoc.country_id,
            gc_country_name: geoc.country_name,
        };
        if (opts.label) fields.label = opts.label;

        const res =
            await lc.db.location_gcs_add(fields);
        if (`id` in res) return res;
        else if (`err` in res && res.err === `*-location-gcs-geohash-unique`
        ) {
            await lc.dialog.alert(
                `This location has already been added.`,
            );
        }
    } catch (e) {
        console.log(`(error) location_gcs_add_geoc `, e);
    }
};

export const location_gcs_add_current = async (): Promise<{ id: string } | false> => {
    try {
        const geoloc = await lc.geo.current();
        if (`err` in geoloc) {
            const confirm = await lc.dialog.confirm(
                `Location permissions are required to read geolocation.`,
            );
            if (confirm) {
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
            return false;
        }

        const dialog_label =
            await lc.dialog.prompt({
                title: `Geolocation Label`,
                message: `What is the name of the location.`,
                input_placeholder: `Enter location name`,
            });
        if (dialog_label === false) return false;
        else if (!dialog_label) {
            await lc.dialog.alert(`A location name is required.`);
            return false;
        }
        const fields: LocationGcsFormFields = {
            lat: geoloc.lat.toString(),
            lng: geoloc.lng.toString(),
            geohash: location_geohash(geoloc),
            label: dialog_label,
        }
        const geoc_res = await geoc.reverse({
            point: geoloc
        });
        if (`results` in geoc_res && geoc_res.results.length > 0) {
            const gc_result = geoc_res.results[0];
            fields.gc_id = gc_result.id.toString();
            fields.gc_name = gc_result.name;
            fields.gc_admin1_id = gc_result.admin1_id.toString();
            fields.gc_admin1_name = gc_result.admin1_name;
            fields.gc_country_id = gc_result.country_id;
            fields.gc_country_name = gc_result.country_name;
        };
        const res =
            await lc.db.location_gcs_add(fields);
        if (`id` in res) return res;
        else if (`err` in res && res.err === `*-location-gcs-geohash-unique`
        ) {
            await lc.dialog.alert(
                `This location has already been added.`,
            );
        }

        return false;
    } catch (e) {
        console.log(`(error) location_gcs_add_current `, e);
        return false;
    }
};