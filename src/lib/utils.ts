import { goto } from "$app/navigation";
import { cl } from "./client";

export const restart = async (route_to: true | string): Promise<void> => {
    try {
        await cl.window.splash_show();
        if (route_to) {
            if (route_to === true) await goto(`/`);
            else await goto(route_to)
        }
        location.reload();
    } catch (e) {
        console.log(`(error) restart `, e);
    }
};