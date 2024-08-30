<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import { app_nav_prev } from "$lib/stores";
    import { NDKKind } from "@nostr-dev-kit/ndk";
    import { ndk, ndk_event, ndk_user } from "@radroots/svelte-lib";

    $effect(() => {
        (async () => {
            try {
                const profile_name = await cl.dialog.prompt({
                    title: `Profile Name`,
                    message: `What is your profile name.`,
                    input_placeholder: `Enter profile name`,
                });
                if (profile_name === false) {
                    await goto(`/`);
                    return;
                }

                const display_name = await cl.dialog.prompt({
                    title: `Display Name`,
                    message: `What is your display name.`,
                    input_placeholder: `Enter display name`,
                });
                if (display_name === false) {
                    await goto(`/`);
                    return;
                }

                await nostr_metadata_pub({
                    profile_name,
                    display_name,
                });
            } catch (e) {}
        })();
    });

    const nostr_metadata_pub = async (opts: {
        profile_name: string;
        display_name: string;
    }): Promise<void> => {
        try {
            const { profile_name: name, display_name } = opts;
            const content = {
                name,
                display_name,
            };
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Metadata,
                    content: JSON.stringify(content),
                },
            });
            console.log(JSON.stringify(ev, null, 4), `ev`);
            if (ev) await ev.publish();
            cl.dialog.alert(`Published content ${JSON.stringify(content)}`);
            app_nav_prev.set([]);
            await goto(`/`);
        } catch (e) {
            console.log(`(error) nostr_metadata_pub `, e);
        }
    };
</script>

<div></div>
