import { PUBLIC_DATABASE_NAME } from "$env/static/public";
import { ClientCapacitor } from "@radroots/client";
import { Geocoder } from "@radroots/geocoder";
import { location_gcs_table, nostr_profile_relay_table, nostr_profile_table, nostr_relay_table, trade_product_table } from "@radroots/models";

export const lc = new ClientCapacitor({
    sqlite: {
        database: PUBLIC_DATABASE_NAME,
        upgrade: [
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
    }
});

export const geoc = new Geocoder(`/geonames/geonames.db`);
