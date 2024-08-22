<script lang="ts">
    import { t } from "@radroots/svelte-lib";
</script>

<div class={`flex flex-col w-full justify-center items-center`}>
    <div
        class={`flex flex-col h-line w-line justify-center items-center bg-layer-1-surface`}
    >
        <p class={`font-mono text-sm lowercase text-layer-2-glyph`}>
            {$t(`app.name`)}
        </p>
    </div>
</div>
