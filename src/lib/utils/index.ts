import { goto } from "$app/navigation";
import { _cf } from "$lib/conf";
import { kv } from "@radroots/svelte-lib";
import { lc } from "../client";

export const restart = async (route_to: true | string, alert_message?: string): Promise<void> => {
    try {
        await lc.window.splash_show();
        if (alert_message) {
            await kv.set(
                _cf.cmd.root_alert,
                alert_message
            );
        }
        if (route_to) {
            if (route_to === true) await goto(`/`);
            else await goto(route_to)
        }

        location.reload();
    } catch (e) {
        console.log(`(error) restart `, e);
    }
};