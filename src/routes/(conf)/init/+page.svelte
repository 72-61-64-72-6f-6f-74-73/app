<script lang="ts">
    import { lc } from "$lib/client";
    import { _cf } from "$lib/conf";
    import { restart } from "$lib/utils";
    import { Glyph, LayoutView, sleep } from "@radroots/svelte-lib";

    const SLIDE_DURATION = 600;

    const slides_param: Record<View, { max: number }> = {
        start: {
            max: 4,
        },
        configure: {
            max: 1,
        },
    };

    type View = `start` | `configure`;
    let view: View = `start`;

    $: {
        for (const el of document.querySelectorAll(`[data-view]`))
            el.classList.toggle(
                `hidden`,
                el.getAttribute(`data-view`) !== view,
            );
    }

    let slide_active = false;
    let slide_index = 0;

    const get_slide_container = (view: View): Element | undefined => {
        const el = document.querySelector(`[data-slide-container="${view}"]`);
        return el ? el : undefined;
    };

    const get_slide_item = (view: View): Element | undefined => {
        const el = document.querySelector(`[data-carousel-li="${view}"]`);
        return el ? el : undefined;
    };

    const slide_prev = async (): Promise<void> => {
        if (slide_active) return;
        slide_active = true;
        const slide_item = get_slide_item(view);
        const slide_container = get_slide_container(view);
        if (slide_container && slide_item) {
            const slide_w = slide_item?.clientWidth || 0;
            slide_container.scrollLeft -= slide_w;
            slide_index = Math.max(slide_index - 1, 0);
        }
        await sleep(SLIDE_DURATION);
        slide_active = false;
    };

    const slide_next = async (): Promise<void> => {
        if (slide_active) return;
        slide_active = true;
        const slide_item = get_slide_item(view);
        const slide_container = get_slide_container(view);
        if (slide_container && slide_item) {
            const slide_w = slide_item?.clientWidth || 0;
            slide_container.scrollLeft += slide_w;
            slide_index = Math.min(slide_index + 1, slides_param[view].max);
        }
        await sleep(SLIDE_DURATION);
        slide_active = false;
    };

    const create_new_key = async (): Promise<void> => {
        try {
            const sk_hex = lc.nostr.lib.generate_key();
            const pk_hex = lc.nostr.lib.public_key(sk_hex);
            const new_key_added = await lc.keystore.set(
                `nostr:key:${pk_hex}`,
                sk_hex,
            );
            if (new_key_added) {
                await lc.preferences.set(_cf.pref.key_active, pk_hex);
                await sleep(500);
                await restart(
                    true,
                    `Welcome! To view your device configuration go to Settings > Keypairs.`,
                );
            }
        } catch (e) {
            console.log(`(error) create_new_key `, e);
        }
    };
</script>

