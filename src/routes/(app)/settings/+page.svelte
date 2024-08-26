<script lang="ts">
    import { goto } from "$app/navigation";
    import { app_thc } from "$lib/stores";
    import { toggle_color_mode, trellis } from "@radroots/svelte-lib";
</script>

<div class={`flex flex-col w-full p-6 justify-center items-center`}>
    <svelte:component
        this={trellis}
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
                                app_thc.set(toggle_color_mode($app_thc));
                            },
                        },
                    },
                ],
            },
        }}
    />
</div>
