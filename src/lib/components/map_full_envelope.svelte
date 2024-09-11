<script lang="ts">
    import { goto } from "$app/navigation";
    import { Glyph, app_layout } from "@radroots/svelte-lib";

    let el: HTMLElement | null;
</script>

<div
    bind:this={el}
    class={`z-10 absolute top-dim_map_offset_top_${$app_layout} left-6 flex flex-col w-full gap-8 justify-start items-start`}
>
    <button
        class={`flex flex-row h-8 w-8 justify-center items-center rounded-2xl bg-layer-1-surface`}
        on:click={async () => {
            await goto(`/`);
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
