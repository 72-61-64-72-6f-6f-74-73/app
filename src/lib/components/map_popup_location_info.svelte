<script lang="ts">
    import type { GeocoderReverseResult } from "@radroots/geocoder";
    import type { GeolocationCoordinatesPoint } from "@radroots/utils";

    export let basis: {
        point: GeolocationCoordinatesPoint;
        geoc?: GeocoderReverseResult;
    };
</script>

<button
    class={`flex flex-row justify-center items-center transition-all`}
    on:click={async () => {}}
>
    <div
        class={`flex flex-col w-fit px-3 py-[0.5rem] gap-2 justify-start items-start`}
    >
        {#if basis.geoc}
            <div class={`flex flex-col w-full gap-1 justify-start items-start`}>
                <p class={`font-mono font-[400] text-layer-2-glyph`}>
                    {basis.geoc.name}
                </p>
                <p class={`font-mono font-[400] text-layer-2-glyph`}>
                    {`${basis.geoc.admin1_name}, ${basis.geoc.country_name}`}
                </p>
            </div>
        {:else}
            <div class={`flex flex-row w-full justify-start items-center`}>
                <p class={`font-mono font-[400] text-layer-2-glyph`}>
                    {`Marker location:`}
                </p>
            </div>
            <div
                class={`flex flex-row w-full gap-2 justify-start items-center`}
            >
                <p class={`font-mono font-[400] text-layer-2-glyph`}>
                    {`${basis.point.lat.toFixed(4)}`}
                </p>
                <p class={`font-mono font-[400] text-layer-2-glyph`}>
                    {`${basis.point.lng.toFixed(4)}`}
                </p>
            </div>
        {/if}
    </div>
</button>
