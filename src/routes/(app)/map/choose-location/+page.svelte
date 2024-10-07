<script lang="ts">
    import { geoc, lc } from "$lib/client";
    import MapControlFull from "$lib/components/map_control_full.svelte";
    import MapMarkerDot from "$lib/components/map_marker_dot.svelte";
    import MapPopupLocationInfo from "$lib/components/map_popup_location_info.svelte";
    import { _conf } from "$lib/conf";
    import { location_gcs_add_current } from "$lib/utils/location_gcs";
    import { app_thc, LoadingView, route, sleep } from "@radroots/svelte-lib";
    import { MapLibre, Marker, Popup } from "@radroots/svelte-maplibre";
    import { type GeolocationCoordinatesPoint } from "@radroots/utils";
    import { onMount } from "svelte";

    let loading_layout = true;
    let map_coords_inital: GeolocationCoordinatesPoint | undefined = undefined;
    let map_coords: GeolocationCoordinatesPoint | undefined = undefined;

    onMount(async () => {
        try {
            const geoloc = await lc.geo.current();
            if (`err` in geoloc)
                map_coords_inital = {
                    lat: 0,
                    lng: 0,
                };
            else {
                map_coords_inital = geoloc;
                map_coords = geoloc;
            }
            await sleep(_conf.delay.load);
        } catch (e) {
            console.log(`e `, e);
        } finally {
            loading_layout = false;
        }
    });
</script>

{#if map_coords}
    <MapLibre
        center={map_coords_inital}
        zoom={10}
        class={`map-full ${loading_layout ? `hidden` : ``}`}
        style={_conf.map.styles.base[$app_thc]}
    >
        <Marker
            bind:lngLat={map_coords}
            draggable
            on:dragend={async () => {
                if (!map_coords) return;
                const geoc_res = await geoc.reverse({
                    point: map_coords,
                    limit: 1,
                });
                if (`results` in geoc_res) {
                    console.log(
                        JSON.stringify(geoc_res.results, null, 4),
                        `geoc_res.results`,
                    );
                }
            }}
        >
            <MapMarkerDot />
            <Popup offset={_conf.map.popup.dot.offset}>
                <MapPopupLocationInfo basis={{ point: map_coords }} />
            </Popup>
        </Marker>
    </MapLibre>
{/if}
{#if loading_layout}
    <LoadingView />
{:else}
    <MapControlFull
        basis={{
            callback: async () => {
                if (!map_coords) return; //@todo
                const res = await location_gcs_add_current();
                if (res)
                    await route(`/models/trade-product/add`, [[`id`, res.id]]);
            },
        }}
    />
{/if}

<style>
    :global(.map-full) {
        height: 100vh;
        width: 100vh;
    }
</style>
