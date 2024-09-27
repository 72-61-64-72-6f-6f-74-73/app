import { ClientCapacitor } from "@radroots/client";
import { location_gcs_table, nostr_profile_relay_table, nostr_profile_table, nostr_relay_table, trade_product_table } from "@radroots/models";
export const lc = new ClientCapacitor({
    sqlite_upgrade: [
        {
            toVersion: 1,
            statements: [
                `PRAGMA foreign_keys = ON;`,
                location_gcs_table,
                trade_product_table,
                nostr_profile_table,
                nostr_relay_table,
                nostr_profile_relay_table
            ]
        }
    ]
});
