<script lang="ts">
    import { lc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import type { NostrProfile } from "@radroots/models";
    import {
        Glyph,
        LayoutTrellis,
        LayoutView,
        Nav,
        SelectElement,
        TrellisTitle,
        app_nostr_key,
        app_notify,
        nav_prev,
        route,
        t,
        type ISelectOption,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    type OptionsListKey =
        | `view-key`
        | `set-key-active`
        | `edit-profile-name`
        | `add-profile-name`
        | `delete-key`;

    const options_list: ISelectOption<OptionsListKey>[] = [
        {
            value: `view-key`,
            label: `${$t(`icu.view_*`, { value: `${$t(`common.details`)}`.toLowerCase() })}`,
        },
        {
            value: `edit-profile-name`,
            label: `${$t(`icu.edit_*`, { value: `${$t(`common.profile_name`)}`.toLowerCase() })}`,
        },
        {
            value: `add-profile-name`,
            label: `${$t(`icu.add_*`, { value: `${$t(`common.profile_name`)}`.toLowerCase() })}`,
        },
        {
            value: `set-key-active`,
            label: `${$t(`icu.set_as_*`, { value: `${$t(`common.active`)}`.toLowerCase() })}`,
        },
        {
            value: `delete-key`,
            label: `${$t(`icu.delete_*`, { value: `${$t(`common.key`)}`.toLowerCase() })}`,
        },
    ];

    let ls_nostr_keys: {
        public_key: string;
        nostr_profile?: NostrProfile;
    }[] = [];

    onMount(async () => {
        try {
            const ks_keys = ((await lc.keystore.keys()) || [])
                .filter((i) => i.startsWith(_conf.kv.nostr_key(``)))
                .map((i) => i.slice(_conf.kv.nostr_key(``).length));
            if (!ks_keys)
                app_notify.set(`No keys are configured on this device`);

            for (const public_key of ks_keys) {
                const nostr_profile = await lc.db.nostr_profile_get({
                    public_key,
                });

                ls_nostr_keys = [
                    ...ls_nostr_keys,
                    {
                        public_key,
                        nostr_profile: Array.isArray(nostr_profile)
                            ? nostr_profile[0]
                            : undefined,
                    },
                ];
            }
        } catch (e) {
        } finally {
        }
    });

    const handle_key_options_press = async (opts: {
        option: string;
        public_key: string;
    }): Promise<void> => {
        if (opts.option === `view-key`) {
            $nav_prev.push({
                route: `/nostr/keys`,
                label: `Keys`,
            });
            await route(`/models/nostr-profile/view`, [
                [`nostr_pk`, opts.public_key],
            ]);
        } else if (
            opts.option === `add-profile-name` ||
            opts.option === `edit-profile-name`
        ) {
            $nav_prev.push({
                route: `/nostr/keys`,
                label: `Keys`,
            });
            await route(`/models/nostr-profile/edit/field`, [
                [`nostr_pk`, opts.public_key],
                [`rkey`, `name`],
            ]);
        } else if (opts.option === `set-key-active`) {
            /*
            app_key.set(public_key);
            await load_page();
            */
        } else if (opts.option === `delete-key`) {
            /*
            if ($app_key === public_key)
                return await appc.dialog.alert({
                    msg: `cannot delete active key`,
                });

            const confirm = await appc.dialog.confirm({
                msg: `${$t(`common.this_action_cannot_be_reverted`)}. ${$t(`nostr.key.delete.dialog_1`, { value: public_key })}. ${$t(`common.are_you_sure`)}`,
            });
            if (confirm === true) {
                console.log(`delete pubkey! `, public_key);
                const result = await appc.sql.nostr_key_delete({ public_key });
                if (result === true) await load_page();
            }
                */
        }
    };
</script>

<LayoutView basis={{ fade: true }}>
    <LayoutTrellis>
        <div class={`flex flex-col w-full justify-start items-center`}>
            <TrellisTitle
                layer={0}
                basis={{
                    value: `${$t(`icu.nostr_*`, { value: `${$t(`common.keys`)}` })}`,
                }}
            />
            {#if ls_nostr_keys.length}
                {#each ls_nostr_keys as ks_key (ks_key.public_key)}
                    <div
                        class={`relative flex flex-col pt-4 pb-5 px-[9px] bg-layer-1-surface rounded-xl overflow-hidden active:ring-4 active:ring-layer-2-surface/80 transition-all tap-rise-1 active:opacity-60`}
                    >
                        <button
                            class={`flex flex-col h-full w-full pt-[2px] pl-1 gap-1 items-start`}
                            on:click|preventDefault={async () => {
                                $nav_prev.push({
                                    route: `/nostr/keys`,
                                    label: `Keys`,
                                });
                                await route(`/models/nostr-profile/view`, [
                                    [`nostr_pk`, ks_key.public_key],
                                ]);
                            }}
                        >
                            <div
                                class={`flex flex-row w-full pl-1 gap-3 justify-start items-center`}
                            >
                                <p
                                    class={`font-mono text-[14px] text-layer-1-glyph-shade text-ellipsis overflow-hidden`}
                                >
                                    {ks_key.nostr_profile?.name
                                        ? ks_key.nostr_profile?.name
                                        : `(${`${$t(`icu.no_*`, { value: `${$t(`common.profile`)}` })}`})`}
                                </p>
                                {#if ks_key.public_key === $app_nostr_key}
                                    <div class={`flex flex-row`}>
                                        <div
                                            class={`flex flex-row h-[16px] justify-center items-center px-[6px] bg-success/70 rounded-md -translate-y-[1px]`}
                                        >
                                            <p
                                                class={`font-mono font-[900] text-[8px] text-white text-ellipsis overflow-hidden`}
                                            >
                                                {`${$t(`common.active`)}`}
                                            </p>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                            <div
                                class={`grid grid-cols-12 flex flex-row h-6 w-full pt-2 gap-2 items-center`}
                            >
                                <div
                                    class={`col-span-2 flex flex-row h-full items-center `}
                                >
                                    <div
                                        class={`flex flex-row h-[1rem] px-[9px] justify-start items-center bg-zinc-800/90 rounded-[5px] translate-y-[1px]`}
                                    >
                                        <p
                                            class={`font-mono font-[600] text-[0.9rem] text-layer-2-glyph lowercase line-clamp-1`}
                                        >
                                            {`${$t(`common.key`)}`}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    class={`col-span-10 flex flex-row h-full items-center overflow-x-hidden`}
                                >
                                    <p
                                        class={`font-mono text-[0.9rem] text-layer-1-glyph line-clamp-1`}
                                    >
                                        {`${`${lc.nostr.lib.npub(ks_key.public_key) || ""}`.slice(
                                            0,
                                            24,
                                        )}...`}
                                    </p>
                                </div>
                            </div>
                        </button>
                        <div
                            class={`z-10 absolute top-2 right-3 flex flex-row h-full justify-end pr-1`}
                        >
                            <SelectElement
                                basis={{
                                    args: {
                                        layer: 0,
                                        mask: true,
                                        callback: async ({ value }) => {
                                            await handle_key_options_press({
                                                option: value,
                                                public_key: ks_key.public_key,
                                            });
                                        },
                                        options: [
                                            {
                                                entries: options_list.filter(
                                                    (i) =>
                                                        !(
                                                            !ks_key
                                                                .nostr_profile
                                                                ?.name &&
                                                            i.value ===
                                                                `edit-profile-name`
                                                        ) &&
                                                        !(
                                                            ks_key.nostr_profile
                                                                ?.name &&
                                                            i.value ===
                                                                `add-profile-name`
                                                        ) &&
                                                        !(
                                                            ks_key.nostr_profile
                                                                ?.public_key ===
                                                                $app_nostr_key &&
                                                            i.value ===
                                                                `set-key-active`
                                                        ),
                                                ),
                                            },
                                        ],
                                    },
                                }}
                            >
                                <svelte:fragment slot="element">
                                    <Glyph
                                        basis={{
                                            key: `dots-three`,
                                            dim: `sm`,
                                            classes: `text-layer-1-glyph`,
                                        }}
                                    />
                                </svelte:fragment>
                            </SelectElement>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Nostr`,
            route: `/nostr`,
        },
        title: {
            label: {
                value: `Keys`,
            },
        },
    }}
/>
