<script lang="ts">
    import { goto } from "$app/navigation";
    import { cl } from "$lib/client";
    import ButtonSubmit from "$lib/components/button-submit.svelte";
    import LayoutTrellis from "$lib/components/layout-trellis.svelte";
    import LayoutView from "$lib/components/layout-view.svelte";
    import Nav from "$lib/components/nav.svelte";
    import { NDKKind } from "@nostr-dev-kit/ndk";
    import { ndk, ndk_event, ndk_user } from "@radroots/svelte-lib";

    let loading = false;
    let value_note_content = ``;

    const nostr_note_publish = async (): Promise<void> => {
        try {
            if (!value_note_content) {
                await cl.dialog.alert(`You must write something to post.`);
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
                await goto(`/nostr/notes`);
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
            label: `Post Note`,
        },
    }}
/>
