import { goto } from "$app/navigation";
import { lc } from "$lib/client";
import { parse_trade_product_form_keys, trade_product_form_fields, trade_product_form_vals, type LocationGcs, type TradeProductFormFields } from "@radroots/client";
import { kv } from "@radroots/svelte-lib";

export const trade_product_submit_preview = async (kv_pref: string): Promise<{
    trade_product_fields: TradeProductFormFields;
    location_gcs: LocationGcs
} | undefined> => {
    try {
        const location_gcs_id = await kv.get(`${kv_pref}-location_gcs_id`)
        if (!location_gcs_id || typeof location_gcs_id !== `string`) {
            await lc.dialog.alert(`The product location is missing.`);
            return;
        }

        const location_gcs_res = await lc.db.location_gcs_get({
            id: location_gcs_id,
        });

        if (typeof location_gcs_res === `string`) {
            await lc.dialog.alert(
                `There was an error finding the selected location`,
            );
            await goto(`/`);
            return;
        }

        const trade_product_fields = {
            ...trade_product_form_vals
        }

        for (const [k, field] of Object.entries(
            trade_product_form_fields,
        )) {
            const field_k = parse_trade_product_form_keys(k);
            if (!field_k) continue;
            const field_id = `${kv_pref}-${field_k}`
            let field_val = ``;
            field_val = await kv.get(field_id);
            if (field_val) trade_product_fields[field_k] = field_val;

            //@todo add validation
        }

        trade_product_fields.price_qty_unit = trade_product_fields.qty_unit;

        return {
            trade_product_fields,
            location_gcs: location_gcs_res[0]
        };
    } catch (e) {
        console.log(`(error) trade_product_submit_preview `, e);
    }
};

export const trade_product_kv_init = async (kv_pref: string): Promise<void> => {
    try {
        for (const k of Object.keys(
            trade_product_form_fields,
        )) {
            const field_k = parse_trade_product_form_keys(k);
            if (!field_k) continue;
            const field_id = `${kv_pref}-${field_k}`
            await kv.delete(field_id);
        }

    } catch (e) {
        console.log(`(error) trade_product_kv_init `, e);
    }
};

/*
 const vals = trade_product_form_vals;
            console.log(`vals 0!`, vals);
            for (const [k, field] of Object.entries(
                trade_product_form_fields,
            )) {
                const field_k = parse_trade_product_form_keys(k);
                if (!field_k) continue;
                const field_id = fmt_id(field_k);
                let field_val = ``;
                if (field_k === `price_qty_unit`) {
                    field_val = await $kv.get(`price_unit`);
                } else {
                    field_val = await $kv.get(field_id);
                }

                /*

                if (field_k === `key`) {
                    field_val = sel_trade_product_key;
                } else 

                if (
                    (!field.optional && !field.validation.test(field_val)) ||
                    (field.optional &&
                        field_val &&
                        !field.validation.test(field_val))
                ) {
                    loading = false;
                    await lc.dialog.alert(
                        `Invalid product ${field_k} value.`,
                    );
                    return;
                }
                vals[field_k] = field_val;
            }

            console.log(JSON.stringify(vals, null, 4), `vals`);
            /*
            const db_add = await lc.db.trade_product_add(vals);
            if (typeof db_add !== `string` && !Array.isArray(db_add)) {
                const { id: trade_product_id } = db_add;
                const db_rel = await lc.db.set_trade_product_location({
                    trade_product_id,
                    location_gcs_id: location_gcs_res[0].id,
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
*/