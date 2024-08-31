<script lang="ts">
    import {
        app_layout,
        app_nav_blur,
        app_nav_visible,
        app_tabs_blur,
        app_tabs_visible,
    } from "$lib/stores";
    import { type AppLayoutKey } from "@radroots/svelte-lib";
    import { onDestroy, onMount } from "svelte";

    const styles: Record<AppLayoutKey, string> = {
        base: "pt-2",
        lg: "pt-16",
    };

    export let basis: { fade?: boolean } | undefined = undefined;
    $: basis = basis;

    let el: HTMLElement | null;

    onMount(async () => {
        try {
            el?.addEventListener("scroll", scrollChange);
        } catch (e) {
        } finally {
        }
    });

    onDestroy(async () => {
        try {
            el?.removeEventListener("scroll", scrollChange);
        } catch (e) {
        } finally {
        }
    });

    $: classes_nav = $app_nav_visible
        ? `pt-h_nav_${$app_layout}`
        : `${styles[$app_layout]}`;
    $: classes_tabs = $app_tabs_visible ? `pb-h_tabs_${$app_layout}` : ``;
    $: classes_fade = basis?.fade ? `fade-in` : ``;

    const scrollChange = (): void => {
        if (Math.max(el?.scrollTop || 0, 0) > 10) app_nav_blur.set(true);
        else app_nav_blur.set(false);

        if (Math.max(el?.scrollTop || 0, 0) > 10) app_tabs_blur.set(true);
        else app_tabs_blur.set(false);
    };
</script>

<div
    bind:this={el}
    class={`absolute top-0 left-0 flex flex-col h-[100vh] w-full overflow-y-scroll scroll-hide ${classes_nav} ${classes_tabs} ${classes_fade}`}
>
    <slot />
</div>
