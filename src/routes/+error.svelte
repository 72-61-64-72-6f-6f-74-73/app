<script lang="ts">
    import { page } from "$app/stores";
    import { LayoutView } from "@radroots/svelte-lib";
</script>

{#if $page}
    <LayoutView>
        <div class={`flex flex-col w-full justify-start items-start`}>
            <div class={`flex flex-row w-full justify-center items-center`}>
                <p class={`font-sans font-[400] text-layer-2-glyph`}>
                    {`${$page.status}: ${$page.error ? $page.error.message : `(no message)`}`}
                </p>
            </div>
            <div
                class={`flex flex-row w-full gap-2 justify-center items-center`}
            >
                <p class={`font-sans font-[400] text-layer-2-glyph`}>
                    {`There was an error.`}
                </p>
                <a href="/">
                    <p class={`font-sans font-[400] text-layer-1-glyph-hl`}>
                        {`Click to return.`}
                    </p>
                </a>
            </div>
        </div>
    </LayoutView>
{/if}
