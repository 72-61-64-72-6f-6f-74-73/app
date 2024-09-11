<script lang="ts">
    import {
        fmt_cl,
        type ICb,
        type IClOpt,
        type ILabel,
    } from "@radroots/svelte-lib";

    export let basis: ILabel & {
        notify?: IClOpt & ICb & ILabel;
    };
    $: basis = basis;
</script>

<div class={`flex flex-col w-full gap-1 justify-start items-start`}>
    <div class={`flex flex-row w-full px-2 gap-2 justify-start items-center`}>
        <p
            class={`${fmt_cl(basis.label.classes)} font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
        >
            {basis.label.value}
        </p>
        {#if basis.notify}
            <div
                class={`${fmt_cl(basis.notify.classes)} flex flex-row justify-start items-center fade-in transition-all`}
            >
                <button
                    class={`flex flex-row justify-center items-center`}
                    on:click={async () => {
                        await basis.notify?.callback();
                    }}
                >
                    <p
                        class={`${fmt_cl(basis.notify.label.classes)} font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                    >
                        {basis.notify.label.value}
                    </p>
                </button>
            </div>
        {/if}
    </div>
    <slot />
</div>
