<script lang="ts">
    import type { PropChildren } from "$lib/types";

    let { children }: PropChildren = $props();
</script>

<div
    class={`relative flex flex-col h-[100vh] w-full overflow-x-hidden overflow-y-hidden bg-layer-0-surface`}
>
    <div class={`flex flex-col h-full w-full`}>
        {@render children()}
    </div>
</div>
