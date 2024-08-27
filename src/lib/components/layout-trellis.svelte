<script lang="ts">
    import type { PropChildren } from "@radroots/svelte-lib";

    let { children }: PropChildren = $props();
</script>


<div class={`flex flex-col w-full pt-20 pb-12 px-4 gap-4 justify-start items-start overflow-y-scroll`}>
    {@render children()}
</div>
