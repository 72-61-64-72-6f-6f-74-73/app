<script lang="ts">
    import { layout_window } from "$lib/components";
    import type { PropChildren } from "$lib/types";
    import "../app.css";

    let { children }: PropChildren = $props();
</script>

<svelte:component this={layout_window}>
    {@render children()}
</svelte:component>
