<script lang="ts">
    import { goto } from "$app/navigation";
    import { lc } from "$lib/client";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { _cf } from "$lib/conf";
    import { app_tab_active, app_tabs_visible } from "$lib/stores";
    import { NDKKind } from "@nostr-dev-kit/ndk";
    import {
        glyph as Glyph,
        ndk,
        ndk_event,
        ndk_user,
        type GlyphKey,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_tabs_visible.set(true);
            app_tab_active.set(0);
        } catch (e) {
        } finally {
        }
    });

    const nostr_note_pub = async (): Promise<void> => {
        try {
            const content = `posting from radroots`;
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Text,
                    content: JSON.stringify(content),
                },
            });
            console.log(JSON.stringify(ev, null, 4), `ev`);
            if (ev) await ev.publish();
            lc.dialog.alert(`Published content ${JSON.stringify(content)}`);
        } catch (e) {
            console.log(`(error) nostr_note_pub `, e);
        }
    };

    /*
<div class={`grid grid-cols-12 w-full gap-8 pt-6 px-6`}>
        <button
            class={`button-base surface-1 col-span-6 h-24 rounded-2xl font-[500] text-lg font-mono`}
            on:click={async () => {
                await goto(`/models/location-gcs`);
            }}
        >
            {`Post `}
        </button>
        <button
            class={`button-base surface-1 col-span-6 h-32 rounded-2xl font-[500] text-lg font-mono`}
            on:click={async () => {
                await goto(`/models/location-gcs`);
            }}
        >
            {`Post `}
        </button>
        <button
            class={`button-base surface-1 col-span-6 h-32 rounded-2xl font-[500] text-lg font-mono`}
            on:click={async () => {
                await goto(`/models/location-gcs`);
            }}
        >
            {`Post `}
        </button>
        
    </div>
    */

    let buttons: { route: string; label: string; key: GlyphKey }[] = [
        {
            route: `/models/trade-product/add`,
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
            <p class={`font-mono font-[500] text-layer-2-glyph text-lg`}>
                {`radroots ${_cf.root_symbol}`}
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
                        class={`flex flex-row w-full justify-between items-center`}
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
                                    dim: `sm`,
                                    weight: `bold`,
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
