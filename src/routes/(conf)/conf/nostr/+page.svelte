<script lang="ts">
    import { lc } from "$lib/client";
    import { _cf } from "$lib/conf";
    import { restart } from "$lib/utils";
    import { sleep } from "@radroots/svelte-lib";
</script>

<div class={`flex flex-col w-full pt-16 justify-center items-center`}>
    <button
        class={`flex flex-row justify-center items-center text-white`}
        on:click={async () => {
            const sk_hex = lc.nostr.lib.generate_key();
            const pk_hex = lc.nostr.lib.public_key(sk_hex);
            const new_key_added = await lc.keystore.set(
                `nostr:key:${pk_hex}`,
                sk_hex,
            );
            if (new_key_added) {
                await lc.preferences.set(_cf.pref.key_active, pk_hex);
                await sleep(500);
                await restart(true);
            }
        }}
    >
        <div
            class={`flex flex-col h-line w-line justify-center items-center bg-layer-1-surface`}
        >
            <p class={`font-mono text-sm lowercase text-layer-2-glyph`}>
                {`create nostr keys`}
            </p>
        </div>
    </button>
</div>
