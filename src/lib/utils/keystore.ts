import { lc } from "$lib/client";

export const keystore_reset = async (): Promise<void> => {
    try {
        const ks_keys = await lc.keystore.keys();
        console.log(JSON.stringify(ks_keys, null, 4), `ks_keys`);
        if (!ks_keys) return;
        for (const ks_key of ks_keys) {
            await lc.keystore.remove(ks_key);
        }
    } catch (e) {
        console.log(`(error) keystore_reset `, e);
    }
};