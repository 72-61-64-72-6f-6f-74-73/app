<script lang="ts">
  import { lc } from "$lib/client";
  import MapControlFull from "$lib/components/map_control_full.svelte";
  import { _conf } from "$lib/conf";
  import { app_thc } from "$lib/stores";
  import { Fill, LoadingView, sleep } from "@radroots/svelte-lib";
  import { MapLibre, Marker, Popup } from "@radroots/svelte-maplibre";
  import { type NumberTuple } from "@radroots/utils";
  import { onMount } from "svelte";

  let loading_layout = true;
  let map_coords: NumberTuple | undefined = undefined;

  onMount(async () => {
    try {
      const loc = await lc.geo.current();
      if (loc && typeof loc !== `string`) {
        map_coords = [loc.lng, loc.lat];
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
    center={map_coords}
    zoom={10}
    class={`map-full ${loading_layout ? `hidden` : ``}`}
    style={_conf.map.styles.base[$app_thc]}
  >
    <Marker lngLat={map_coords}>
      <div class="flex flex-row p-1">
        <div
          class={`flex flex-row h-map_circle w-map_circle justify-center items-center bg-white rounded-full shadow-lg`}
        >
          <div
            class={`flex flex-row h-map_circle_inner w-map_circle_inner justify-center items-center bg-blue-400 rounded-full`}
          >
            <Fill />
          </div>
        </div>
      </div>
      <Popup offset={_conf.map.popup.dot.offset}>
        <button
          class={`flex flex-row justify-center items-center transition-all`}
          on:click={async () => {}}
        >
          <div
            class={`flex flex-col w-fit px-2 py-1 gap-2 justify-start items-start`}
          >
            <div class={`flex flex-row w-full justify-start items-center`}>
              <p class={`font-mono font-[400] text-layer-2-glyph`}>
                {`Marker location:`}
              </p>
            </div>
            <div
              class={`flex flex-row w-full gap-2 justify-start items-center`}
            >
              <p class={`font-mono font-[400] text-layer-2-glyph`}>
                {map_coords[0]}
              </p>
              <p class={`font-mono font-[400] text-layer-2-glyph`}>
                {map_coords[1]}
              </p>
            </div>
          </div>
        </button>
      </Popup>
    </Marker>
  </MapLibre>
{/if}
{#if loading_layout}
  <LoadingView />
{:else}
  <MapControlFull />
{/if}

<style>
  :global(.map-full) {
    height: 100vh;
    width: 100vh;
  }
</style>
