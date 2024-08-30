<script lang="ts">
    import type { PropChildren } from "@radroots/svelte-lib";

    let { children }: PropChildren = $props();
</script>


<div class={`flex flex-col w-full pt-2 px-4 pb-12 gap-4`}>
    {@render children()}
</div>
