<script lang="ts">
    import { lc } from "$lib/client";
    import { trade_product_kv_vals } from "$lib/utils/trade_product";
    import {
        type LocationGcs,
        type TradeProductFormFields,
    } from "@radroots/models";
    import {
        Fill,
        Glyph,
        int_step,
        kv,
        LayoutView,
        locale,
        Nav,
        route,
        t,
    } from "@radroots/svelte-lib";
    import { fmt_currency_tuple } from "@radroots/utils";
    import { onMount } from "svelte";

    const kv_pref = `models-trade_product-add`;

    let preview_trade_product: TradeProductFormFields;
    let preview_location_gcs: LocationGcs;

    let qty_avail = 0;

    $: num_qty_amt = preview_trade_product
        ? Number(preview_trade_product.qty_amt)
        : 0;

    $: num_price_amt = preview_trade_product
        ? Number(preview_trade_product.price_amt)
        : 0;

    let tup_price_amt: [string, string, string] = ["", "", ""];
    $: tup_price_amt =
        num_price_amt > 0
            ? fmt_currency_tuple(
                  $locale,
                  preview_trade_product.price_currency,
                  num_price_amt,
              )
            : ["", "", ""];

    onMount(async () => {
        try {
            await kv.set(`new key`, 20);
            qty_avail = await kv.get(`${kv_pref}-qty_avail`);
            const vals = await trade_product_kv_vals({
                kv_pref,
            });
            if (typeof vals === `string`) {
                await lc.dialog.alert(`Invalid value ${vals}.`);
                await route(`/models/trade-product/add`);
                return;
            }

            console.log(JSON.stringify(vals, null, 4), `vals`);

            const location_gcs_res = await lc.db.location_gcs_get({
                id: await kv.get(`${kv_pref}-location_gcs_id`),
            });

            console.log(`location_gcs_res `, location_gcs_res);

            if (typeof location_gcs_res === `string`) {
                await lc.dialog.alert(`The product location is missing.`);
                await route(`/models/trade-product/add`);
                //@todo add focus
                return;
            }

            preview_trade_product = vals;
            preview_location_gcs = location_gcs_res[0];
        } catch (e) {
        } finally {
        }
    });

    const submit = async (): Promise<void> => {
        try {
            const vals = await trade_product_kv_vals({
                kv_pref,
                no_validation: [`year`, `price_qty_amt`],
            });
            console.log(JSON.stringify(vals, null, 4), `vals`);

            if (typeof vals === `string`) {
                lc.dialog.alert(`There was a problem adding the product`);
                await route(`/models/trade-product/add`);
                return;
            }

            const res = await lc.db.trade_product_add(vals);
            if (typeof res === `string`) {
                lc.dialog.alert(res);
                await route(`/models/trade-product/add`);

                return;
            } else if (Array.isArray(res)) {
                lc.dialog.alert(res.join(" "));
                await route(`/models/trade-product/add`);
                return;
            }

            const kv_each = await kv.each(kv_pref);
            const kv_keys = kv_each.filter(([i]: [string, string]) =>
                i.startsWith(kv_pref),
            );
            for (const key of kv_keys) await kv.delete(key);

            await route(`/models/trade-product`);
        } catch (e) {
            console.log(`(error) submit `, e);
        }
    };
</script>

