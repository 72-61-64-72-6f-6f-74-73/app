<script lang="ts">
    import { goto } from "$app/navigation";
    import { lc } from "$lib/client";
    import ButtonSubmit from "$lib/components/button-submit.svelte";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { location_gcs_add } from "$lib/utils/models";
    import {
        parse_trade_product_form_keys,
        trade_product_form_fields,
        trade_product_form_vals,
        type LocationGcs,
    } from "@radroots/client";
    import {
        fmt_capitalize,
        fmt_id,
        InputForm,
        kv,
        Loading,
    } from "@radroots/svelte-lib";
    import { trade_keys } from "@radroots/utils";

    import { onMount } from "svelte";

    const texts_key = {
        opt_lcs_add: `location_gcs-add-current`,
    };

    const texts = {
        1: `No locations saved`,
        2: `Add new location`,
    };

    const texts_kv: Record<string, string> = {
        key: `Kind`,
    };

    let loading = false;
    let loading_location = false;

    let ls_model_location_gcs: LocationGcs[] = [];
    let sel_model_location_gcs_id = ``;
    let sel_model_trade_good_key = ``;

    $: {
        if (ls_model_location_gcs.length && !sel_model_location_gcs_id)
            sel_model_location_gcs_id = ls_model_location_gcs[0].id;
    }

    onMount(async () => {
        try {
            sel_model_trade_good_key = trade_keys[0];
            await fetch_models_location_gcs();
        } catch (e) {
        } finally {
        }
    });

    const fetch_models_location_gcs = async (): Promise<void> => {
        try {
            const res = await lc.db.location_gcs_get({
                list: [`all`],
            });
            if (typeof res !== `string`) ls_model_location_gcs = res;
        } catch (e) {
            console.log(`(error) fetch_models_location_gcs `, e);
        }
    };

    const add_model_location_gcs = async (): Promise<void> => {
        try {
            loading_location = true;
            await location_gcs_add();
            await fetch_models_location_gcs();
        } catch (e) {
            console.log(`(error) add_model_location_gcs `, e);
        } finally {
            loading_location = false;
        }
    };

    const submit = async (): Promise<void> => {
        try {
            loading = true;

            if (!sel_model_location_gcs_id) {
                await lc.dialog.alert(`The product location is missing.`);
                return;
            }

            const db_location_gcs = await lc.db.location_gcs_get({
                id: sel_model_location_gcs_id,
            });

            if (
                typeof db_location_gcs === `string` ||
                db_location_gcs.length !== 1
            ) {
                await lc.dialog.alert(
                    `There was an error finding the selected location`,
                );
                await goto(`/`);
                return;
            }

            const vals = trade_product_form_vals;
            for (const [k, field] of Object.entries(
                trade_product_form_fields,
            )) {
                const field_k = parse_trade_product_form_keys(k);
                if (!field_k) continue;
                const field_id = fmt_id(field_k);
                const field_val =
                    field_k === `key`
                        ? sel_model_trade_good_key
                        : await $kv.get(field_id);

                if (
                    (!field.optional && !field.validation.test(field_val)) ||
                    (field.optional &&
                        field_val &&
                        !field.validation.test(field_val))
                ) {
                    loading = false;
                    await lc.dialog.alert(
                        `Invalid product ${texts_kv[field_k]?.toLowerCase() || field_k} value.`,
                    );
                    return;
                }
                vals[field_k] = field_val;
            }
            const db_add = await lc.db.trade_product_add(vals);
            if (typeof db_add !== `string` && !Array.isArray(db_add)) {
                const { id: trade_product_id } = db_add;
                const db_rel = await lc.db.set_trade_product_location({
                    trade_product_id,
                    location_gcs_id: db_location_gcs[0].id,
                });
                if (typeof db_rel === `string`) {
                    // @todo
                }
                await goto(`/models/trade-product`);
            } else {
                // @todo
                await lc.dialog.alert(
                    `There was an error: ${db_add.toString()}`,
                );
            }
        } catch (e) {
            console.log(`(error) submit `, e);
        } finally {
            loading = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <div
            class={`flex flex-col w-full px-4 gap-3 justify-center items-center`}
        >
            {#each Object.entries(trade_product_form_fields).filter((i) => i[0] !== `key`) as [field_k, field], field_i}
                {#if field_i === 0}
                    <div
                        class={`flex flex-col w-full gap-1 justify-start items-start`}
                    >
                        <div
                            class={`flex flex-row w-full px-2 justify-start items-center`}
                        >
                            <p
                                class={`font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                            >
                                {`Product - Kind`}
                            </p>
                        </div>
                        <select
                            class={`form-select-e w-full bg-layer-1-surface rounded-xl text-layer-1-glyph/70`}
                            bind:value={sel_model_trade_good_key}
                            on:change={async ({ currentTarget: el }) => {
                                const val = el.value;
                                console.log(`val `, val);
                            }}
                        >
                            {#each trade_keys as li}
                                <option value={li}>
                                    {fmt_capitalize(li)}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <div
                        class={`flex flex-col w-full gap-1 justify-start items-start`}
                    >
                        <div
                            class={`flex flex-row w-full px-2 justify-start items-center`}
                        >
                            <p
                                class={`font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                            >
                                {`Product - Location`}
                            </p>
                        </div>
                        {#if loading_location}
                            <div
                                class={`form-line surface-1 flex flex-row justify-center items-center rounded-xl`}
                            >
                                <Loading basis={{ dim: `xs-` }} />
                            </div>
                        {:else}
                            <select
                                class={`form-select-e w-full bg-layer-1-surface rounded-xl text-layer-1-glyph/70`}
                                bind:value={sel_model_location_gcs_id}
                                on:change={async ({ currentTarget: el }) => {
                                    const val = el.value;
                                    if (val === texts_key.opt_lcs_add) {
                                        sel_model_location_gcs_id = ``;
                                        await add_model_location_gcs();
                                    }
                                }}
                            >
                                {#if ls_model_location_gcs.length}
                                    {#each ls_model_location_gcs as li}
                                        <option value={li.id}>
                                            {`${li.label}`}
                                        </option>
                                    {/each}
                                {:else}
                                    <option disabled selected={true}>
                                        {texts[1]}
                                    </option>
                                {/if}
                                <option value={texts_key.opt_lcs_add}>
                                    {texts[2]}
                                </option>
                            </select>
                        {/if}
                    </div>
                {/if}
                <div
                    class={`flex flex-col w-full gap-1 justify-start items-start`}
                >
                    <div
                        class={`flex flex-row w-full px-2 justify-start items-center`}
                    >
                        <p
                            class={`font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                        >
                            {`Product - ${texts_kv[field_k] || field_k}`}
                        </p>
                    </div>
                    <div
                        class={`form-line-e bg-layer-1-surface text-layer-1-glyph/70 rounded-xl`}
                    >
                        <InputForm
                            basis={{
                                id: fmt_id(field_k),
                                layer: 1,
                                sync: true,
                                field: {
                                    charset: field.charset,
                                    validate: field.validation,
                                },
                            }}
                        />
                    </div>
                </div>
            {/each}
            <div class={`flex flex-row w-full pt-4 justify-end items-center`}>
                <ButtonSubmit
                    basis={{
                        callback: async () => {
                            await submit();
                        },
                        loading,
                    }}
                />
            </div>
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Products`,
            route: `/models/trade-product`,
        },
        title: {
            label: `Add New`,
        },
        option: {
            glyph: {
                key: `info`,
                dim: `md`,
                classes: `text-layer-1-glyph-hl tap-scale`,
            },
            callback: async () => {
                //await fetch_models();
                alert(`Todo!`);
            },
        },
    }}
/>
