<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<script lang="ts">
    import { lc } from "$lib/client";
    import MapChooseLocation from "$lib/components/map_choose_location.svelte";
    import { _conf } from "$lib/conf";
    import { location_gcs_add_current } from "$lib/utils/location_gcs";
    import {
        trade_product_kv_init,
        validate_trade_product_vals,
    } from "$lib/utils/trade_product";
    import type { GeocoderReverseResult } from "@radroots/geocoder";
    import {
        mass_units,
        trade_product_form_fields,
        type LocationGcs,
        type TradeProductFormFields,
    } from "@radroots/models";
    import {
        carousel_index,
        carousel_index_max,
        carousel_next,
        carousel_prev,
        el_id,
        Fill,
        fmt_id,
        Glyph,
        InputForm,
        InputSelect,
        int_step,
        kv,
        LayoutTrellis,
        LayoutTrellisLine,
        LayoutView,
        locale,
        Nav,
        NotifyGlyph,
        sleep,
        t,
        TextareaElement,
        view_effect,
    } from "@radroots/svelte-lib";
    import {
        fiat_currencies,
        fmt_trade_quantity_val,
        parse_currency_price,
        parse_trade_key,
        parse_trade_mass_tuple,
        trade_keys,
        trade_quantities,
        type CurrencyPrice,
        type GeolocationCoordinatesPoint,
        type TradeKey,
    } from "@radroots/utils";
    import { onMount } from "svelte";

    const trade_key_default: TradeKey = `coffee`;

    type CarouselConf = {
        label_prev?: string;
        label_next: string;
    };
    const carousel_conf = new Map<number, CarouselConf>([
        [
            0,
            {
                label_next: `Preview`,
            },
        ],
        [
            1,
            {
                label_next: `Listing`,
            },
        ],
        [
            2,
            {
                label_next: `Location`,
            },
        ],
        [
            3,
            {
                label_next: `Review`,
            },
        ],
        [
            4,
            {
                label_next: `Post`,
            },
        ],
    ]);

    let el_trellis_wrap_price: HTMLElement | null;

    type View = `load` | `form_1` | `map`;
    let view: View = `load`;

    $: {
        view_effect<View>(view);
    }

    $: {
        if (view === `map`) {
            (async () => {
                try {
                    loading_map = true;
                    await sleep(500);
                    loading_map = false;
                } catch (e) {}
            })();
        }
    }

    let show_sel_trade_product_key_other = false;
    let sel_trade_product_key: string = trade_key_default;
    $: sel_trade_product_key_parsed = parse_trade_key(sel_trade_product_key);
    $: ls_trade_product_quantities = sel_trade_product_key_parsed
        ? trade_quantities[sel_trade_product_key_parsed]
        : trade_quantities[trade_key_default];

    let sel_location_gcs_id = ``;
    let ls_models_location_gcs: LocationGcs[] = [];
    let map_point_location_gcs: GeolocationCoordinatesPoint =
        _conf.map.coords.default;
    let map_point_location_gcs_select: GeolocationCoordinatesPoint =
        _conf.map.coords.default;
    let map_point_location_gcs_select_geoc: GeocoderReverseResult | undefined =
        undefined;

    let show_sel_trade_product_qty_tup_other = false;
    let sel_trade_product_qty_tup = ``;

    let show_sel_trade_product_price_currency = false;
    let sel_trade_product_price_currency = ``;
    let sel_trade_product_price_qty_unit = ``;

    let sel_trade_product_qty_unit = ``;

    let preview_trade_product: TradeProductFormFields | undefined = undefined;
    let preview_trade_product_qty_avail = 0;

    let review_trade_product: TradeProductFormFields | undefined = undefined;
    let review_location_gcs: LocationGcs | undefined = undefined;

    let loading_submit = false;
    let loading_map = false;
    let loading_location_gcs = false;

    $: num_trade_product_qty_amt = preview_trade_product
        ? Number(preview_trade_product.qty_amt)
        : 0;

    $: num_trade_product_price_amt = preview_trade_product
        ? Number(preview_trade_product.price_amt)
        : 0;

    $: num_trade_product_price_total =
        num_trade_product_price_amt *
        num_trade_product_qty_amt *
        preview_trade_product_qty_avail;

    let preview_trade_product_price_currency: CurrencyPrice | undefined =
        undefined;
    $: preview_trade_product_price_currency =
        preview_trade_product && num_trade_product_price_amt > 0
            ? parse_currency_price(
                  $locale,
                  preview_trade_product.price_currency,
                  num_trade_product_price_amt,
              )
            : undefined;

    $: sel_trade_product_qty_tup = sel_trade_product_key_parsed
        ? fmt_trade_quantity_val(
              trade_quantities[sel_trade_product_key_parsed][0],
          )
        : fmt_trade_quantity_val(trade_quantities[trade_key_default][0]);

    $: {
        if (ls_models_location_gcs.length && !sel_location_gcs_id) {
            sel_location_gcs_id = ls_models_location_gcs[0].id;
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
                } catch (e) {}
            })();
        }
    }

    $: {
        if (sel_trade_product_qty_tup) {
            (async () => {
                try {
                    const mass_tup = parse_trade_mass_tuple(
                        sel_trade_product_qty_tup,
                    );
                    if (mass_tup) {
                        await kv.set(fmt_id(`qty_amt`), mass_tup[0].toString());
                        await kv.set(fmt_id(`qty_unit`), mass_tup[1]);
                        await kv.set(fmt_id(`qty_label`), mass_tup[2]);
                        //@note
                        await kv.set(fmt_id(`qty_avail`), `1`);
                    }
                } catch (e) {}
            })();
        }
    }

    $: {
        if (sel_trade_product_price_currency) {
            (async () => {
                try {
                    await kv.set(
                        fmt_id(`price_currency`),
                        sel_trade_product_price_currency,
                    );
                } catch (e) {}
            })();
        }
    }

    onMount(async () => {
        try {
            carousel_index.set(0);
            carousel_index_max.set(Array.from(carousel_conf.keys()).length - 1);

            sel_trade_product_price_currency = "eur";
            sel_trade_product_price_qty_unit = "kg";
            sel_trade_product_qty_unit = "kg";
            await fetch_models_models_location_gcs();
        } catch (e) {
        } finally {
            view = `form_1`;
        }
    });

    carousel_index.subscribe(async (_carousel_index) => {
        if (_carousel_index === 1) {
            const kv_qty_avail = await kv.get(fmt_id(`qty_avail`));
            if (isNaN(kv_qty_avail)) preview_trade_product_qty_avail = 1;
            else preview_trade_product_qty_avail = Number(kv_qty_avail);
        }
    });

    const handle_carousel_prev = async (): Promise<void> => {
        try {
            switch ($carousel_index) {
                case 1:
                    {
                        await carousel_prev(view);
                    }
                    break;
                case 2:
                    {
                        await carousel_prev(view);
                    }
                    break;
                case 3:
                    {
                        await carousel_prev(view);
                    }
                    break;
                case 4:
                    {
                        await carousel_prev(view);
                    }
                    break;
            }
        } catch (e) {
            console.log(`(error) handle_carousel_prev `, e);
        }
    };

    const handle_carousel_next = async (): Promise<void> => {
        try {
            switch ($carousel_index) {
                case 0:
                    {
                        const vals_init = await validate_trade_product_vals({
                            kv_pref: fmt_id(),
                            no_validation: [
                                `year`,
                                `price_qty_amt`,
                                `qty_avail`,
                                `summary`,
                                `title`,
                            ],
                        });
                        if (`err` in vals_init) {
                            await lc.dialog.alert(
                                `${$t(`trade.product.fields.${vals_init}.err_invalid`, { default: `${$t(`icu.invalid_*`, { value: vals_init.err })}` })}`,
                            );
                            return;
                        }

                        if (!vals_init.year)
                            await kv.set(
                                fmt_id(`year`),
                                new Date().getFullYear().toString(),
                            );
                        if (!vals_init.price_qty_amt)
                            await kv.set(fmt_id(`price_qty_amt`), `1`);
                        if (!vals_init.qty_avail)
                            await kv.set(fmt_id(`qty_avail`), `1`);

                        const vals = await validate_trade_product_vals({
                            kv_pref: fmt_id(),
                            no_validation: [`summary`, `title`],
                        });
                        if (`err` in vals) {
                            await lc.dialog.alert(`The entry is incomplete`);
                            return;
                        }
                        preview_trade_product = vals;
                        await carousel_next(view);
                    }
                    break;
                case 1:
                    {
                        await carousel_next(`form_1`);
                    }
                    break;
                case 2:
                    {
                        const vals = await validate_trade_product_vals({
                            kv_pref: fmt_id(),
                        });
                        if (`err` in vals) {
                            await lc.dialog.alert(`Enter the listing details`);
                            return;
                        }
                        await carousel_next(`form_1`);
                    }
                    break;
                case 3:
                    {
                        const location_gcs_kv_id = await kv.get(
                            fmt_id(`location_gcs_id`),
                        );
                        if (!location_gcs_kv_id) {
                            await lc.dialog.alert(
                                `The product location is missing`,
                            );
                            return;
                            //@todo
                        }
                        const location_gcs_get = await lc.db.location_gcs_get({
                            id: location_gcs_kv_id,
                        });
                        if (`err` in location_gcs_get) {
                            await lc.dialog.alert(
                                `The product location is missing`,
                            );
                            preview_trade_product = undefined;
                            return;
                            //@todo
                        } else if (location_gcs_get.results.length < 1) {
                            await lc.dialog.alert(
                                `The product location is missing`,
                            );
                            preview_trade_product = undefined;
                            return;
                            //@todo
                        }
                        review_location_gcs = location_gcs_get.results[0];
                        const vals = await validate_trade_product_vals({
                            kv_pref: fmt_id(),
                        });
                        if (`err` in vals) {
                            await lc.dialog.alert(`The entry is incomplete`);
                            return;
                            //@todo
                        }
                        review_trade_product = vals;
                        await carousel_next(`form_1`);
                    }
                    break;
                case 4:
                    {
                        await submit();
                    }
                    break;
            }
        } catch (e) {
            console.log(`(error) handle_carousel_next `, e);
        }
    };

    const toggle_show_key_other = async (visible: boolean): Promise<void> => {
        try {
            show_sel_trade_product_key_other = visible;
            if (visible) {
                await kv.set(fmt_id(`key`), ``);
            } else {
                sel_trade_product_key = trade_keys[0];
            }
        } catch (e) {
            console.log(`(error) toggle_show_key_other `, e);
        }
    };

    const toggle_show_qty_amt_other = async (
        visible: boolean,
    ): Promise<void> => {
        try {
            show_sel_trade_product_qty_tup_other = visible;
            if (visible) {
                sel_trade_product_price_qty_unit = mass_units[0];
                await kv.set(fmt_id(`qty_amt`), ``);
            } else {
                sel_trade_product_qty_tup = sel_trade_product_key_parsed
                    ? fmt_trade_quantity_val(
                          trade_quantities[sel_trade_product_key_parsed][0],
                      )
                    : ``;
            }
        } catch (e) {
            console.log(`(error) toggle_show_qty_amt_other `, e);
        }
    };

    const fetch_models_models_location_gcs = async (): Promise<void> => {
        try {
            const res = await lc.db.location_gcs_get({
                list: [`all`],
            });
            if (`results` in res) ls_models_location_gcs = res.results;
        } catch (e) {
            console.log(`(error) fetch_models_models_location_gcs `, e);
        }
    };

    const add_model_location_gcs = async (): Promise<void> => {
        try {
            loading_location_gcs = true;
            await location_gcs_add_current();
            await fetch_models_models_location_gcs();
        } catch (e) {
            console.log(`(error) add_model_location_gcs `, e);
        } finally {
            loading_location_gcs = false;
        }
    };

    const submit = async (): Promise<void> => {
        try {
            loading_submit = true;
        } catch (e) {
            console.log(`(error) submit `, e);
        } finally {
            loading_submit = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <div
            data-view={`load`}
            class={`flex flex-col h-full w-full justify-start items-start`}
        >
            <Fill />
        </div>
        <div
            data-view={`form_1`}
            data-carousel-container={`form_1`}
            class={`hidden carousel-container carousel-container-trellis`}
        >
            <div
                data-carousel-item={`form_1`}
                class={`carousel-item carousel-item-trellis`}
            >
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`common.product`)}`,
                        },
                        notify: show_sel_trade_product_key_other
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
                    {#if show_sel_trade_product_key_other}
                        <div
                            class={`relative flex flex-row w-full justify-center items-center`}
                        >
                            <InputForm
                                basis={{
                                    id: fmt_id(`key`),
                                    sync: true,
                                    placeholder: `${$t(`icu.enter_the_*`, { value: `${$t(`common.product_name`)}`.toLowerCase() })}`,

                                    field: {
                                        charset:
                                            trade_product_form_fields.key
                                                .charset,
                                        validate:
                                            trade_product_form_fields.key
                                                .validation,
                                        validate_keypress: true,
                                    },
                                }}
                            />
                        </div>
                    {:else}
                        <InputSelect
                            bind:value={sel_trade_product_key}
                            basis={{
                                id_wrap: fmt_id(`key_wrap`),
                                id: fmt_id(`key`),
                                classes: `font-mono-display`,
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
                            value: `${$t(`common.price`)}`,
                        },
                    }}
                >
                    <div
                        bind:this={el_trellis_wrap_price}
                        id={fmt_id(`price_wrap`)}
                        tabindex={-1}
                        class={`relative form-line-active flex flex-row w-full gap-3 justify-between items-center h-form_line bg-layer-1-surface text-layer-1-glyph rounded-2xl transition-all`}
                    >
                        <InputForm
                            basis={{
                                id: fmt_id(`price_amt`),
                                layer: false,
                                sync: true,
                                sync_init: false,
                                classes: `font-mono-display`,
                                placeholder: `Enter price`,
                                field: {
                                    charset:
                                        trade_product_form_fields.price_amt
                                            .charset,
                                    validate:
                                        trade_product_form_fields.price_amt
                                            .validation,
                                    validate_keypress: true,
                                },
                                callback: async ({ val, pass }) => {
                                    const lastchar = val[val.length - 1];
                                    const period_count =
                                        val.split(".").length - 1;
                                    if (
                                        (pass &&
                                            lastchar !== `.` &&
                                            period_count < 2) ||
                                        val.length < 1
                                    ) {
                                        el_trellis_wrap_price?.classList.remove(
                                            `bg-layer-1-surface-err`,
                                        );
                                        show_sel_trade_product_price_currency = false;
                                    } else {
                                        el_trellis_wrap_price?.classList.add(
                                            `bg-layer-1-surface-err`,
                                        );
                                        show_sel_trade_product_price_currency = true;
                                    }
                                },
                            }}
                        />
                        <div
                            class={`flex flex-row gap-2 pr-4 justify-end items-center text-layer-1-glyph/70`}
                        >
                            <InputSelect
                                bind:value={sel_trade_product_price_currency}
                                basis={{
                                    id: fmt_id(`price_currency`),
                                    classes: `w-fit font-mono-display font-[500] text-lg`,
                                    layer: false,
                                    hide_arrows: true,
                                    sync: true,
                                    options: fiat_currencies.map((i) => ({
                                        value: i,
                                        label: `${$t(`currency.${i}.symbol`, { default: i })}`,
                                    })),
                                }}
                            />
                            <p
                                class={`font-sans font-[500] text-[1.1rem] -translate-y-[1px] scale-y-[110%]`}
                            >
                                {`/`}
                            </p>
                            <InputSelect
                                bind:value={sel_trade_product_price_qty_unit}
                                basis={{
                                    id: fmt_id(`price_qty_unit`),
                                    classes: `w-fit font-mono-display font-[600] text-[0.95rem] leading-[1rem]`,
                                    layer: false,
                                    hide_arrows: true,
                                    sync: true,
                                    options: mass_units.map((i) => ({
                                        value: i,
                                        label: `${$t(`measurement.mass.unit.${i}_ab`, { default: i })}`,
                                    })),
                                }}
                            />
                        </div>
                        {#if show_sel_trade_product_price_currency}
                            <NotifyGlyph
                                basis={{
                                    glyph: `warning-circle`,
                                    layer: 2,
                                    classes: `translate-x-[32px]`,
                                }}
                            />
                        {/if}
                    </div>
                </LayoutTrellisLine>
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`common.quantity`)}`,
                        },
                        notify: show_sel_trade_product_qty_tup_other
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
                        id={fmt_id(`qty_wrap`)}
                        tabindex={-1}
                        class={`relative form-line-active flex flex-row w-full gap-3 justify-between items-center h-form_line bg-layer-1-surface text-layer-1-glyph rounded-2xl transition-all`}
                    >
                        {#if show_sel_trade_product_qty_tup_other}
                            <div
                                class={`relative flex flex-row w-full justify-center items-center`}
                            >
                                <InputForm
                                    basis={{
                                        id: fmt_id(`qty_amt`),
                                        layer: false,
                                        sync: true,
                                        placeholder: `Enter number of ${$t(`measurement.mass.unit.${sel_trade_product_price_qty_unit}_ab`, { default: sel_trade_product_price_qty_unit })} per order`,
                                        field: {
                                            charset:
                                                trade_product_form_fields
                                                    .qty_amt.charset,
                                            validate:
                                                trade_product_form_fields
                                                    .qty_amt.validation,
                                            validate_keypress: true,
                                        },
                                    }}
                                />
                                <div
                                    class={`absolute top-0 right-0 flex flex-row h-full gap-2 justify-center items-center`}
                                >
                                    <InputSelect
                                        bind:value={sel_trade_product_qty_unit}
                                        basis={{
                                            id: fmt_id(`qty_unit`),
                                            classes: `w-[3.5rem] text-layer-1-glyph font-[500]`,
                                            layer: false,
                                            sync: true,
                                            options: mass_units.map((i) => ({
                                                value: i,
                                                label: `${$t(`measurement.mass.unit.${i}_ab`, { default: i })}`,
                                            })),
                                        }}
                                    />
                                </div>
                            </div>
                        {:else}
                            <InputSelect
                                bind:value={sel_trade_product_qty_tup}
                                basis={{
                                    classes: `font-mono-display`,
                                    options: [
                                        ...ls_trade_product_quantities.map(
                                            (i) => ({
                                                value: fmt_trade_quantity_val(
                                                    i,
                                                ),
                                                label: `${i.mass} ${$t(`measurement.mass.unit.${i.mass_unit}_ab`, { default: i.mass_unit })} ${i.label}`,
                                            }),
                                        ),
                                        {
                                            value: `other`,
                                            label: `${$t(`common.other`)}`,
                                        },
                                    ],
                                    callback: async (val) => {
                                        if (val === `other`) {
                                            await toggle_show_qty_amt_other(
                                                true,
                                            );
                                        } else {
                                            await kv.set(
                                                fmt_id(`qty_avail`),
                                                `1`,
                                            );
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
                            value: `${$t(`common.lot`)}`,
                        },
                    }}
                >
                    <InputForm
                        basis={{
                            id: fmt_id(`lot`),
                            sync: true,
                            placeholder: `${$t(`icu.enter_the_*`, { value: `${$t(`common.lot_name`)}`.toLowerCase() })}`,
                            field: {
                                charset: trade_product_form_fields.lot.charset,
                                validate:
                                    trade_product_form_fields.lot.validation,
                                validate_keypress: true,
                            },
                        }}
                    />
                </LayoutTrellisLine>
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`model_fields.process`)}`,
                        },
                    }}
                >
                    <InputForm
                        basis={{
                            id: fmt_id(`process`),
                            sync: true,
                            placeholder: `Enter the process description`,
                            field: {
                                charset:
                                    trade_product_form_fields.process.charset,
                                validate:
                                    trade_product_form_fields.process
                                        .validation,
                                validate_keypress: true,
                            },
                        }}
                    />
                </LayoutTrellisLine>
            </div>
            <div
                data-carousel-item={`form_1`}
                class={`carousel-item carousel-item-trellis`}
            >
                {#if preview_trade_product && preview_trade_product_price_currency}
                    <LayoutTrellisLine
                        basis={{
                            label: {
                                value: `${$t(`icu.*_details`, { value: `${$t(`common.product`)}` })}`,
                            },
                        }}
                    >
                        <div
                            class={`relative flex flex-col h-[30rem] w-full px-4 py-2 gap-4 justify-around items-start bg-layer-1-surface rounded-3xl`}
                        >
                            <div
                                class={`flex flex-col w-full gap-5 justify-around items-center`}
                            >
                                <div
                                    class={`flex flex-col w-full gap-2 justify-start items-start`}
                                >
                                    <p
                                        class={`font-mono font-[400] text-layer-1-glyph`}
                                    >
                                        {`${$t(`common.product`)}:`}
                                    </p>
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row flex-grow gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph pr-2`}
                                            >
                                                {`-`}
                                            </p>

                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`${preview_trade_product.key}`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row justify-end items-center`}
                                        >
                                            <button
                                                class={`flex flex-row justify-start items-center active:opacity-60 transition-all`}
                                                on:click={async () => {
                                                    const el = el_id(
                                                        fmt_id(`key_wrap`),
                                                    );
                                                    if (el) el.focus();
                                                    await handle_carousel_prev();
                                                }}
                                            >
                                                <p
                                                    class={`font-mono font-[500] text-layer-2-glyph text-sm`}
                                                >
                                                    {`${$t(`common.edit`)}`}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class={`flex flex-col w-full gap-2 justify-start items-start`}
                                >
                                    <p
                                        class={`font-mono font-[400] text-layer-1-glyph`}
                                    >
                                        {`${$t(`common.price`)}:`}
                                    </p>
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row flex-grow gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph pr-2`}
                                            >
                                                {`-`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {preview_trade_product_price_currency.symbol}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`${(preview_trade_product_price_currency.val_i + preview_trade_product_price_currency.val_f).toFixed(2)}`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph lowercase`}
                                            >
                                                {`${$t(`common.per`)}`}
                                            </p>
                                            {#if preview_trade_product.price_qty_amt === `1`}
                                                <p
                                                    class={`font-mono font-[400] text-layer-2-glyph`}
                                                >
                                                    {`${$t(`measurement.mass.unit.${preview_trade_product.price_qty_unit}_ab`, { default: preview_trade_product.price_qty_unit })}`}
                                                </p>
                                            {/if}
                                        </div>
                                        <div
                                            class={`flex flex-row justify-end items-center`}
                                        >
                                            <button
                                                class={`flex flex-row justify-start items-center active:opacity-60 transition-all`}
                                                on:click={async () => {
                                                    const el = el_id(
                                                        fmt_id(`price_wrap`),
                                                    );
                                                    if (el) el.focus();
                                                    await handle_carousel_prev();
                                                }}
                                            >
                                                <p
                                                    class={`font-mono font-[500] text-layer-2-glyph text-sm`}
                                                >
                                                    {`${$t(`common.edit`)}`}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class={`flex flex-col w-full gap-2 justify-start items-start`}
                                >
                                    <p
                                        class={`font-mono font-[400] text-layer-1-glyph`}
                                    >
                                        {`${$t(`common.quantity`)}:`}
                                    </p>
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row flex-grow gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph pr-2`}
                                            >
                                                {`-`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {preview_trade_product.qty_amt}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`${$t(`measurement.mass.unit.${preview_trade_product.qty_unit}_ab`, { default: preview_trade_product.qty_unit })}`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {preview_trade_product.qty_label}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row justify-end items-center`}
                                        >
                                            <button
                                                class={`flex flex-row justify-start items-center active:opacity-60 transition-all`}
                                                on:click={async () => {
                                                    const el = el_id(
                                                        fmt_id(`qty_wrap`),
                                                    );
                                                    if (el) el.focus();
                                                    await handle_carousel_prev();
                                                }}
                                            >
                                                <p
                                                    class={`font-mono font-[500] text-layer-2-glyph text-sm`}
                                                >
                                                    {`${$t(`common.edit`)}`}
                                                </p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class={`flex flex-col w-full gap-2 justify-start items-start`}
                                >
                                    <p
                                        class={`font-mono font-[400] text-layer-1-glyph`}
                                    >
                                        {`${$t(`icu.*_available`, { value: `${$t(`common.quantity`)}` })}:`}
                                    </p>
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row flex-grow gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph pr-2`}
                                            >
                                                {`-`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`${preview_trade_product_qty_avail} ${preview_trade_product.qty_label}`}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`(${(preview_trade_product_qty_avail * num_trade_product_qty_amt).toFixed(2)} ${$t(`measurement.mass.unit.${preview_trade_product.qty_unit}_ab`, { default: preview_trade_product.qty_unit })})`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row gap-[10px] justify-center items-center`}
                                        >
                                            <Glyph
                                                basis={{
                                                    key: `arrow-down`,
                                                    dim: `xs`,
                                                    weight: `bold`,
                                                    classes: `h-6 w-6 text-layer-2-glyph bg-layer-2-surface active:opacity-60 rounded-full transition-all`,
                                                    callback: async () => {
                                                        preview_trade_product_qty_avail =
                                                            int_step(
                                                                preview_trade_product_qty_avail,
                                                                `-`,
                                                                1,
                                                            );
                                                        await kv.set(
                                                            fmt_id(`qty_avail`),
                                                            preview_trade_product_qty_avail.toString(),
                                                        );
                                                    },
                                                }}
                                            />
                                            <Glyph
                                                basis={{
                                                    key: `arrow-up`,
                                                    dim: `xs`,
                                                    weight: `bold`,
                                                    classes: `h-6 w-6 text-layer-2-glyph bg-layer-2-surface active:opacity-60 rounded-full transition-all`,
                                                    callback: async () => {
                                                        preview_trade_product_qty_avail =
                                                            int_step(
                                                                preview_trade_product_qty_avail,
                                                                `+`,
                                                            );
                                                        await kv.set(
                                                            fmt_id(`qty_avail`),
                                                            preview_trade_product_qty_avail.toString(),
                                                        );
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class={`flex flex-row w-full justify-start items-center`}
                            >
                                <div
                                    class={` flex flex-row h-[1px] w-full justify-start items-center bg-layer-2-surface`}
                                >
                                    <Fill />
                                </div>
                            </div>
                            <div
                                class={`flex flex-col w-full gap-4 justify-start items-start`}
                            >
                                <div
                                    class={`flex flex-col w-full gap-4 justify-start items-start`}
                                >
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-1-glyph text-lg`}
                                            >
                                                {`${`${$t(`common.quantity`)}`}:`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[500] text-layer-1-glyph/80 text-lg`}
                                            >
                                                {preview_trade_product_qty_avail}
                                            </p>
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {`x`}
                                            </p>
                                            <p
                                                class={`font-mono font-[500] text-layer-1-glyph/80 text-lg`}
                                            >
                                                {`${num_trade_product_qty_amt.toFixed(2)} ${$t(`measurement.mass.unit.${preview_trade_product.qty_unit}_ab`, { default: preview_trade_product.qty_unit })}`}
                                            </p>
                                            <p
                                                class={`font-mono font-[500] text-layer-1-glyph/80 text-lg`}
                                            >
                                                {preview_trade_product.qty_label}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        class={`flex flex-row w-full justify-between items-center`}
                                    >
                                        <div
                                            class={`flex flex-row justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-1-glyph text-lg`}
                                            >
                                                {`${$t(`icu.total_*`, { value: `${$t(`common.price`)}`.toLowerCase() })}:`}
                                            </p>
                                        </div>
                                        <div
                                            class={`flex flex-row gap-2 justify-start items-center`}
                                        >
                                            <p
                                                class={`font-mono font-[400] text-layer-2-glyph`}
                                            >
                                                {preview_trade_product_price_currency.symbol}
                                            </p>
                                            <p
                                                class={`font-mono font-[600] text-layer-1-glyph/80 text-lg`}
                                            >
                                                {num_trade_product_price_total.toFixed(
                                                    2,
                                                )}
                                            </p>
                                            <p
                                                class={`font-mono font-[600] text-layer-1-glyph/80 text-lg uppercase`}
                                            >
                                                {preview_trade_product_price_currency.currency}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LayoutTrellisLine>
                {/if}
            </div>
            <div
                data-carousel-item={`form_1`}
                class={`carousel-item carousel-item-trellis`}
            >
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`common.title`)}`,
                        },
                    }}
                >
                    <InputForm
                        basis={{
                            id: fmt_id(`title`),
                            sync: true,
                            placeholder: `${$t(`icu.enter_the_*`, { value: `${$t(`icu.listing_*`, { value: `${$t(`common.title`)}` })}`.toLowerCase() })}`,
                            field: {
                                charset:
                                    trade_product_form_fields.title.charset,
                                validate:
                                    trade_product_form_fields.title.validation,
                                validate_keypress: true,
                            },
                        }}
                    />
                </LayoutTrellisLine>
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`common.summary`)}`,
                        },
                    }}
                >
                    <TextareaElement
                        basis={{
                            classes: `h-[25rem] p-4 rounded-3xl`,
                            id: fmt_id(`summary`),
                            sync: true,
                            placeholder: `${$t(`icu.enter_the_*`, { value: `${$t(`icu.listing_*`, { value: `${$t(`common.summary`)}` })}`.toLowerCase() })}`,
                            field: {
                                charset:
                                    trade_product_form_fields.summary.charset,
                                validate:
                                    trade_product_form_fields.summary
                                        .validation,
                                validate_keypress: true,
                            },
                        }}
                    />
                </LayoutTrellisLine>
            </div>
            <div
                data-carousel-item={`form_1`}
                class={`carousel-item carousel-item-trellis`}
            >
                <LayoutTrellisLine
                    basis={{
                        label: {
                            value: `${$t(`common.location`)}`,
                        },
                    }}
                >
                    <InputSelect
                        bind:value={sel_location_gcs_id}
                        basis={{
                            id_wrap: fmt_id(`location_gcs_id_wrap`),
                            id: fmt_id(`location_gcs_id`),
                            classes: `font-mono-display`,
                            sync: true,
                            loading: loading_location_gcs,
                            options: ls_models_location_gcs.length
                                ? [
                                      ...ls_models_location_gcs.map((i) => ({
                                          value: i.id,
                                          label: `${i.label}`,
                                      })),
                                      {
                                          value: `add-new`,
                                          label: `${$t(`common.add_current_location`)}`,
                                      },
                                      {
                                          value: `add-map`,
                                          label: `${$t(`common.add_map_location`)}`,
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
                                      {
                                          value: `add-map`,
                                          label: `${$t(`common.add_map_location`)}`,
                                      },
                                  ],
                            callback: async (val) => {
                                if (val === `add-new`) {
                                    sel_location_gcs_id = ``;
                                    await add_model_location_gcs();
                                } else if (val === `add-map`) {
                                    sel_location_gcs_id = ``;
                                    view = `map`;
                                    //await route(`/map/choose-location`);
                                }
                            },
                        }}
                    />
                </LayoutTrellisLine>
            </div>
            <div
                data-carousel-item={`form_1`}
                class={`carousel-item carousel-item-trellis`}
            >
                <div class={`flex flex-col gap-8 justify-start items-center`}>
                    <div
                        class={`flex flex-col gap-2 justify-start items-center`}
                    >
                        <p class={`font-sans font-[400] text-layer-0-glyph`}>
                            {`Trade Product`}
                        </p>
                        <div
                            class={`flex flex-row w-trellis_line justify-start items-start`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {JSON.stringify(review_trade_product, null, 4)}
                            </p>
                        </div>
                    </div>
                    <div
                        class={`flex flex-col gap-2 justify-start items-center`}
                    >
                        <p class={`font-sans font-[400] text-layer-0-glyph`}>
                            {`Location`}
                        </p>
                        <div
                            class={`flex flex-row w-trellis_line justify-start items-start`}
                        >
                            <p
                                class={`font-sans font-[400] text-layer-0-glyph`}
                            >
                                {JSON.stringify(review_location_gcs, null, 4)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            data-view={`map`}
            class={`hidden flex flex-col h-full w-full justify-start items-start`}
        >
            <MapChooseLocation
                basis={{
                    classes_map: `map-trellis-1`,
                    loading: loading_map,
                    reset: async () => {
                        map_point_location_gcs_select = map_point_location_gcs;
                    },
                }}
                bind:map_point_center={map_point_location_gcs}
                bind:map_point_select={map_point_location_gcs_select}
                bind:map_point_select_geoc={map_point_location_gcs_select_geoc}
            />
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `${$t(`common.back`)}`,
            route: `/models/trade-product`,
            prevent_route:
                $carousel_index > 0
                    ? {
                          callback: async () => {
                              handle_carousel_prev();
                          },
                      }
                    : undefined,
            callback: async () => {
                await trade_product_kv_init(fmt_id());
            },
        },
        title: {
            label: {
                value: `${$t(`icu.add_*`, { value: `${$t(`common.product`)}` })}`,
            },
            callback: async () => {
                if (view === `map`) {
                    view = `form_1`;
                } else {
                    const geoloc = await lc.geo.current();
                    if (`err` in geoloc) return;
                    else {
                        map_point_location_gcs = geoloc;
                        map_point_location_gcs_select = geoloc;
                    }
                    view = `map`;
                }
            },
        },
        option: {
            loading: loading_submit,
            label: {
                value:
                    view === `map`
                        ? `Use Location`
                        : carousel_conf.get($carousel_index)?.label_next || ``,
                classes: `text-layer-1-glyph-hl`,
                glyph:
                    $carousel_index > 0 && $carousel_index < $carousel_index_max
                        ? {
                              key: `caret-right`,
                              classes: `text-layer-1-glyph-hl`,
                          }
                        : undefined,
            },
            callback: async () => {
                if (view === `map`) {
                    console.log(
                        JSON.stringify(
                            map_point_location_gcs_select_geoc,
                            null,
                            4,
                        ),
                        `map_point_location_gcs_select_geoc`,
                    );
                } else if ($carousel_index === $carousel_index_max)
                    await submit();
                else await handle_carousel_next();
            },
        },
    }}
/>
