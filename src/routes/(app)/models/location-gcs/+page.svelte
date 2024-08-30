<script lang="ts">
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { app_tabs_visible } from "$lib/stores";
    import { type LocationGcs, type LocationGcsFormFields } from "@radroots/client";
    import { trellis as Trellis } from "@radroots/svelte-lib";
    import { location_geohash } from "@radroots/utils";

    let locations_all = $state<LocationGcs[]>([]);

    $effect(() => { 
        app_tabs_visible.set(false);
        (async () => {
           try {
            const res = await cl.db.location_gcs_get({
                list: [`all`],
            });
            if(typeof res !== `string`) locations_all = res;
           } catch (e) { }
        })();
     });
</script>


<LayoutView>
    <LayoutTrellis>
        <Trellis 
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Location GCS`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Add Current Location`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const loc_gcs = await cl.geo.current();
                                    if (loc_gcs && typeof loc_gcs !== `string`) {
                                        const loc_gcs_label = await cl.dialog.prompt({
                                            title: `Geolocation Label`,
                                            message: `What is the name of the location.`,
                                            input_placeholder: `Enter location name`,
                                        });
                                        if(loc_gcs_label === false) return;


                                        const { lat, lng } = loc_gcs;
                                        const geohash = location_geohash(lat, lng);
                                        const fields: LocationGcsFormFields = {
                                            lat: lat.toString(),
                                            lng: lng.toString(),
                                            geohash,
                                            label: loc_gcs_label
                                        };
                                        const exe_res = await cl.db.location_gcs_add(fields);
                                        if(typeof exe_res !== `string` && `id` in exe_res) {
                                            await cl.dialog.alert(`Added new location (${exe_res.id})`);
                                        } else if(typeof exe_res === `string` && exe_res === `*-location-gcs-geohash-unique`) {
                                            await cl.dialog.alert(`This location has already been added.`);
                                        }
                                    } else if (loc_gcs && typeof loc_gcs === `string`) {
                                        const dcf_res = await cl.dialog.confirm(`Enable location permission is required.`);
                                        if (dcf_res) {
                                            await cl.settings.open(
                                                cl.platform === `ios`
                                                    ? { ios: { setting: `LocationServices` } }
                                                    : { android: { setting: `Location` } },
                                            );
                                        }
                                    }
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Read Saved Locations`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const res = await cl.db.location_gcs_get({
                                        list: [`all`],
                                    });
                                    if(typeof res !== `string`) locations_all = res;
                    
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <div class={`flex flex-col justify-center items-center pt-4 px-4`}>
            {#if locations_all.length > 0}
                <p class={`font-sans font-[400] text-layer-0-glyph text-xs`}>
                    {"Your locations:"}
                </p>
                {#each locations_all as location}
                    <div class={`flex flex-col justify-center items-center`}>
                        <pre class={`font-sans font-[400] text-layer-0-glyph text-xs`}>{JSON.stringify(
                                location,
                                null,
                                4,
                            )}
                        </pre>
                    </div>
                {/each}
            {:else}
                <p class={`font-sans font-[400] text-layer-0-glyph text-xs`}>
                    {"No locations saved"}
                </p>
            {/if}
        </div>
    </LayoutTrellis>
</LayoutView>
