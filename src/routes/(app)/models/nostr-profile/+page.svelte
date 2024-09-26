<script lang="ts">
    import { lc } from "$lib/client";
    import { location_gcs_add } from "$lib/utils/location_gcs";
    import {
        nostr_profile_form_vals,
        parse_nostr_profile_form_keys,
        type NostrProfile,
    } from "@radroots/models";
    import {
        app_tabs_visible,
        as_glyph_key,
        LayoutTrellis,
        LayoutView,
        Nav,
        t,
        Trellis,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let models_list: NostrProfile[] = [];
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
            const res = await lc.db.nostr_profile_get({
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
            {#each models_list as li}
                <Trellis
                    basis={{
                        args: {
                            layer: 1,
                            title: {
                                value: `Your Profiles`,
                            },
                            list: [
                                ...Object.keys(nostr_profile_form_vals).map(
                                    (k) => ({
                                        hide_active: true,
                                        touch: {
                                            label: {
                                                left: [
                                                    {
                                                        classes: `capitalize`,
                                                        value: `${$t(`model_fields.${k}`, { default: k.replaceAll(`_`, ` `) })}`,
                                                    },
                                                ],
                                                right: [
                                                    {
                                                        classes: `font-[300] text-layer-1-glyph-shade`,
                                                        value:
                                                            Object.assign(li)[
                                                                parse_nostr_profile_form_keys(
                                                                    k,
                                                                )
                                                            ] || "(none)",
                                                    },
                                                ],
                                            },
                                            end: {
                                                icon: {
                                                    key: as_glyph_key(
                                                        `caret-right`,
                                                    ),
                                                },
                                            },
                                            callback: async () => {},
                                        },
                                    }),
                                ),
                            ],

                            /*[
                                {
                                    hide_active: true,
                                    touch: {
                                        label: {
                                            left: [
                                                {
                                                    value: `Public Key:`,
                                                    classes: `capitalize pr-2`,
                                                },
                                            ],
                                            right: [
                                                {
                                                    classes: `truncate`,
                                                    value: li.public_key,
                                                },
                                            ],
                                        },
                                        callback: async () => {},
                                    },
                                },
                               
                            ],
                            */
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

                <button
                    class={`flex flex-row justify-center items-center`}
                    on:click={async () => {
                        const res = await location_gcs_add();
                        if (res === true) await fetch_models();
                    }}
                >
                    <p
                        class={`font-sans font-[400] text-layer-2-glyph-hl text-sm`}
                    >
                        {`Click to add a new location`}
                    </p>
                </button>
            </div>
        {/if}
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Back`,
            route: `/`,
        },
        title: {
            label: `Profiles`,
        },
        option: models_list.length
            ? {
                  label: {
                      value: `Add`,
                      classes: `tap-color`,
                  },
                  callback: async () => {
                      //const res = await location_gcs_add();
                      //if (res === true) await fetch_models();
                      const ks_keys = await lc.keystore.keys();
                      console.log(JSON.stringify(ks_keys, null, 4), `ks_keys`);
                      for (const ks_key of ks_keys || []) {
                          console.log(`ks_key `, ks_key);
                      }
                  },
              }
            : undefined,
    }}
/>

<style>
    :global(.map-card) {
        height: 100px;
        width: 160px;
    }
</style>
