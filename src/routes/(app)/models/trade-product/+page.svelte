<script lang="ts">
    import { goto } from "$app/navigation";
    import { lc } from "$lib/client";
    import { type TradeProduct } from "@radroots/models";
    import {
        app_tabs_visible,
        LayoutTrellis,
        LayoutView,
        locale,
        Nav,
        time_fmt_iso,
        Trellis,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let models_list: TradeProduct[] = [];
    let loading_models = false;

    onMount(async () => {
        try {
            app_tabs_visible.set(false);
            await fetch_models();
        } catch (e) {
        } finally {
        }
    });

    const fetch_models = async (): Promise<void> => {
        try {
            loading_models = true;
            const res = await lc.db.trade_product_get({
                list: [`all`],
            });
            if (typeof res !== `string`) models_list = res;
        } catch (e) {
            console.log(`(error) fetch_models `, e);
        } finally {
            loading_models = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        {#if models_list.length}
            {#each models_list as li, li_i}
                <Trellis
                    basis={{
                        args: {
                            layer: 1,
                            title:
                                li_i === 0
                                    ? {
                                          value: `Trade Products`,
                                      }
                                    : undefined,
                            list: [
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Product:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value: li.key,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Date Created:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value: time_fmt_iso(
                                                        $locale,
                                                        li.created_at,
                                                    ),
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Lot:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value: li.lot || `@todo`,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Process:`,
                                                    classes: `capitalize`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    value:
                                                        li.process || `(@todo)`,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                            ],
                        },
                    }}
                />
            {/each}
        {:else if !loading_models}
            <div
                class={`flex flex-col w-full justify-center items-center px-4 gap-3`}
            >
                <p class={`font-sans font-[400] text-layer-2-glyph`}>
                    {`No items to display.`}
                </p>
                <a href={`/models/trade-product/add`}>
                    <p
                        class={`font-sans font-[400] text-layer-2-glyph-hl text-sm`}
                    >
                        {`Click to add a new product`}
                    </p>
                </a>
            </div>
        {/if}
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Home`,
            route: `/`,
        },
        title: {
            label: `Products`,
        },
        option: models_list.length
            ? {
                  label: {
                      value: `Add`,
                      classes: `tap-color`,
                  },
                  callback: async () => {
                      await goto(`/models/trade-product/add`);
                  },
              }
            : undefined,
    }}
/>
