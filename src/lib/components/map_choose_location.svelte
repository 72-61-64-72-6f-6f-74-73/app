<script lang="ts">
    import { geoc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import { app_thc } from "$lib/stores";
    import type { GeocoderReverseResult } from "@radroots/geocoder";
    import { Loading, type CallbackPromise } from "@radroots/svelte-lib";
    import { MapLibre, Marker, Popup } from "@radroots/svelte-maplibre";
    import type { GeolocationCoordinatesPoint } from "@radroots/utils";
    import MapMarkerDot from "./map_marker_dot.svelte";
    import MapPopupLocationInfo from "./map_popup_location_info.svelte";

    export let basis: {
        classes_map: string;
        loading?: boolean;
        reset?: CallbackPromise;
    };
    $: basis = basis;

    export let map_point_center: GeolocationCoordinatesPoint;
    export let map_point_select: GeolocationCoordinatesPoint;
    export let map_point_select_geoc: GeocoderReverseResult | undefined =
        undefined;

    $: {
        if (
            map_point_center &&
            map_point_center.lat !== 0 &&
            map_point_center.lng !== 0
        ) {
            (async () => {
                try {
                    const geoc_res = await geoc.reverse({
                        point: map_point_center,
                    });
                    if (`results` in geoc_res && geoc_res.results.length > 0)
                        map_point_select_geoc = geoc_res.results[0];
                    else map_point_select_geoc = undefined;
                } catch (e) {}
            })();
        }
    }
</script>

<div
    class={`relative flex flex-col justify-center items-center ${basis.classes_map} bg-layer-1-surface rounded-3xl overflow-hidden`}
>
    <MapLibre
        center={map_point_center}
        zoom={10}
        class={`${basis.classes_map} ${basis.loading ? `hidden` : ``}`}
        style={_conf.map.styles.base[$app_thc]}
        attributionControl={false}
    >
        <Marker
            bind:lngLat={map_point_select}
            draggable
            on:dragend={async () => {
                if (!map_point_select) return;
                const geoc_res = await geoc.reverse({
                    point: map_point_select,
                    limit: 1,
                });
                if (`results` in geoc_res && geoc_res.results.length > 0)
                    map_point_select_geoc = geoc_res.results[0];
            }}
        >
            <MapMarkerDot />
            <Popup
                offset={_conf.map.popup.dot.offset}
                open={true}
                closeOnClickOutside={false}
                closeButton={false}
            >
                <MapPopupLocationInfo
                    basis={{
                        point: map_point_select,
                        geoc: map_point_select_geoc,
                    }}
                />
            </Popup>
        </Marker>
    </MapLibre>
    {#if basis.loading}
        <div
            class={`absolute top-0 left-0 flex flex-col flex-grow h-full w-full justify-center items-center`}
        >
            <Loading />
        </div>
    {/if}
</div>
<div class={`flex flex-col h-8 w-full justify-end items-center`}>
    <button
        class={`flex flex-row justify-center items-center`}
        on:click={async () => {
            if (basis.reset) await basis.reset();
        }}
    >
        <p class={`font-mono font-[400] text-layer-0-glyph text-sm`}>
            {`reset`}
        </p>
    </button>
</div>
