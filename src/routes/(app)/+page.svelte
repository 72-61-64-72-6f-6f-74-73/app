<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import { app_nav, app_tab_active, app_tabs_visible } from "$lib/stores";
    import { t } from "@radroots/svelte-lib";

    $effect(() => {
        app_nav.set(false);
        app_tabs_visible.set(true);
        app_tab_active.set(0);
    });
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
            await goto(`/models/location-gcs`);
        }}
    >
        {"models location_gcs"}
    </button>
    <button
        class={`button-simple`}
        onclick={async () => {
            //
        }}
    >
        {"test #1"}
    </button>
</div>
