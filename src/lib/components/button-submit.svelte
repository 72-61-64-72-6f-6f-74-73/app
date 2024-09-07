<script lang="ts">
    import type { CallbackPromise } from "@radroots/svelte-lib";
    import { Loading, t } from "@radroots/svelte-lib";

    export let basis: {
        callback: CallbackPromise;
        loading?: boolean;
    };
    $: basis = basis;
</script>

<button
    class={`button-submit`}
    on:click={async () => {
        await basis.callback();
    }}
>
    {#if basis.loading}
        <Loading basis={{ dim: `xs` }} />
    {:else}
        {`${$t(`common.submit`, { default: `submit` })}`}
    {/if}
</button>
