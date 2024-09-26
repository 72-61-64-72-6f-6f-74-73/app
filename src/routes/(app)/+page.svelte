<script lang="ts">
    import { goto } from "$app/navigation";
    import { app_nostr_key } from "$lib/stores";
    import {
        app_tab_active,
        app_tabs_visible,
        EnvelopeLower,
        Glyph,
        type GlyphKey,
        type GlyphWeight,
        LayoutView,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let tmp_show_envelope = false;

    onMount(async () => {
        try {
            app_tabs_visible.set(true);
            app_tab_active.set(0);
        } catch (e) {
        } finally {
        }
    });

    let buttons: {
        route: string;
        label: string;
        key: GlyphKey;
        weight?: GlyphWeight;
    }[] = [
        {
            route: `/models/location-gcs`,
            label: `Locations`,
            key: `globe`,
        },
        {
            route: `/models/trade-product`,
            label: `Products`,
            key: `handbag-simple`,
            weight: `fill`,
        },
        {
            route: `/models/nostr-profile`,
            label: `Profiles`,
            key: `address-book-tabs`,
            weight: `fill`,
        },
        {
            route: `/nostr/keys`,
            label: `Keys`,
            key: `key`,
            weight: `fill`,
        },
    ];
</script>

<LayoutView>
    <div
        class={`flex flex-col w-full justify-start items-start pt-6 gap-6 px-6`}
    >
        <div class={`flex flex-row w-full px-1 justify-start items-center`}>
            <p
                class={`font-mono font-[600] text-layer-2-glyph max-sm:text-lg text-xl tracking-wide`}
            >
                {`radroots app (beta-1.0.0)`}
            </p>
        </div>
        <button
            class={`flex flex-row w-full h-[34px] px-4 gap-2 justify-start items-center rounded-xl bg-layer-1-surface active:bg-layer-1-surface_a transition-all`}
            on:click={async () => {
                tmp_show_envelope = !tmp_show_envelope;
            }}
        >
            <Glyph
                basis={{
                    key: `magnifying-glass`,
                    dim: `sm-`,
                    weight: `bold`,
                    classes: `text-layer-2-glyph/90`,
                }}
            />
            <p class={`font-sans font-[500] text-layer-2-glyph/80`}>
                {`Search`}
            </p>
        </button>
        <div
            class={`grid grid-cols-12 flex flex-row w-full gap-4 gap-y-5 justify-start items-center`}
        >
            {#each buttons as btn}
                <button
                    class={`col-span-6 flex flex-col h-20 py-2 px-3 justify-between rounded-2xl bg-layer-1-surface text-layer-2-glyph font-[500] text-lg font-mono tap-rise active-ring-gray transition-all`}
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
                                    weight: btn.weight || `bold`,
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
<EnvelopeLower
    basis={{
        visible: tmp_show_envelope,
        close: async () => {
            tmp_show_envelope = !tmp_show_envelope;
        },
    }}
>
    <div class={`flex flex-col w-full justify-center items-center px-2`}>
        <p class={`font-apercu font-[400] text-layer-2-glyph break-all`}>
            {`Your nostr key is ${$app_nostr_key}`}
        </p>
    </div>
</EnvelopeLower>