<LayoutView>
    <div
        data-view={`start`}
        class={`flex flex-col h-full w-full py-12 px-6 justify-start items-center`}
    >
        <div
            class={`relative flex flex-col h-full w-full justify-start items-center`}
        >
            <ul
                data-slide-container={`start`}
                class={`carousel-container flex flex-grow h-full w-full bg-layer-1-surface rounded-2xl scrollbar-hide`}
            >
                <li
                    data-carousel-li={`start`}
                    class={`carousel-li flex flex-col flex-fill w-full gap-12 justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-54 gap-4 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`we`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`hope you`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`find it`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`useful :)`}
                        </p>
                    </div>
                    <button
                        class={`group flex flex-row gap-4 justify-center items-center active:opacity-80`}
                        on:click={async () => {
                            view = `configure`;
                        }}
                    >
                        <p
                            class={`font-mono font-[500] text-layer-1-glyph-hl text-3xl`}
                        >
                            {`*`}
                        </p>
                        <div class={`flex flex-col justify-start items-center`}>
                            <p
                                class={`font-mono font-[500] text-layer-1-glyph-hl text-2xl`}
                            >
                                {`configure`}
                            </p>
                            <p
                                class={`font-mono font-[500] text-layer-1-glyph-hl text-2xl`}
                            >
                                {`device`}
                            </p>
                        </div>
                        <p
                            class={`font-mono font-[500] text-layer-1-glyph-hl text-3xl`}
                        >
                            {`*`}
                        </p>
                    </button>
                </li>
                <li
                    data-carousel-li={`start`}
                    class={`carousel-li flex flex-col flex-fill w-full py-40 justify-between items-center`}
                >
                    <div
                        class={`flex flex-col w-40 gap-2 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`welcome`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`to`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`radroots`}
                        </p>
                    </div>
                    <div class={`flex flex-col justify-start items-center`}>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`direct trade with`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`farmers`}
                        </p>
                    </div>
                </li>
                <li
                    data-carousel-li={`start`}
                    class={`carousel-li flex flex-col flex-fill w-full justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-40 gap-4 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`radroots`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`is an`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`open`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`source`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`app`}
                        </p>
                    </div>
                </li>
                <li
                    data-carousel-li={`start`}
                    class={`carousel-li flex flex-col flex-fill w-full justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-54 gap-4 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`... it's`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`running on`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`a`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`decentralized`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`network`}
                        </p>
                    </div>
                </li>
                <li
                    data-carousel-li={`start`}
                    class={`carousel-li flex flex-col flex-fill w-full justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-54 gap-4 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`connecting`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`farmers`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`and buyers`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`around the`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-3xl`}
                        >
                            {`world.`}
                        </p>
                    </div>
                </li>
            </ul>
            <div
                class={`absolute bottom-0 left-0 flex flex-row h-12 w-full justify-center items-center`}
            >
                <div class={`flex flex-row gap-4 justify-start items-center`}>
                    <Glyph
                        basis={{
                            key: `caret-left`,
                            dim: `sm-`,
                            weight: `bold`,
                            classes:
                                slide_index > 0
                                    ? `h-glyph_btn_sm w-glyph_btn_sm text-layer-2-glyph bg-layer-2-surface rounded-full`
                                    : `h-glyph_btn_sm w-glyph_btn_sm text-layer-2-glyph bg-layer-2-surface rounded-full opacity-60`,
                            callback: async () => {
                                if (slide_index > 0) await slide_prev();
                            },
                        }}
                    />
                    <Glyph
                        basis={{
                            key: `caret-right`,
                            dim: `sm-`,
                            weight: `bold`,
                            classes:
                                slide_index !== slides_param[view].max
                                    ? `h-glyph_btn_sm w-glyph_btn_sm text-layer-2-glyph bg-layer-2-surface rounded-full`
                                    : `h-glyph_btn_sm w-glyph_btn_sm text-layer-2-glyph bg-layer-2-surface rounded-full opacity-60`,
                            callback: async () => {
                                if (slide_index !== slides_param[view].max)
                                    await slide_next();
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    </div>
    <div
        data-view={`configure`}
        class={`hidden flex flex-col h-full w-full py-12 px-6 justify-start items-center`}
    >
        <div
            class={`relative flex flex-col h-full w-full justify-start items-center`}
        >
            <ul
                data-slide-container={`configure`}
                class={`carousel-container flex flex-grow h-full w-full scrollbar-hide`}
            >
                <li
                    data-carousel-li={`configure`}
                    class={`carousel-li flex flex-col flex-fill w-full gap-12 justify-center items-center`}
                >
                    <div
                        class={`flex flex-col w-54 gap-4 justify-start items-center`}
                    >
                        <p
                            class={`font-mono font-[700] text-layer-0-glyph text-2xl`}
                        >
                            {`to start:`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`a keypair will be`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`created`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`... and saved`}
                        </p>
                        <p
                            class={`font-mono font-[400] text-layer-0-glyph text-2xl`}
                        >
                            {`on your device.`}
                        </p>
                    </div>
                    <div
                        class={`flex flex-col gap-6 justify-start items-center`}
                    >
                        <div class={`flex flex-col justify-start items-center`}>
                            <button
                                class={`flex flex-row gap-3 justify-center items-center active:opacity-80`}
                                on:click={async () => {
                                    await create_new_key();
                                }}
                            >
                                <p
                                    class={`font-mono font-[900] text-layer-0-glyph text-xl`}
                                >
                                    {`**`}
                                </p>
                                <p
                                    class={`font-mono font-[900] text-layer-0-glyph text-xl underline`}
                                >
                                    {`create keypair`}
                                </p>
                                <p
                                    class={`font-mono font-[900] text-layer-0-glyph text-xl`}
                                >
                                    {`**`}
                                </p>
                            </button>
                        </div>
                        <button
                            class={`flex flex-col justify-center items-center active:opacity-80`}
                            on:click={async () => {
                                await lc.dialog.alert(`Coming soon!`);
                            }}
                        >
                            <p
                                class={`font-mono font-[500] text-layer-0-glyph-hl text-xl`}
                            >
                                {`i have a keypair`}
                            </p>
                            <p
                                class={`font-mono font-[500] text-layer-0-glyph-hl text-xl`}
                            >
                                {`already...`}
                            </p>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</LayoutView>
