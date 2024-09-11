<script lang="ts">
    import { lc } from "$lib/client";
    import LayoutTrellisLine from "$lib/components/layout-trellis-line.svelte";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { location_gcs_add } from "$lib/utils/location_gcs";
    import {
        trade_product_kv_init,
        trade_product_kv_vals,
    } from "$lib/utils/trade_product";
    import {
        mass_units,
        trade_product_form_fields,
        type LocationGcs,
    } from "@radroots/client";
    import {
        fmt_id,
        InputForm,
        InputSelect,
        kv,
        Nav,
        NotifyGlyph,
        sleep,
        t,
    } from "@radroots/svelte-lib";
    import {
        fiat_currencies,
        fmt_trade_quantity_val,
        parse_trade_key,
        parse_trade_mass_tuple,
        trade_keys,
        trade_quantities,
        type TradeKey,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    const trade_key_default: TradeKey = `coffee`;

    let el_trellis_wrap_1: HTMLElement | null;

    let loading_submit = false;
    let loading_location = false;

    let sel_key: string = trade_key_default;
    let show_sel_key_other = false;

    let sel_location_gcs_id = ``;
    let ls_location_gcs: LocationGcs[] = [];

    let sel_qty_tup = ``;
    let sel_price_qty_unit = ``;
    let show_sel_qty_tup_other = false;

    let sel_price_currency = ``;
    let show_sel_price_currency = false;

    let sel_qty_unit = ``;

    $: sel_key_parsed = parse_trade_key(sel_key);
    $: ls_trade_product_quantities = sel_key_parsed
        ? trade_quantities[sel_key_parsed]
        : trade_quantities[trade_key_default];

    $: sel_qty_tup = sel_key_parsed
        ? fmt_trade_quantity_val(trade_quantities[sel_key_parsed][0])
        : fmt_trade_quantity_val(trade_quantities[trade_key_default][0]);

    $: {
        if (ls_location_gcs.length && !sel_location_gcs_id) {
            sel_location_gcs_id = ls_location_gcs[0].id;
        }
    }

    $: {
        if (sel_location_gcs_id) {
            (async () => {
                try {
                    await kv.set(
                        fmt_id(`location_gcs_id`),
                        sel_location_gcs_id,
                    );
                } catch (e) {
                    console.log(`e `, e);
                }
            })();
        }
    }

    $: {
        if (sel_qty_tup) {
            (async () => {
                try {
                    const tup = parse_trade_mass_tuple(sel_qty_tup);
                    console.log(`tup `, tup);
                    if (tup) {
                        await kv.set(fmt_id(`qty_amt`), tup[0].toString());
                        await kv.set(fmt_id(`qty_unit`), tup[1]);
                        await kv.set(fmt_id(`qty_label`), tup[2]);
                    }
                } catch (e) {
                    console.log(`e `, e);
                }
            })();
        }
    }

    onMount(async () => {
        try {
            sel_price_currency = "usd";
            sel_price_qty_unit = "kg";
            sel_qty_unit = "kg";
            await fetch_models_location_gcs();
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

    const toggle_show_qty_amt_other = async (
        visible: boolean,
    ): Promise<void> => {
        try {
            show_sel_qty_tup_other = visible;
            if (visible) {
                sel_price_qty_unit = mass_units[0];
                await kv.set(fmt_id(`qty_amt`), ``);
            } else {
                sel_qty_tup = sel_key_parsed
                    ? fmt_trade_quantity_val(
                          trade_quantities[sel_key_parsed][0],
                      )
                    : ``;
            }
        } catch (e) {
            console.log(`(error) toggle_show_qty_amt_other `, e);
        }
    };

    const fetch_models_location_gcs = async (): Promise<void> => {
        try {
            const res = await lc.db.location_gcs_get({
                list: [`all`],
            });
            if (typeof res !== `string`) ls_location_gcs = res;
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
            loading_submit = true;

            const location_gcs_res = await lc.db.location_gcs_get({
                id: sel_location_gcs_id,
            });

            if (typeof location_gcs_res === `string`) {
                await lc.dialog.alert(`The product location is missing.`);
                return;
            }

            const vals = await trade_product_kv_vals(fmt_id());
            if (!vals) {
                alert(`@todo!`);
                return;
            }
            if (!vals.year) vals.year = new Date().getFullYear().toString();
            if (!vals.price_qty_amt) vals.price_qty_amt = `1`;

            console.log(JSON.stringify(vals, null, 4), `vals`);

            await sleep(1000);
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
                    value: `Location`,
                },
            }}
        >
            <InputSelect
                bind:value={sel_location_gcs_id}
                basis={{
                    id: fmt_id(`location_gcs_id`),
                    sync: true,
                    loading: loading_location,
                    options: ls_location_gcs.length
                        ? [
                              ...ls_location_gcs.map((i) => ({
                                  value: i.id,
                                  label: `${i.label}`,
                              })),
                              {
                                  value: `add-new`,
                                  label: `${$t(`common.add_current_location`)}`,
                              },
                          ]
                        : [
                              {
                                  value: ``,
                                  disabled: true,
                                  selected: true,
                                  label: `${$t(`common.no_locations_saved`)}`,
                              },
                              {
                                  value: `add-new`,
                                  label: `${$t(`common.add_current_location`)}`,
                              },
                          ],
                    callback: async (val) => {
                        console.log(`val `, val);
                        if (val === `add-new`) {
                            sel_location_gcs_id = ``;
                            await add_model_location_gcs();
                        }
                    },
                }}
            />
        </LayoutTrellisLine>
        <LayoutTrellisLine
            basis={{
                label: {
                    value: `Quantity`,
                },
                notify: show_sel_qty_tup_other
                    ? {
                          classes: `w-full justify-end`,
                          label: {
                              value: `Show Options`,
                          },
                          callback: async () => {
                              await toggle_show_qty_amt_other(false);
                          },
                      }
                    : undefined,
            }}
        >
            <div
                class={`relative flex flex-row w-full gap-3 justify-between items-center h-form_line bg-layer-1-surface text-layer-1-glyph/70 rounded-2xl transition-all`}
            >
                {#if show_sel_qty_tup_other}
                    <div
                        class={`relative flex flex-row w-full justify-center items-center`}
                    >
                        <InputForm
                            basis={{
                                id: fmt_id(`qty_amt`),
                                layer: false,
                                sync: true,
                                placeholder: `Enter number of ${$t(`trade.quantity.mass_unit.${sel_price_qty_unit}_ab`, { default: sel_price_qty_unit })} per order`,
                                field: {
                                    charset:
                                        trade_product_form_fields.qty_amt
                                            .charset,
                                    validate:
                                        trade_product_form_fields.qty_amt
                                            .validation,
                                    validate_keypress: true,
                                },
                            }}
                        />
                        <div
                            class={`absolute top-0 right-0 flex flex-row h-full gap-2 justify-center items-center`}
                        >
                            <InputSelect
                                bind:value={sel_qty_unit}
                                basis={{
                                    id: fmt_id(`qty_unit`),
                                    classes: `w-[3.5rem] text-layer-1-glyph/70 font-[500]`,
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
                        bind:value={sel_qty_tup}
                        basis={{
                            options: [
                                ...ls_trade_product_quantities.map((i) => ({
                                    value: fmt_trade_quantity_val(i),
                                    label: `${i.mass} ${$t(`trade.quantity.mass_unit.${i.mass_unit}_ab`, { default: i.mass_unit })} ${i.label}`,
                                })),
                                {
                                    value: `other`,
                                    label: `${$t(`common.other`)}`,
                                },
                            ],
                            callback: async (val) => {
                                if (val === `other`) {
                                    await toggle_show_qty_amt_other(true);
                                }
                            },
                        }}
                    />
                {/if}
            </div>
        </LayoutTrellisLine>
        <LayoutTrellisLine
            basis={{
                label: {
                    value: `Price`,
                },
            }}
        >
            <div
                bind:this={el_trellis_wrap_1}
                class={`relative flex flex-row w-full gap-3 justify-between items-center h-form_line bg-layer-1-surface text-layer-1-glyph/70 rounded-2xl transition-all`}
            >
                <InputForm
                    basis={{
                        id: fmt_id(`price_amt`),
                        layer: false,
                        sync: true,
                        placeholder: `Enter price`,
                        field: {
                            charset:
                                trade_product_form_fields.price_amt.charset,
                            validate:
                                trade_product_form_fields.price_amt.validation,
                            validate_keypress: true,
                        },
                        callback: async ({ val, pass }) => {
                            const lastchar = val[val.length - 1];
                            const period_count = val.split(".").length - 1;
                            if (
                                (pass &&
                                    lastchar !== `.` &&
                                    period_count < 2) ||
                                val.length < 1
                            ) {
                                el_trellis_wrap_1?.classList.remove(
                                    `bg-layer-1-surface-err`,
                                );
                                show_sel_price_currency = false;
                            } else {
                                el_trellis_wrap_1?.classList.add(
                                    `bg-layer-1-surface-err`,
                                );
                                show_sel_price_currency = true;
                            }
                        },
                    }}
                />
                <div
                    class={`flex flex-row gap-2 pr-4 justify-end items-center`}
                >
                    <InputSelect
                        bind:value={sel_price_currency}
                        basis={{
                            id: fmt_id(`price_currency`),
                            classes: `w-fit`,
                            layer: false,
                            hide_arrows: true,
                            sync: true,
                            options: fiat_currencies.map((i) => ({
                                value: i,
                                label: `${$t(`trade.currency.${i}.symbol`, { default: i })}`,
                            })),
                        }}
                    />
                    <p
                        class={`font-sans font-[500] text-layer-1-glyph/60 text-lg -translate-y-[1px]`}
                    >
                        {`/`}
                    </p>
                    <InputSelect
                        bind:value={sel_price_qty_unit}
                        basis={{
                            id: fmt_id(`price_qty_unit`),
                            classes: `w-fit`,
                            layer: false,
                            hide_arrows: true,
                            sync: true,
                            options: mass_units.map((i) => ({
                                value: i,
                                label: `${$t(`trade.quantity.mass_unit.${i}_ab`, { default: i })}`,
                            })),
                        }}
                    />
                </div>
                {#if show_sel_price_currency}
                    <NotifyGlyph
                        basis={{ glyph: `warning-circle`, layer: 2 }}
                    />
                {/if}
            </div>
        </LayoutTrellisLine>
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
            loading: loading_submit,
            label: {
                value: `Preview`,
                classes: `text-layer-1-glyph-hl tap-scale`,
            },
            callback: async () => {
                await submit();
            },
        },
    }}
/>
