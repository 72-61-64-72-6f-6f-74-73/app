<script lang="ts">
    import ButtonSubmit from "$lib/components/button-submit.svelte";
    import LayoutTrellisLine from "$lib/components/layout-trellis-line.svelte";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import {
        trade_product_kv_init,
        trade_product_submit_preview,
    } from "$lib/utils/trade_product";
    import { mass_units, trade_product_form_fields } from "@radroots/client";
    import {
        fmt_id,
        InputForm,
        InputSelect,
        kv,
        Nav,
        t,
    } from "@radroots/svelte-lib";
    import {
        fmt_trade_quantity_val,
        parse_trade_key,
        trade_keys,
        trade_quantities,
        type TradeKey,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    const trade_key_default: TradeKey = `coffee`;

    let loading_submit = false;

    let sel_key = ``;
    let show_sel_key_other = false;

    let sel_price_qty_amt = ``;
    let sel_price_qty_unit = ``;

    let show_sel_price_qty_amt_other = false;

    $: sel_key_parsed = parse_trade_key(sel_key);
    $: ls_trade_product_quantities = sel_key_parsed
        ? trade_quantities[sel_key_parsed]
        : trade_quantities[trade_key_default];

    $: sel_price_qty_amt = sel_key_parsed
        ? fmt_trade_quantity_val(trade_quantities[sel_key_parsed][0])
        : fmt_trade_quantity_val(trade_quantities[trade_key_default][0]);

    onMount(async () => {
        try {
            sel_key = trade_key_default;
            /*
            sel_key = trade_keys[0];
            sel_price_qty_amt = sel_key_parsed
                ? fmt_trade_quantity_val(trade_quantities[sel_key_parsed][0])
                : ``;
                */
        } catch (e) {
        } finally {
        }
    });

    onMount(async () => {
        try {
        } catch (e) {
        } finally {
        }
    });

    const toggle_show_key_other = async (visible: boolean): Promise<void> => {
        try {
            show_sel_key_other = visible;
            if (visible) {
                await kv.set(fmt_id(`key`), ``);
            } else {
                sel_key = trade_keys[0];
            }
        } catch (e) {
            console.log(`(error) toggle_show_key_other `, e);
        }
    };

    const toggle_show_price_qty_amt_other = async (
        visible: boolean,
    ): Promise<void> => {
        try {
            show_sel_price_qty_amt_other = visible;
            if (visible) {
                sel_price_qty_unit = mass_units[0];
                await kv.set(fmt_id(`price_qty_amt`), ``);
            } else {
                sel_price_qty_amt = sel_key_parsed
                    ? fmt_trade_quantity_val(
                          trade_quantities[sel_key_parsed][0],
                      )
                    : ``;
            }
        } catch (e) {
            console.log(`(error) toggle_show_price_qty_amt_other `, e);
        }
    };

    const submit = async (): Promise<void> => {
        try {
            loading_submit = true;

            const res = await trade_product_submit_preview(fmt_id());

            console.log(JSON.stringify(res, null, 4), `res`);
        } catch (e) {
            console.log(`(error) submit `, e);
        } finally {
            loading_submit = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <LayoutTrellisLine
            basis={{
                label: {
                    value: `Product`,
                },
                notify: show_sel_key_other
                    ? {
                          classes: `w-full justify-end`,
                          label: {
                              classes: `text-xs font-[600]`,
                              value: `Show Options`,
                          },
                          callback: async () => {
                              await toggle_show_key_other(false);
                          },
                      }
                    : undefined,
            }}
        >
            {#if show_sel_key_other}
                <div
                    class={`relative flex flex-row w-full justify-center items-center`}
                >
                    <InputForm
                        basis={{
                            id: fmt_id(`key`),
                            sync: true,
                            placeholder: `Enter the product name`,
                            field: {
                                charset: trade_product_form_fields.key.charset,
                                validate:
                                    trade_product_form_fields.key.validation,
                                validate_keypress: true,
                            },
                        }}
                    />
                </div>
            {:else}
                <InputSelect
                    bind:value={sel_key}
                    basis={{
                        id: fmt_id(`key`),
                        sync: true,
                        options: [
                            ...trade_keys.map((i) => ({
                                value: i,
                                label: `${$t(`trade.product.key.${i}`, { default: i })}`,
                            })),
                            {
                                value: `other`,
                                label: `${$t(`common.other`)}`,
                            },
                        ],
                        callback: async (val) => {
                            if (val === `other`) {
                                await toggle_show_key_other(true);
                            }
                        },
                    }}
                />
            {/if}
        </LayoutTrellisLine>
        <LayoutTrellisLine
            basis={{
                label: {
                    value: `Quantity`,
                },
                notify: show_sel_price_qty_amt_other
                    ? {
                          classes: `w-full justify-end`,
                          label: {
                              classes: `text-xs font-[600]`,
                              value: `Show Options`,
                          },
                          callback: async () => {
                              await toggle_show_price_qty_amt_other(false);
                          },
                      }
                    : undefined,
            }}
        >
            <div
                class={`relative flex flex-row w-full gap-3 justify-between items-center h-form_line bg-layer-1-surface text-layer-1-glyph/70 rounded-2xl transition-all`}
            >
                {#if show_sel_price_qty_amt_other}
                    <div
                        class={`relative flex flex-row w-full justify-center items-center`}
                    >
                        <InputForm
                            basis={{
                                id: fmt_id(`price_qty_amt`),
                                layer: false,
                                sync: true,
                                placeholder: `Enter number of ${$t(`trade.quantity.mass_unit.${sel_price_qty_unit}_ab`, { default: sel_price_qty_unit })} per order`,
                                field: {
                                    charset:
                                        trade_product_form_fields.price_qty_amt
                                            .charset,
                                    validate:
                                        trade_product_form_fields.price_qty_amt
                                            .validation,
                                    validate_keypress: true,
                                },
                            }}
                        />
                        <div
                            class={`absolute top-0 right-0 flex flex-row h-full gap-2 justify-center items-center`}
                        >
                            <InputSelect
                                bind:value={sel_price_qty_unit}
                                basis={{
                                    id: fmt_id(`price_qty_unit`),
                                    classes: `w-16 text-layer-1-glyph/70 font-[500]`,
                                    layer: false,
                                    sync: true,
                                    options: mass_units.map((i) => ({
                                        value: i,
                                        label: `${$t(`trade.quantity.mass_unit.${i}_ab`, { default: i })}`,
                                    })),
                                }}
                            />
                        </div>
                    </div>
                {:else}
                    <InputSelect
                        bind:value={sel_price_qty_amt}
                        basis={{
                            id: fmt_id(`price_qty_tup`),
                            sync: true,
                            options: [
                                ...ls_trade_product_quantities.map((i) => ({
                                    value: `${i.qty_amt}-${i.qty_unit}`,
                                    label: `${i.qty_amt} ${$t(`trade.quantity.mass_unit.${i.qty_unit}_ab`, { default: i.qty_unit })}${i.label ? ` ${i.label}` : ``}`,
                                })),
                                {
                                    value: `other`,
                                    label: `${$t(`common.other`)}`,
                                },
                            ],
                            callback: async (val) => {
                                if (val === `other`) {
                                    await toggle_show_price_qty_amt_other(true);
                                }
                            },
                        }}
                    />
                {/if}
            </div>
        </LayoutTrellisLine>
        <div class={`flex flex-row w-full pt-4 justify-end items-center`}>
            <ButtonSubmit
                basis={{
                    loading: loading_submit,
                    label: `preview`,
                    callback: async () => {
                        await submit();
                    },
                }}
            />
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Back`,
            route: `/models/trade-product`,
            callback: async () => {
                await trade_product_kv_init(fmt_id());
            },
        },
        title: {
            label: `Add Product`,
        },
        option: {
            label: {
                value: `Preview`,
                classes: `text-layer-1-glyph-hl tap-scale`,
            },
            callback: async () => {
                alert(`@todo!`);
            },
        },
    }}
/>
