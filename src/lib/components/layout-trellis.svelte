<script lang="ts">
    import type { PropChildren } from "@radroots/svelte-lib";

    let { children }: PropChildren = $props();
</script>


<div class={`flex flex-col w-full pt-2 px-4 pb-6 gap-4`}>
    {@render children()}
</div>
