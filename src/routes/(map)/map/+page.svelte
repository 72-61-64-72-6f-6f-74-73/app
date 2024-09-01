<script lang="ts">
  import { map_full_center } from "$lib/stores";
  import { MapLibre } from "@radroots/svelte-maplibre";
  import { onMount } from "svelte";

  let el: any;

  onMount(async () => {
    try {
      /*
      const loc = await lc.geo.current();
      if (loc && typeof loc !== `string`) {
        const tup: [number, number] = [loc.lng, loc.lat];
        console.log(`tup `, tup);
        map_full_center.set(tup);
      }
      */
    } catch (e) {
      console.log(`e `, e);
    } finally {
    }
  });
</script>

<MapLibre
  bind:this={el}
  center={$map_full_center}
  class="map-full"
  style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
/>

<style>
  :global(.map-full) {
    height: 100vh;
  }
</style>
