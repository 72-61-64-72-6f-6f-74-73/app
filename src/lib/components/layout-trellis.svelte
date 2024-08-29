<script lang="ts">
    import type { PropChildren } from "@radroots/svelte-lib";

    let { children }: PropChildren = $props();
</script>


<div class={`flex flex-col w-full mb-4 pt-20 pb-h_tabs_lg px-4 gap-4 justify-start items-start overflow-y-scroll scroll-hide`}>
    {@render children()}
</div>
