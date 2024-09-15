<script lang="ts">
    import { lc } from "$lib/client";
    import { _cf } from "$lib/conf";
    import { restart } from "$lib/utils";
    import {
        app_tabs_visible,
        app_thc,
        LayoutTrellis,
        LayoutView,
        Nav,
        toggle_color_mode,
        Trellis,
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
                                    await lc.haptics.impact();
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
                                    const public_key = await lc.preferences.get(
                                        _cf.pref.key_active,
                                    );
                                    await lc.dialog.alert(
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
                                    const public_key = await lc.preferences.get(
                                        _cf.pref.key_active,
                                    );
                                    console.log(`public_key `, public_key);
                                    const secret_key = await lc.keystore.get(
                                        `nostr:key:${public_key}`,
                                    );
                                    await lc.dialog.alert(
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
                                    const confirm = await lc.dialog.confirm(
                                        `Hi! This will delete your saved keys.`,
                                    );
                                    if (confirm) {
                                        const nostr_public_key =
                                            await lc.preferences.get(
                                                _cf.pref.key_active,
                                            );
                                        if (nostr_public_key) {
                                            await lc.keystore.remove(
                                                `nostr:key:${nostr_public_key}`,
                                            );
                                            await lc.preferences.remove(
                                                _cf.pref.key_active,
                                            );
                                            await restart();
                                        } else {
                                            await lc.dialog.alert(
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
                                    const pos = await lc.geo.current();
                                    await lc.dialog.alert(JSON.stringify(pos));
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
                                    await lc.browser.open(url);
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
                                    await lc.share.open({
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
                                    const public_key = await lc.preferences.get(
                                        _cf.pref.key_active,
                                    );
                                    const npub = lc.nostr.lib.npub(public_key);
                                    const url = `https://primal.net/p/${npub}`;
                                    await lc.browser.open(url);
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
                                    const data = await lc.device.info();
                                    await lc.dialog.alert(JSON.stringify(data));
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
                                    const data = await lc.device.battery();
                                    await lc.dialog.alert(JSON.stringify(data));
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
                                    await lc.haptics.impact("less");
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
                                    await lc.haptics.impact("more");
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
                                    await lc.haptics.vibrate(500);
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
