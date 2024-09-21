import { lc } from '$lib/client';
import { _cf } from '$lib/conf';
import { kv } from '@radroots/svelte-lib';
import type { LayoutLoad, LayoutLoadEvent } from '../$types';

export const load: LayoutLoad = async ({ url }: LayoutLoadEvent) => {
    try {
        console.log(`layout (app) `, url.pathname);
        if (url.pathname === `/`) {
            const root_alert = await kv.get(_cf.cmd.root_alert);
            if (root_alert) {
                await kv.delete(_cf.cmd.root_alert);
                lc.dialog.alert(root_alert);
            }
        }
    } catch (e) {
        console.log(`layout (app) error: `, e);
    } finally {
        return {}
    }
};
