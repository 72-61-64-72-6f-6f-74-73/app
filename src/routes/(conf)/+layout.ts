import { goto } from '$app/navigation';
import { cl } from '$lib/client';
import { _cf } from '$lib/conf';
import type { LayoutLoad, LayoutLoadEvent } from '../$types';

export const load: LayoutLoad = async ({ url }: LayoutLoadEvent) => {
    try {
        const key_active = await cl.preferences.get(_cf.pref_key_active);
        if (key_active) {
            const ks_keys = await cl.keystore.keys();
            const active_nostr_key = ks_keys?.find(
                (i) => i === `nostr:key:${key_active}`,
            );
            if (active_nostr_key) {
                await goto(`/`);
                return
            }
        }
    } catch (e) { } finally {
        await cl.window.splash_hide();
        return {};
    };
};
