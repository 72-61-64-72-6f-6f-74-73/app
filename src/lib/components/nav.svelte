<script lang="ts">
    import { goto } from "$app/navigation";
    import { app_layout, app_nav_blur, app_nav_visible } from "$lib/stores";
    import type { INavBasis } from "$lib/types";
    import { restart } from "$lib/utils";
    import { fill as Fill, glyph as Glyph } from "@radroots/svelte-lib";
    import { onDestroy, onMount } from "svelte";

    export let basis: INavBasis;
    $: basis = basis;

    let el: HTMLElement | null;
    let el_inner: HTMLElement | null;

    onMount(async () => {
        try {
            app_nav_visible.set(true);
        } catch (e) {
        } finally {
        }
    });

    onDestroy(async () => {
        try {
            app_nav_visible.set(false);
        } catch (e) {
        } finally {
        }
    });
</script>

<div
    bind:this={el}
    class={`z-10 absolute top-0 left-0 flex flex-col w-full justify-start items-start transition-all duration-[250ms] h-nav_${$app_layout} ${$app_nav_blur ? `bg-layer-0-surface-blur/30 backdrop-blur-md` : ``}`}
>
    <div
        bind:this={el_inner}
        class={`relative flex flex-col h-full w-full justify-end items-center bg-transparent`}
    >
        <div
            class={`absolute bottom-[5px] left-0 grid grid-cols-12 flex flex-row h-8 w-full justify-start items-center`}
        >
            <button
                class={`col-span-4 flex flex-row h-full pl-2 justify-start items-center`}
                on:click={async () => {
                    await goto(basis.prev.route);
                }}
            >
                <Glyph
                    basis={{
                        key: `caret-left`,
                        weight: `bold`,
                        dim: `md+`,
                        classes: `text-layer-1-glyph-hl group-active:opacity-70 transition-opacity`,
                    }}
                />
                {#if basis.prev.label}
                    <p
                        class={`font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                    >
                        {basis.prev.label}
                    </p>
                {:else}
                    <Fill />
                {/if}
            </button>
            <div
                class={`col-span-4 flex flex-row h-full justify-center items-center`}
            >
                {#if basis.title}
                    <button
                        class={`flex flex-row justify-center items-center`}
                        on:click={async () => {
                            await restart();
                        }}
                    >
                        <p
                            class={`font-sans text-navCurrent text-layer-1-glyph`}
                        >
                            {basis.title.label}
                        </p>
                    </button>
                {:else}
                    <Fill />
                {/if}
            </div>
            <div
                class={`col-span-4 flex flex-row h-full justify-end items-center`}
            >
                {#if basis.option}
                    <button
                        class={`col-span-4 flex flex-row h-full pr-6 justify-end items-center`}
                        on:click={async () => {
                            await basis.option?.callback();
                        }}
                    >
                        <p
                            class={`font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                        >
                            {basis.option.label}
                        </p>
                    </button>
                {:else}
                    <Fill />
                {/if}
            </div>
        </div>
    </div>
</div>
