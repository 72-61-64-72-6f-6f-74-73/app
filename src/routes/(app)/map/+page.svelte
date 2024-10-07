<script lang="ts">
    import { lc } from "$lib/client";
    import MapControlFull from "$lib/components/map_control_full.svelte";
    import MapMarkerDot from "$lib/components/map_marker_dot.svelte";
    import MapPopupLocationInfo from "$lib/components/map_popup_location_info.svelte";
    import { _conf } from "$lib/conf";
    import { app_thc, LoadingView, route, sleep } from "@radroots/svelte-lib";
    import { MapLibre, Marker, Popup } from "@radroots/svelte-maplibre";
    import { type GeolocationCoordinatesPoint } from "@radroots/utils";
    import { onMount } from "svelte";

    let loading_layout = true;
    let map_coords: GeolocationCoordinatesPoint | undefined = undefined;

    onMount(async () => {
        try {
            const geoloc = await lc.geo.current();
            if (`err` in geoloc) return;
            map_coords = geoloc;
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
        center={map_coords}
        zoom={10}
        class={`map-full ${loading_layout ? `hidden` : ``}`}
        style={_conf.map.styles.base[$app_thc]}
    >
        <Marker lngLat={map_coords}>
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
                await route(`/`);
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
