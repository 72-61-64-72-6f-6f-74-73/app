<script lang="ts">
    import { goto } from "$app/navigation";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { app_tab_active, app_tabs_visible } from "$lib/stores";
    import { glyph as Glyph, type GlyphKey } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_tabs_visible.set(true);
            app_tab_active.set(0);
        } catch (e) {
        } finally {
        }
    });

    let buttons: { route: string; label: string; key: GlyphKey }[] = [
        {
            route: `/models/trade-product`,
            label: `Post Goods`,
            key: `handbag-simple`,
        },
    ];
</script>

<LayoutView>
    <div
        class={`flex flex-col w-full justify-start items-start pt-6 gap-6 px-6`}
    >
        <div class={`flex flex-row w-full px-1 justify-start items-center`}>
            <p
                class={`font-mono font-[600] text-layer-2-glyph text-xl tracking-wide`}
            >
                {`radroots app (beta-1.0.0)`}
            </p>
        </div>
        <button
            class={`flex flex-row w-full h-8 px-4 gap-2 justify-start items-center surface-1 rounded-xl active:bg-layer-1-surface_a transition-all`}
        >
            <Glyph
                basis={{
                    key: `magnifying-glass`,
                    dim: `sm-`,
                    weight: `bold`,
                }}
            />
            <p class={`font-sans font-[500] text-layer-2-glyph/70`}>
                {`Search`}
            </p>
        </button>
        <div
            class={`grid grid-cols-12 flex flex-row w-full gap-4 justify-start items-center`}
        >
            {#each buttons as btn}
                <button
                    class={`surface-1 col-span-6 flex flex-col h-20 py-2 px-3 justify-between rounded-2xl font-[500] text-lg font-mono active:bg-layer-1-surface_a transition-all`}
                    on:click={async () => {
                        await goto(btn.route);
                    }}
                >
                    <div
                        class={`flex flex-row w-full p-[2px] justify-between items-center`}
                    >
                        <div class={`flex flex-row justify-start items-center`}>
                            <Glyph
                                basis={{
                                    key: btn.key,
                                    dim: `md`,
                                    weight: `bold`,
                                }}
                            />
                        </div>
                        <div class={`flex flex-row justify-start items-center`}>
                            <Glyph
                                basis={{
                                    key: `caret-right`,
                                    dim: `sm-`,
                                    weight: `bold`,
                                    classes: `text-layer-2-glyph`,
                                }}
                            />
                        </div>
                    </div>
                    <div
                        class={`flex flex-row w-full justify-start items-center`}
                    >
                        <div class={`flex flex-row justify-start items-center`}>
                            {btn.label}
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</LayoutView>
