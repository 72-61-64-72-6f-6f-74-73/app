<script lang="ts">
    import { Glyph, app_layout, route } from "@radroots/svelte-lib";

    let el_zoom: HTMLElement | null;
</script>

<div
    bind:this={el_zoom}
    class={`z-10 absolute top-dim_map_offset_top_${$app_layout} left-6 flex flex-col w-full gap-8 justify-start items-start`}
>
    <button
        class={`flex flex-row h-8 w-8 justify-center items-center rounded-2xl bg-layer-1-surface`}
        on:click={async () => {
            await route(`/`);
        }}
    >
        <Glyph
            basis={{
                key: `caret-left`,
                dim: `sm-`,
                weight: `bold`,
                classes: `text-layer-2-glyph`,
            }}
        />
    </button>
</div>
