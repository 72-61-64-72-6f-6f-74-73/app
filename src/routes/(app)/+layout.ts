import type { LayoutLoad, LayoutLoadEvent } from '../$types';

export const load: LayoutLoad = async ({ url }: LayoutLoadEvent) => {
    try {
        console.log(`layout (app) `, url.pathname);
    } catch (e) {
        console.log(`layout (app) error: `, e);
    } finally {
        return {}
    }
};
