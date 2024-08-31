<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import { app_tab_active, app_tabs_visible } from "$lib/stores";
    import { NDKKind } from "@nostr-dev-kit/ndk";
    import { ndk, ndk_event, ndk_user, t } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_tabs_visible.set(true);
            app_tab_active.set(0);
        } catch (e) {
        } finally {
        }
    });

    const nostr_note_pub = async (): Promise<void> => {
        try {
            const content = `posting from radroots`;
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Text,
                    content: JSON.stringify(content),
                },
            });
            console.log(JSON.stringify(ev, null, 4), `ev`);
            if (ev) await ev.publish();
            cl.dialog.alert(`Published content ${JSON.stringify(content)}`);
        } catch (e) {
            console.log(`(error) nostr_note_pub `, e);
        }
    };
</script>

<div class={`flex flex-col w-full pt-16 gap-8 justify-center items-center`}>
    <button
        class={`button-simple`}
        on:click={async () => {
            await cl.dialog.alert(`Hi! You're platform is ${cl.platform}`);
        }}
    >
        {$t(`app.name`)}
    </button>
    <button
        class={`button-simple`}
        on:click={async () => {
            await goto(`/models/location-gcs`);
        }}
    >
        {"models geolocation"}
    </button>
</div>
