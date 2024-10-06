<script lang="ts">
    import {
        LayoutView,
        Nav,
        carousel_index,
        carousel_index_max,
        carousel_next,
        carousel_prev,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            carousel_index.set(0);
            carousel_index_max.set(1);
        } catch (e) {
        } finally {
        }
    });
</script>

<LayoutView>
    <div
        data-carousel-container={`start`}
        class={`carousel-container flex flex-grow h-full w-full`}
    >
        <div
            data-carousel-item={`start`}
            class={`carousel-item flex flex-col w-full`}
        >
            <button
                class={`flex flex-row justify-center items-center`}
                on:click={async () => {
                    await carousel_next(`start`);
                }}
            >
                <p class={`font-sans font-[400] text-layer-0-glyph`}>one</p>
            </button>
        </div>
        <div
            data-carousel-item={`start`}
            class={`carousel-item flex flex-col w-full`}
        >
            <button
                class={`flex flex-row justify-center items-center`}
                on:click={async () => {
                    await carousel_prev(`start`);
                }}
            >
                <p class={`font-sans font-[400] text-layer-0-glyph`}>two</p>
            </button>
        </div>
    </div>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Home`,
            route: `/`,
        },
        title: {
            label: {
                value: `Test`,
            },
        },
    }}
/>
