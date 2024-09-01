<script lang="ts">
    import { goto } from "$app/navigation";
    import { glyph as Glyph } from "@radroots/svelte-lib";

    let el_zoom: HTMLElement | null;
    /*
<button
        class={`surface-1 flex flex-row h-8 w-8 justify-center items-center rounded-2xl`}
        on:click={async () => {
            const zoom_to = zoom_step($map_full_zoom, `dec`);
            console.log(`zoom_to `, zoom_to);
            map_full_zoom.set(zoom_to);
        }}
    >
        <Glyph
            basis={{
                key: `minus`,
                dim: `sm-`,
                classes: `text-layer-2-glyph`,
            }}
        />
    </button>
    */
</script>

<div
    bind:this={el_zoom}
    class={`z-10 absolute top-16 left-6 flex flex-col w-full gap-8 justify-start items-start`}
>
    <button
        class={`surface-1 flex flex-row h-8 w-8 justify-center items-center rounded-2xl`}
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
