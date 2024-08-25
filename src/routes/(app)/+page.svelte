<script lang="ts">
    import { cl } from "$lib/client";
    import { _cf } from "$lib/conf";
    import { t } from "@radroots/svelte-lib";
</script>

<div class={`flex flex-col w-full pt-16 gap-8 justify-center items-center`}>
    <button
        class={`button-simple`}
        onclick={async () => {
            await cl.dialog.alert(`Hi! You're platform is ${cl.platform}`);
        }}
    >
        {$t(`app.name`)}
    </button>
    <button
        class={`button-simple`}
        onclick={async () => {
            const public_key = await cl.preferences.get(_cf.pref_key_active);
            await cl.dialog.alert(
                `Hi! This is your nostr public key ${public_key}`,
            );
        }}
    >
        {"test #1"}
    </button>
    <button
        class={`button-simple`}
        onclick={async () => {
            const public_key = await cl.preferences.get(_cf.pref_key_active);
            const secret_key = await cl.keystore.get(`nostr:key:${public_key}`);
            await cl.dialog.alert(
                `Hi! This is your nostr secret key ${secret_key}`,
            );
        }}
    >
        {"test #2"}
    </button>
    <button
        class={`button-simple`}
        onclick={async () => {
            const confirm = await cl.dialog.confirm(
                `Hi! This will delete your nostr key.`,
            );
            if (confirm) {
                const public_key = await cl.preferences.get(
                    _cf.pref_key_active,
                );
                const key_removed = await cl.keystore.remove(
                    `nostr:key:${public_key}`,
                );
                if (key_removed) location.reload();
            }
        }}
    >
        {"test #3"}
    </button>
</div>
