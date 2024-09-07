<script lang="ts">
    import MapMarkerDot from "./map-marker-dot.svelte";

    export let kind = "current";
</script>

{#if kind === `current`}
    <MapMarkerDot />
{/if}
