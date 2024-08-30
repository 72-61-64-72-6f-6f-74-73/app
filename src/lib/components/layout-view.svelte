<script lang="ts">
    import { app_layout, app_nav_blur, app_nav_visible, app_tabs_blur, app_tabs_visible } from "$lib/stores";
    import { type AppLayoutKey, type PropChildren } from "@radroots/svelte-lib";

    const styles: Record<AppLayoutKey, string> = {
        base: 'pt-2',
        lg:'pt-16'
    };

    let { children, basis }: PropChildren & { basis?: { fade?: boolean; }} = $props();

    let el: HTMLElement | null;

    let classes_nav = $derived($app_nav_visible ? `pt-h_nav_${$app_layout}` : `${styles[$app_layout]}`)
    let classes_tabs = $derived($app_tabs_visible ? `pb-h_tabs_${$app_layout}` : ``)
    let classes_fade = $derived(basis?.fade ? `fade-in` : ``)

    
    const scrollChange = (): void => {
        if (Math.max(el?.scrollTop || 0, 0) > 10) app_nav_blur.set(true);
        else app_nav_blur.set(false);

        if (Math.max(el?.scrollTop || 0, 0) > 10) app_tabs_blur.set(true);
        else app_tabs_blur.set(false);
    };

    $effect(() => {
        el?.addEventListener("scroll", scrollChange);

        return () => el?.removeEventListener("scroll", scrollChange);
    });
</script>

<div
    bind:this={el}
    class={`absolute top-0 left-0 flex flex-col h-[100vh] w-full overflow-y-scroll scroll-hide ${classes_nav} ${classes_tabs} ${classes_fade}`}
>
    {@render children()}
</div>
