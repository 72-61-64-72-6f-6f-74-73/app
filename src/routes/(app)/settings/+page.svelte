<script lang="ts">
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { _cf } from "$lib/conf";
    import { app_tabs_visible, app_thc } from "$lib/stores";
    import { restart } from "$lib/utils";
    import {
        toggle_color_mode,
        trellis as Trellis,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            app_tabs_visible.set(false);
        } catch (e) {
        } finally {
        }
    });
</script>

<LayoutView>
    <LayoutTrellis>
        <Trellis
            basis={{
                args: {
                    layer: 1,
                    title: {
                        value: `Appearance`,
                    },
                    list: [
                        {
                            hide_active: true,
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Toggle Color Mode (${toggle_color_mode($app_thc)})`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await cl.haptics.impact();
                                    app_thc.set(toggle_color_mode($app_thc));
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
                        value: `Nostr Keys`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Nostr Key (public)`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    const public_key = await cl.preferences.get(
                                        _cf.pref_key_active,
                                    );
                                    await cl.dialog.alert(
                                        `Hi! This is your nostr public key ${public_key}`,
                                    );
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Nostr Key (secret)`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    const public_key = await cl.preferences.get(
                                        _cf.pref_key_active,
                                    );
                                    console.log(`public_key `, public_key);
                                    const secret_key = await cl.keystore.get(
                                        `nostr:key:${public_key}`,
                                    );
                                    await cl.dialog.alert(
                                        `Hi! This is your nostr secret key ${secret_key}`,
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
                        value: `Configuration`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Reset Device`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    const confirm = await cl.dialog.confirm(
                                        `Hi! This will delete your saved keys.`,
                                    );
                                    if (confirm) {
                                        const nostr_public_key =
                                            await cl.preferences.get(
                                                _cf.pref_key_active,
                                            );
                                        if (nostr_public_key) {
                                            await cl.keystore.remove(
                                                `nostr:key:${nostr_public_key}`,
                                            );
                                            await cl.preferences.remove(
                                                _cf.pref_key_active,
                                            );
                                            await restart();
                                        } else {
                                            await cl.dialog.alert(
                                                `There is no public key preference saved.`,
                                            );
                                        }
                                    }
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
                        value: `Location`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Geolocation Current`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const pos = await cl.geo.current();
                                    await cl.dialog.alert(JSON.stringify(pos));
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
                        value: `Web`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Radroots.Org (Open Homepage)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const url = `https://radroots.org`;
                                    await cl.browser.open(url);
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Radroots.Org (Share Homepage)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await cl.share.open({
                                        title: `Radroots Home Page`,
                                        text: `Find farmers around the world.`,
                                        url: `https://radroots.org`,
                                        dialog_title: `This is the dialog title`,
                                    });
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Primal.Net (Open Profile)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const public_key = await cl.preferences.get(
                                        _cf.pref_key_active,
                                    );
                                    const npub = cl.nostr.lib.npub(public_key);
                                    const url = `https://primal.net/p/${npub}`;
                                    await cl.browser.open(url);
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
                        value: `Device`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Device (Info)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const data = await cl.device.info();
                                    await cl.dialog.alert(JSON.stringify(data));
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Device (Battery)`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const data = await cl.device.battery();
                                    await cl.dialog.alert(JSON.stringify(data));
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
                        value: `Tests`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Haptics Touch (less)`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    await cl.haptics.impact("less");
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Haptics Touch (more)`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    await cl.haptics.impact("more");
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Haptics Vibrate (500ms)`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                end: {
                                    icon: {
                                        key: `caret-right`,
                                    },
                                },
                                callback: async () => {
                                    await cl.haptics.vibrate(500);
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
            label: `Home`,
            route: `/`,
        },
        title: {
            label: `Settings`,
        },
    }}
/>
