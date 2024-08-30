<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import { _cf } from "$lib/conf";
    import { app_nav, app_tab_active, app_tabs_visible } from "$lib/stores";
    import { ndk, ndk_event, ndk_user, t } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav.set(false);
        app_tabs_visible.set(true);
        app_tab_active.set(0);
    });

    const save_nostr_metadata = async (): Promise<void> => {
        try {
            const metadata = {
                name: `radroots!`,
                display_name: _cf.root_symbol,
            };
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: 0,
                    content: JSON.stringify(metadata),
                },
            });

            if (ev) await ev.publish();
            cl.dialog.alert(`Published metadata ${JSON.stringify(metadata)}`);
        } catch (e) {
            console.log(`(error) `, e);
        }
    };
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
            app_nav.set({
                prev: [
                    {
                        label: `Home`,
                        route: `/`,
                    },
                ],
                title: {
                    label: `Models`,
                },
            });
            await goto(`/models/location-gcs`);
        }}
    >
        {"models location_gcs"}
    </button>
    <button
        class={`button-simple`}
        onclick={async () => {
            await save_nostr_metadata();
        }}
    >
        {"publish metadata"}
    </button>
</div>
