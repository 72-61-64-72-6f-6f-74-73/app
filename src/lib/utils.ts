import { cl } from "./client";

export const restart = async (): Promise<void> => {
    try {
        await cl.window.splash_show();
        location.reload();
    } catch (e) {
        console.log(`(error) restart `, e);
    }
};