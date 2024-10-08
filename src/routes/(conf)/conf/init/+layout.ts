import { lc } from '$lib/client';
import { _conf } from '$lib/conf';
import { route } from '@radroots/svelte-lib';
import type { LayoutLoad, LayoutLoadEvent } from './$types';

export const load: LayoutLoad = async ({ url }: LayoutLoadEvent) => {
    try {
        console.log(`layout (conf) `, url.pathname);
        const key_active = await lc.preferences.get(_conf.kv.nostr_key_active);
        console.log(`key_active `, key_active)
        if (key_active) {
            const ks_keys = await lc.keystore.keys();
            const active_nostr_key = ks_keys?.find(
                (i) => i === `nostr:key:${key_active}`,
            );
            if (active_nostr_key) {
                await route(`/`);
                return
            }
        }
    } catch (e) { } finally {
        await lc.window.splash_hide();
        return {};
    };
};
