<script lang="ts">
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import { trade_offer_form_fields } from "@radroots/client";
    import { fmt_id, InputForm, Nav } from "@radroots/svelte-lib";
</script>

<LayoutView>
    <LayoutTrellis>
        <div
            class={`flex flex-col w-full px-4 gap-3 justify-center items-center`}
        >
            {#each Object.entries(trade_offer_form_fields) as [field_k, field], field_i}
                <div
                    class={`flex flex-col w-full gap-1 justify-start items-start`}
                >
                    <div
                        class={`flex flex-row w-full px-2 justify-start items-center`}
                    >
                        <p
                            class={`font-sans font-[400] uppercase text-layer-2-glyph text-sm`}
                        >
                            {`Product - ${field_k}`}
                        </p>
                    </div>
                    <div
                        class={`form-line-e bg-layer-1-surface text-layer-1-glyph/70 rounded-xl`}
                    >
                        <InputForm
                            basis={{
                                id: fmt_id(field_k),
                                layer: 1,
                                sync: true,
                                field: {
                                    charset: field.charset,
                                    validate: field.validation,
                                },
                            }}
                        />
                    </div>
                </div>
            {/each}
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Offers`,
            route: `/models/trade-offer`,
        },
        title: {
            label: `Add New`,
        },
        option: {
            glyph: {
                key: `info`,
                dim: `md`,
                classes: `text-layer-1-glyph-hl tap-scale`,
            },
            callback: async () => {
                alert(`Todo!`);
            },
        },
    }}
/>
