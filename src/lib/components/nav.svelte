<script lang="ts">
    import { goto } from "$app/navigation";
    import { app_layout, app_nav, app_nav_blur } from "$lib/stores";
    import {
        encode_qp,
        fill as Fill,
        glyph as Glyph,
    } from "@radroots/svelte-lib";

    let el: HTMLElement | null;
    let el_inner: HTMLElement | null;

    let previous_route = $state(``);
    let previous_param = $state(``);
    let previous_label = $state(``);

    let title_label = $state(``);

    app_nav.subscribe((app_nav) => {
        if (!app_nav) return;
        if (app_nav.prev && app_nav.prev.length) {
            const previous = app_nav.prev[app_nav.prev.length - 1];
            if (previous) {
                previous_route = previous.route;
                if (previous.label) previous_label = previous.label;
                if (previous.params)
                    previous_param = encode_qp(previous.params);
            }
        }

        if (app_nav.title) {
            title_label = app_nav.title.label;
        }
    });

    const handle_previous = async (): Promise<void> => {
        try {
            const url = `${previous_route || `/`}${previous_param || ``}`;
            await goto(url);
        } catch (e) {
            console.log(`(error) handle_previous `, e);
        }
    };
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
                onclick={async () => {
                    await handle_previous();
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
                {#if previous_label}
                    <p
                        class={`font-sans text-navPrevious text-layer-1-glyph-hl group-active:opacity-60 transition-opacity`}
                    >
                        {previous_label}
                    </p>
                {:else}
                    <Fill />
                {/if}
            </button>
            <div
                class={`col-span-4 flex flex-row h-full justify-center items-center`}
            >
                {#if title_label}
                    <p class={`font-sans text-navCurrent text-layer-1-glyph`}>
                        {title_label}
                    </p>
                {:else}
                    <Fill />
                {/if}
            </div>
            <div
                class={`col-span-4 flex flex-row h-full justify-end items-center`}
            >
                <Fill />
            </div>
        </div>
    </div>
</div>
