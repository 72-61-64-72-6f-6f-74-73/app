import { route, type NavigationRoute } from "@radroots/svelte-lib";
import { lc } from "../client";

export const restart = async (route_to: true | NavigationRoute, notify_message?: string): Promise<void> => {
    try {
        await lc.window.splash_show();
        if (notify_message) {
            console.log(`todo! notify_message `, notify_message)
            //app_notify.set(notify_message);
        }
        await route(typeof route_to === `string` ? route_to : `/`)
        location.reload();
    } catch (e) {
        console.log(`(error) restart `, e);
    }
};