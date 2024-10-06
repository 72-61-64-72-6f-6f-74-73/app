<script lang="ts">
    import { lc } from "$lib/client";
    import ButtonSubmit from "$lib/components/button-submit.svelte";
    import { NDKKind } from "@nostr-dev-kit/ndk";
    import {
        LayoutTrellis,
        LayoutView,
        Nav,
        ndk,
        ndk_user,
        route,
        t,
    } from "@radroots/svelte-lib";
    import { ndk_event } from "@radroots/utils";

    let loading = false;
    let value_note_content = ``;

    const nostr_note_publish = async (): Promise<void> => {
        try {
            if (!value_note_content) {
                await lc.dialog.alert(`You must write something to post.`);
                return;
            }

            loading = true;

            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Text,
                    content: value_note_content,
                },
            });
            if (ev) {
                await ev.publish();
                await route(`/nostr/notes`);
            }
        } catch (e) {
            console.log(`(error) nostr_note_publish `, e);
        } finally {
            loading = false;
        }
    };
</script>

<LayoutView basis={{ fade: true }}>
    <LayoutTrellis>
        <div class={`flex flex-col w-full gap-3 justify-center items-center`}>
            <textarea
                class="input-simple p-4 h-44 rounded-xl"
                placeholder="Write your note here"
                bind:value={value_note_content}
            />
            <div class={`flex flex-row w-full justify-end items-center`}>
                <ButtonSubmit
                    basis={{
                        callback: async () => {
                            await nostr_note_publish();
                        },
                        loading,
                    }}
                />
            </div>
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Notes`,
            route: `/nostr/notes`,
        },
        title: {
            label: {
                value: `${$t(`icu.post_*`, { value: `Note` })}`,
            },
        },
    }}
/>