<LayoutView>
    {#if preview_trade_product}
        <div
            class={`flex flex-col w-full pt-4 px-4 justify-center items-center`}
        >
            <div
                class={`relative flex flex-col w-full p-4 gap-2 justify-start items-start bg-layer-1-surface rounded-3xl`}
            >
                <div
                    class={`flex flex-row w-full h-6 justify-center items-center`}
                >
                    <p class={`font-mono font-[400] text-layer-2-glyph`}>
                        {`Overview`}
                    </p>
                </div>
                <div
                    class={`flex flex-col w-full gap-3 justify-start items-center`}
                >
                    <div
                        class={`flex flex-col w-full justify-start items-start`}
                    >
                        <p class={`font-mono font-[400] text-layer-2-glyph`}>
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
                                    {preview_trade_product.key}
                                </p>
                            </div>
                            <div
                                class={`flex flex-row justify-end items-center`}
                            >
                                <button
                                    class={`flex flex-row justify-start items-center active:opacity-60 transition-all`}
                                    on:click={async () => {
                                        await kv.set(
                                            `*-el-focus`,
                                            `${kv_pref}-key_wrap`,
                                        );
                                        await route(
                                            `/models/trade-product/add`,
                                        );
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
                        class={`flex flex-col w-full justify-start items-start`}
                    >
                        <p class={`font-mono font-[400] text-layer-2-glyph`}>
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
                                    {tup_price_amt[0]}
                                </p>
                                <p
                                    class={`font-mono font-[400] text-layer-2-glyph`}
                                >
                                    {tup_price_amt.slice(1).join(".")}
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
                                        await kv.set(
                                            `*-el-focus`,
                                            `${kv_pref}-price_wrap`,
                                        );
                                        await route(
                                            `/models/trade-product/add`,
                                        );
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
                        class={`flex flex-col w-full justify-start items-start`}
                    >
                        <p class={`font-mono font-[400] text-layer-2-glyph`}>
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
                                        await kv.set(
                                            `*-el-focus`,
                                            `${kv_pref}-qty_wrap`,
                                        );
                                        await route(
                                            `/models/trade-product/add`,
                                        );
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
                        class={`flex flex-col w-full justify-start items-start`}
                    >
                        <p class={`font-mono font-[400] text-layer-2-glyph`}>
                            {`${$t(`icu.*_available`, { value: `${$t(`common.quantity`)}` })}`}
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
                                    {qty_avail}
                                </p>
                                <p
                                    class={`font-mono font-[400] text-layer-2-glyph`}
                                >
                                    {`(${(qty_avail * num_qty_amt).toFixed(2)} ${$t(`measurement.mass.unit.${preview_trade_product.qty_unit}_ab`, { default: preview_trade_product.qty_unit })} total)`}
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
                                        classes: `h-5 w-5 text-layer-2-glyph bg-layer-2-surface active:opacity-60 rounded-full transition-all`,
                                        callback: async () => {
                                            qty_avail = int_step(
                                                qty_avail,
                                                `-`,
                                                1,
                                            );
                                            await kv.set(
                                                `${kv_pref}-qty_avail`,
                                                qty_avail.toString(),
                                            );
                                        },
                                    }}
                                />
                                <Glyph
                                    basis={{
                                        key: `arrow-up`,
                                        dim: `xs`,
                                        weight: `bold`,
                                        classes: `h-5 w-5 text-layer-2-glyph bg-layer-2-surface active:opacity-60 rounded-full transition-all`,
                                        callback: async () => {
                                            qty_avail = int_step(
                                                qty_avail,
                                                `+`,
                                            );
                                            await kv.set(
                                                `${kv_pref}-qty_avail`,
                                                qty_avail.toString(),
                                            );
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        class={`flex flex-col w-full justify-start items-start`}
                    >
                        <p class={`font-mono font-[400] text-layer-2-glyph`}>
                            {`${$t(`common.location`)}:`}
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
                                    {preview_location_gcs.label}
                                </p>
                            </div>
                            <div
                                class={`flex flex-row justify-end items-center`}
                            >
                                <button
                                    class={`flex flex-row justify-start items-center active:opacity-60 transition-all`}
                                    on:click={async () => {
                                        await kv.set(
                                            `*-el-focus`,
                                            `${kv_pref}-location_gcs_id_wrap`,
                                        );
                                        await route(
                                            `/models/trade-product/add`,
                                        );
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
                </div>
                <div
                    class={`flex flex-row w-full pt-4 pb-2 justify-start items-center`}
                >
                    <div
                        class={` flex flex-row h-[1px] w-full justify-start items-center bg-stone-400`}
                    >
                        <Fill />
                    </div>
                </div>
                <div
                    class={`flex flex-row w-full h-6 justify-center items-center`}
                >
                    <p class={`font-mono font-[400] text-layer-2-glyph`}>
                        {`Product Fields`}
                    </p>
                </div>
                <div
                    class={`flex flex-col w-full justify-start items-center`}
                ></div>
            </div>
        </div>
    {/if}
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Product`,
            route: `/models/trade-product/add`,
        },
        title: {
            label: {
                value: `Preview`,
            },
        },
        option: {
            label: {
                value: `Post`,
            },
            callback: async () => {
                await submit();
            },
        },
    }}
/>
