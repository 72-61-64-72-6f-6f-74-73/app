<script lang="ts">
    import { lc } from "$lib/client";
    import type { NostrRelay } from "@radroots/models";
    import { LayoutTrellis, LayoutView } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    let models_list: NostrRelay[] = [];

    onMount(async () => {
        try {
            await load_models();
        } catch (e) {
        } finally {
        }
    });

    const load_models = async (): Promise<void> => {
        try {
            //loading_models = true;
            const res = await lc.db.nostr_relay_get({
                list: [`all`],
            });
            console.log(JSON.stringify(res, null, 4), `res`);
            if (typeof res !== `string`) models_list = res;
        } catch (e) {
            console.log(`(error) load_models `, e);
        } finally {
            //loading_models = false;
        }
    };
</script>

<LayoutView>
    <LayoutTrellis>
        <pre class="text-layer-0-glyph">
            {JSON.stringify(models_list, null, 4)}
        </pre>
    </LayoutTrellis>
</LayoutView>
