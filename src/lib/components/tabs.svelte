<script lang="ts">
    import { app_layout, app_tab_active, app_tabs_blur } from "$lib/stores";
    import { glyph as Glyph, type ITabsBasis } from "@radroots/svelte-lib";

    export let basis: ITabsBasis;
    $: basis = basis;

    $: classes_blur = $app_tabs_blur ? `bg-layer-1-surface/30` : ``;

    let el: HTMLElement | null;
    let el_inner: HTMLElement | null;
</script>

<div
    bind:this={el}
    class={`z-10 absolute bottom-0 left-0 flex flex-col w-full justify-start items-start transition-all backdrop-blur-md h-tabs_${$app_layout} ${classes_blur}`}
>
    <div
        bind:this={el_inner}
        class={`relative flex flex-col h-full w-full justify-start items-center`}
    >
        <div
            class={`absolute top-4 left-0 grid grid-cols-12 flex flex-row w-full justify-center items-center`}
        >
            {#each basis.list as tab, tab_i}
                <button
                    class={`col-span-3 flex flex-col h-full justify-start items-center transition-all`}
                    on:click={async () => {
                        app_tab_active.set(tab_i);
                        await tab.callback(tab_i);
                    }}
                >
                    <Glyph
                        basis={{
                            classes:
                                $app_tab_active === tab_i
                                    ? `text-layer-2-glyph text-lineActiveBlue`
                                    : `text-layer-2-glyph text-lineMd`,
                            key: tab.icon,
                            dim: `md`,
                            weight:
                                $app_tab_active === tab_i
                                    ? tab.active_weight || `fill`
                                    : `bold`,
                        }}
                    />
                </button>
            {/each}
        </div>
    </div>
</div>
