<script lang="ts">
    import type { PropChildren } from "@radroots/svelte-lib";

    let { children }: PropChildren = $props();
</script>


<div class={`flex flex-col w-full pt-4 px-4 gap-4 justify-start items-start`}>
    {@render children()}
</div>
