<script lang="ts">
    import { cl } from "$lib/client";
    import { _cf } from "$lib/conf";
</script>

<div class={`flex flex-col w-full pt-16 justify-center items-center`}>
    <button
        class={`flex flex-row justify-center items-center text-white`}
        on:click={async () => {
            const sk_hex = cl.nostr.lib.generate_key();
            const pk_hex = cl.nostr.lib.public_key(sk_hex);
            const new_key_added = await cl.keystore.set(
                `nostr:key:${pk_hex}`,
                sk_hex,
            );
            if (new_key_added) {
                const key_pref_added = await cl.preferences.set(
                    _cf.pref_key_active,
                    pk_hex,
                );
                if (key_pref_added) {
                    location.reload();
                }
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
