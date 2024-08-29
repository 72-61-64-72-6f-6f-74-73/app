<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { _cf } from "$lib/conf";
    import { app_nav_visible, app_tabs_visible, app_thc } from "$lib/stores";
    import {
        toggle_color_mode,
        trellis as Trellis,
    } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav_visible.set(true);
        app_tabs_visible.set(false);
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
                            offset: {
                                mod: {
                                    key: `caret-left`,
                                },
                            },
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: "Back",
                                        },
                                    ],
                                },
                                callback: async () => {
                                    await goto(`/`);
                                },
                            },
                        },
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
                                        const public_key =
                                            await cl.preferences.get(
                                                _cf.pref_key_active,
                                            );
                                        await cl.keystore.remove(
                                            `nostr:key:${public_key}`,
                                        );
                                        await cl.preferences.remove(
                                            _cf.pref_key_active,
                                        );
                                        await cl.window.splash_show();
                                        location.reload();
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
                        value: `Share`,
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
                        value: `Haptics`,
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
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Haptics Selection Start`,
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
                                    await cl.haptics.selection_start();
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Haptics Selection End`,
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
                                    await cl.haptics.selection_end();
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
                        value: `Share`,
                    },
                    list: [
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Share Test #1`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const res = await cl.share.open({
                                        title: `Radroots Home Page`,
                                        text: `Find farmers around the world.`,
                                        url: `https://radroots.org`,
                                        dialog_title: `This is the dialog title`,
                                    });

                                    console.log(`res `, res);
                                },
                            },
                        },
                        {
                            touch: {
                                label: {
                                    left: [
                                        {
                                            value: `Share Test #2`,
                                            classes: `capitalize`,
                                        },
                                    ],
                                },
                                callback: async () => {
                                    const res = await cl.share.open({
                                        title: `Radroots Home Page`,
                                        url: `https://radroots.org`,
                                        dialog_title: `This is the dialog title`,
                                        files: [`file-1.png`, `file-2.png`],
                                    });

                                    console.log(`res `, res);
                                },
                            },
                        },
                    ],
                },
            }}
        />
    </LayoutTrellis>
</LayoutView>
