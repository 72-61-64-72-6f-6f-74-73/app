<script lang="ts">
    import { lc } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { _cf } from "$lib/conf";
    import { trellis as Trellis } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let nostr_public_key = ``;
    let nostr_secret_key = ``;

    onMount(async () => {
        try {
            const public_key = await lc.preferences.get(_cf.pref_key_active);
            if (public_key) nostr_public_key = public_key;
            const secret_key = await lc.keystore.get(`nostr:key:${public_key}`);
            if (secret_key) nostr_secret_key = secret_key;
        } catch (e) {
        } finally {
        }
    });

    async function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(async () => {
            await lc.dialog.alert(
                `Copied nostr key "${text.slice(0, 12)}..." to clipboard.`,
            );
        });
    }
</script>

<LayoutView basis={{ fade: true }}>
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Public Key`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: nostr_public_key,
                                        },
                                    ],
                                },

                                callback: async () => {
                                    await copyToClipboard(nostr_public_key);
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: lc.nostr.lib.npub(
                                                nostr_public_key,
                                            ),
                                        },
                                    ],
                                },

                                callback: async () => {
                                    await copyToClipboard(
                                        lc.nostr.lib.npub(nostr_public_key),
                                    );
                                },
                            },
                        },
                    ],
                },
            }}
        />
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Secret Key`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: nostr_secret_key,
                                        },
                                    ],
                                },

                                callback: async () => {
                                    await copyToClipboard(nostr_secret_key);
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: lc.nostr.lib.nsec(
                                                nostr_secret_key,
                                            ),
                                        },
                                    ],
                                },

                                callback: async () => {
                                    await copyToClipboard(
                                        lc.nostr.lib.nsec(nostr_secret_key),
                                    );
                                },
                            },
                        },
                    ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Nostr`,
            route: `/nostr`,
        },
        title: {
            label: `Keys`,
        },
    }}
/>
