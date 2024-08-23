<script lang="ts">
    import { cl } from "$lib/client";
    import { t } from "@radroots/svelte-lib";
</script>

<div class={`flex flex-col w-full pt-16 justify-center items-center`}>
    <div
        class={`flex flex-col h-line w-line justify-center items-center bg-layer-1-surface`}
    >
        <p class={`font-mono text-sm lowercase text-layer-2-glyph`}>
            {$t(`app.name`)}
        </p>
    </div>
    <button
        class={`flex flex-row justify-center items-center text-white`}
        onclick={async () => {
            const res = await cl.dialog.alert(
                `Hi! You're platform is ${cl.platform}`,
            );
            console.log(`res `, res);
        }}
    >
        {`platform`}
    </button>
</div>
