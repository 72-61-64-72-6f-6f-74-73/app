<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import { type LocationGcsFormFields } from "@radroots/client/src/capacitor/sql";
    import { trellis } from "@radroots/svelte-lib";
    import { location_geohash } from "@radroots/utils";
</script>

<svelte:component this={LayoutTrellis}>
    <svelte:component
        this={trellis}
        basis={{
            args: {
                layer: 1,
                title: {
                    value: `Location GCS`,
                },
                list: [
                    {
                        offset: {
                            mod: {
                                key: `caret-left`,
                            },
                        },
                        touch: {
                            label: {
                                left: [
                                    {
                                        value: "Back",
                                    },
                                ],
                            },
                            callback: async () => {
                                await goto(`/`);
                            },
                        },
                    },
                    {
                        touch: {
                            label: {
                                left: [
                                    {
                                        value: `Read Logs`,
                                        classes: `capitalize`,
                                    },
                                ],
                            },
                            callback: async () => {
                                await cl.dialog.alert(JSON.stringify(cl.db.logs));
                            },
                        },
                    },
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
                                const pos = await cl.geo.current();
                                console.log(JSON.stringify(pos,null,4), `pos`)
                                if (pos) {
                                    const { lat, lng } = pos;
                                    const geohash = location_geohash(lat, lng);
                                    const fields: LocationGcsFormFields = {
                                        lat: lat.toString(),
                                        lng: lng.toString(),
                                        geohash
                                    };
                                    console.log(JSON.stringify(fields,null,4), `fields`)
                                    const res = await cl.db.location_gcs_add(fields);
                                    await cl.dialog.alert(JSON.stringify(res));
                                }
                            },
                        },
                    },
                    {
                        touch: {
                            label: {
                                left: [
                                    {
                                        value: `Read All`,
                                        classes: `capitalize`,
                                    },
                                ],
                            },
                            callback: async () => {
                                const res = await cl.db.location_gcs_get({
                                    list: [`all`],
                                });
                                await cl.dialog.alert(JSON.stringify(res));
                            },
                        },
                    },
                ],
            },
        }}
    />
</svelte:component>
