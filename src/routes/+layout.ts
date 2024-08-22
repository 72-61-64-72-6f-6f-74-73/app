import { default_locale, load_translations, locales, translations_loading } from '@radroots/svelte-lib';
import type { LayoutLoad, LayoutLoadEvent } from './$types';

export const prerender = true;
export const ssr = false;
export const trailingSlash = 'always';

export const load: LayoutLoad = async ({ url, }: LayoutLoadEvent) => {
    try {
        const { language: nav_locale } = navigator;
        let locale = default_locale.toString();
        if (locales.get().some(i => i === nav_locale.toLowerCase())) locale = navigator.language;
        else if (locales.get().some(i => i === nav_locale.slice(0, 2).toLowerCase())) locale = nav_locale.slice(0, 2);
        await load_translations(locale.toLowerCase(), url.pathname);
        await translations_loading.toPromise();
    } catch (e) { } finally {
        return {};
    };
};
