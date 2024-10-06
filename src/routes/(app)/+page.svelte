<script lang="ts">
    import { app_nostr_key } from "$lib/stores";
    import {
        type CallbackPromise,
        EnvelopeLower,
        Glyph,
        type GlyphKey,
        type GlyphWeight,
        LayoutView,
        nav_prev,
        type NavigationRoute,
        route,
        Tabs,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let tmp_show_envelope = false;

    onMount(async () => {
        try {
            nav_prev.set([]);
        } catch (e) {
        } finally {
        }
    });

    let buttons: {
        route: NavigationRoute;
        label: string;
        key: GlyphKey;
        weight?: GlyphWeight;
        callback?: CallbackPromise;
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
            callback: async () => {
                nav_prev.set([
                    ...$nav_prev,
                    {
                        route: `/`,
                        label: `Home`,
                    },
                ]);
            },
        },
        {
            route: `/models/nostr-relay`,
            label: `Relays`,
            key: `network`,
            weight: `fill`,
            callback: async () => {
                nav_prev.set([
                    ...$nav_prev,
                    {
                        route: `/`,
                        label: `Home`,
                    },
                ]);
            },
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
                        if (btn.callback) await btn.callback();
                        await route(btn.route);
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
<Tabs
    basis={{
        list: [
            {
                icon: `house-line`,
                callback: async (tab_i) => {
                    await route(`/`);
                },
            },
            {
                icon: `compass`,
                callback: async (tab_i) => {},
            },
            {
                icon: `network`,
                callback: async (tab_i) => {
                    await route(`/models/nostr-profile`);
                },
            },
            {
                icon: `bell-simple`,
                callback: async (tab_i) => {
                    await route(`/test`);
                },
            },
        ],
    }}
/>
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
