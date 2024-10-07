<script lang="ts">
    import { lc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import type { NostrProfile, NostrRelay } from "@radroots/models";
    import {
        app_nostr_key,
        app_notify,
        app_submit_route,
        as_glyph_key,
        clipboard_copy,
        LayoutTrellis,
        LayoutView,
        Nav,
        nav_prev,
        nostr_relays_connected,
        qp_nostr_pk,
        route,
        show_toast,
        t,
        Trellis,
        type ITrellisKindTouch,
    } from "@radroots/svelte-lib";
    import { onMount } from "svelte";

    type LoadData = {
        nostr_profile: NostrProfile;
        nostr_relays: NostrRelay[];
        nostr_relays_unconnected: NostrRelay[];
        secret_key: string;
    };
    let ld: LoadData | undefined = undefined;

    let show_public_key_hex = false;
    let show_secret_key_hex = false;
    let vl_secret_key_unlock = false;

    onMount(async () => {
        try {
            if (!$qp_nostr_pk) app_notify.set(`Error loading page`);
            ld = await load_data();
        } catch (e) {
        } finally {
        }
    });

    const load_data = async (): Promise<LoadData | undefined> => {
        try {
            const nostr_profiles = await lc.db.nostr_profile_get({
                public_key: $qp_nostr_pk,
            });
            if (`err` in nostr_profiles) {
                app_notify.set(`Error loading page`);
                return;
            } else if (nostr_profiles.results.length < 1) {
                app_notify.set(`Error loading page`);
                return;
            }

            const secret_key = await lc.keystore.get(
                _conf.kv.nostr_key($qp_nostr_pk),
            );

            if (!secret_key) {
                app_notify.set(`Error loading profile`);
                return;
            }

            const nostr_relays = await lc.db.nostr_relay_get({
                list: [`on_profile`, { public_key: $qp_nostr_pk }],
                sort: `oldest`,
            });

            const nostr_relays_unconnected = await lc.db.nostr_relay_get({
                list: [`off_profile`, { public_key: $qp_nostr_pk }],
                sort: `oldest`,
            });

            const data: LoadData = {
                nostr_profile: nostr_profiles.results[0],
                secret_key,
                nostr_relays:
                    `results` in nostr_relays ? nostr_relays.results : [],
                nostr_relays_unconnected:
                    `results` in nostr_relays_unconnected
                        ? nostr_relays_unconnected.results
                        : [],
            };
            return data;
        } catch (e) {
            console.log(`(error) load_data `, e);
        }
    };

    $: {
        console.log(JSON.stringify(ld, null, 4), `ld`);
    }

    let tr_nostr_relays: ITrellisKindTouch[] = [];
    $: tr_nostr_relays =
        ld?.nostr_profile && ld?.nostr_relays.length
            ? ld.nostr_relays.map((nostr_relay) => ({
                  layer: 1,
                  touch: {
                      label: {
                          left: [
                              {
                                  value: nostr_relay.url,
                              },
                          ],
                      },
                      callback: async () => {
                          if (!ld) return;
                          nav_prev.set([
                              ...$nav_prev,
                              {
                                  route: `/models/nostr-profile/view`,
                                  label: `Profile`,
                                  params: [
                                      [`nostr_pk`, ld.nostr_profile.public_key],
                                  ],
                              },
                          ]);
                          await route(`/models/nostr-relay/view`, [
                              [`id`, nostr_relay.id],
                          ]);
                      },
                  },
                  offset: {
                      mod: {
                          glyph_circle: {
                              classes_wrap: $nostr_relays_connected.includes(
                                  nostr_relay.id,
                              )
                                  ? `bg-layer-1-glyph-hl/60 group-active:opacity-40`
                                  : `bg-yellow-600/90 group-active:opacity-40`,
                              glyph: {
                                  classes: $nostr_relays_connected.includes(
                                      nostr_relay.id,
                                  )
                                      ? `text-white/80 group-active:opacity-60 fade-in`
                                      : `text-yellow-100/80 group-active:opacity-60 fade-in`,
                                  key: $nostr_relays_connected.includes(
                                      nostr_relay.id,
                                  )
                                      ? `check`
                                      : `exclamation-mark`,
                                  weight: `bold`,
                                  dim: `xs-`,
                              },
                          },
                      },
                      callback: async (ev) => {
                          ev.stopPropagation();
                      },
                  },
              }))
            : [];

    const toggle_hex_pk = (): void => {
        show_public_key_hex = !show_public_key_hex;
    };

    const toggle_hex_sk = (): void => {
        show_secret_key_hex = !show_secret_key_hex;
    };
</script>

<LayoutView>
    <LayoutTrellis>
        {#if ld}
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.public_key`)}`,
                            link: {
                                label: {
                                    swap: {
                                        on: {
                                            classes: `pl-1 text-trellisTitleNote uppercase -translate-y-[1px] -translate-x-[2px] text-layer-0-glyph-shade`,
                                            value: `${$t(`common.npub`)}`,
                                        },
                                        off: {
                                            classes: `pl-1 text-trellisTitleNote uppercase -translate-y-[1px] -translate-x-[6px] text-layer-0-glyph-shade`,
                                            value: `${$t(`common.hex`)}`,
                                        },
                                        toggle: show_public_key_hex,
                                    },
                                },
                                callback: async () => {
                                    toggle_hex_pk();
                                },
                            },
                        },
                        list: [
                            {
                                offset: {
                                    mod: `sm`,
                                },
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                value: show_public_key_hex
                                                    ? ld.nostr_profile
                                                          .public_key
                                                    : lc.nostr.lib.npub(
                                                          ld.nostr_profile
                                                              .public_key,
                                                      ),
                                            },
                                        ],
                                    },
                                    callback: async () => {
                                        if (!ld) return;
                                        await show_toast({
                                            args: {
                                                position: `bottom-center`,
                                                label: {
                                                    value: `${`${$t(
                                                        `icu.*_as`,
                                                        {
                                                            value: `${$t(
                                                                `icu.*_copied`,
                                                                {
                                                                    value: `${$t(
                                                                        `common.public_key`,
                                                                    )}`,
                                                                },
                                                            )}`,
                                                        },
                                                    )}`} ${show_public_key_hex ? `${$t(`common.hex`)}`.toLowerCase() : `${$t(`common.npub`)}`.toLowerCase()}.`,
                                                },
                                            },
                                            callback: async () => {
                                                if (!ld) return;
                                                await clipboard_copy(
                                                    show_public_key_hex
                                                        ? ld?.nostr_profile
                                                              .public_key
                                                        : lc.nostr.lib.npub(
                                                              ld.nostr_profile
                                                                  .public_key,
                                                          ),
                                                );
                                            },
                                        });
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.secret_key`)}`,
                            link: {
                                label: {
                                    swap: {
                                        on: {
                                            classes: `pl-1 text-trellisTitleNote uppercase -translate-y-[1px] -translate-x-[2px] text-layer-0-glyph-shade`,
                                            value: `${$t(`common.nsec`)}`,
                                        },
                                        off: {
                                            classes: `pl-1 text-trellisTitleNote uppercase -translate-y-[1px] -translate-x-[6px] text-layer-0-glyph-shade`,
                                            value: `${$t(`common.hex`)}`,
                                        },
                                        toggle: vl_secret_key_unlock
                                            ? show_secret_key_hex
                                            : false,
                                    },
                                },
                                callback: async () => {
                                    if (vl_secret_key_unlock) toggle_hex_sk();
                                },
                            },
                        },
                        list: [
                            {
                                offset: {
                                    mod: `sm`,
                                },
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                value: vl_secret_key_unlock
                                                    ? show_secret_key_hex
                                                        ? ld.secret_key
                                                        : lc.nostr.lib.nsec(
                                                              ld.secret_key,
                                                          )
                                                    : `•`.repeat(40),
                                            },
                                        ],
                                    },
                                    callback: async () => {
                                        if (!ld) return;
                                        await show_toast({
                                            args: {
                                                position: `bottom-center`,
                                                label: {
                                                    value: `${`${$t(
                                                        `icu.*_as`,
                                                        {
                                                            value: `${$t(
                                                                `icu.*_copied`,
                                                                {
                                                                    value: `${$t(
                                                                        `common.secret_key`,
                                                                    )}`,
                                                                },
                                                            )}`,
                                                        },
                                                    )}`} ${show_secret_key_hex ? `${$t(`common.hex`)}`.toLowerCase() : `${$t(`common.nsec`)}`.toLowerCase()}.`,
                                                },
                                            },
                                            callback: async () => {
                                                if (!ld) return;
                                                await clipboard_copy(
                                                    show_secret_key_hex
                                                        ? ld.secret_key
                                                        : lc.nostr.lib.npub(
                                                              ld.secret_key,
                                                          ),
                                                );
                                            },
                                        });
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.status`)}`,
                        },
                        list: [
                            {
                                hide_active: vl_secret_key_unlock,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes:
                                                    $app_nostr_key ===
                                                    ld.nostr_profile.public_key
                                                        ? `text-success font-[400]`
                                                        : undefined,
                                                value:
                                                    $app_nostr_key ===
                                                    ld.nostr_profile.public_key
                                                        ? `${$t(`common.active`)}`
                                                        : `${$t(
                                                              `common.public_key`,
                                                          )}`,
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`icu.connected_*`, { value: `${$t(`common.relays`)}` })}`,
                        },
                        list: tr_nostr_relays.length
                            ? tr_nostr_relays
                            : [
                                  {
                                      hide_active: vl_secret_key_unlock,
                                      touch: {
                                          label: {
                                              left: [
                                                  {
                                                      classes: ld.nostr_profile
                                                          .name
                                                          ? ``
                                                          : `text-layer-1-glyph-shade`,
                                                      value:
                                                          ld.nostr_profile
                                                              .name ||
                                                          `${$t(`icu.no_*_published`, { value: `${$t(`common.relays`)}`.toLowerCase() })}`,
                                                  },
                                              ],
                                          },
                                      },
                                  },
                              ],
                    },
                }}
            />

            <Trellis
                basis={{
                    args: {
                        layer: 1,
                        title: {
                            value: `${$t(`common.profile_name`)}`,
                        },
                        list: [
                            {
                                hide_active: vl_secret_key_unlock,
                                touch: {
                                    label: {
                                        left: [
                                            {
                                                classes: ld.nostr_profile.name
                                                    ? ``
                                                    : `text-layer-1-glyph-shade`,
                                                value:
                                                    ld.nostr_profile.name ||
                                                    `${$t(`icu.no_*_published`, { value: `${$t(`common.profile`)}`.toLowerCase() })}`,
                                            },
                                        ],
                                    },
                                    end: {
                                        icon: {
                                            key: as_glyph_key(`caret-right`),
                                        },
                                    },
                                    callback: async () => {
                                        if (!ld) return;
                                        app_submit_route.set({
                                            route: `/models/nostr-profile/view`,
                                            params: [
                                                [
                                                    `nostr_pk`,
                                                    ld.nostr_profile.public_key,
                                                ],
                                            ],
                                        });
                                        $nav_prev.push({
                                            route: `/models/nostr-profile/view`,
                                            label: `Key`,
                                            params: [
                                                [
                                                    `nostr_pk`,
                                                    ld.nostr_profile.public_key,
                                                ],
                                            ],
                                        });
                                        await route(
                                            `/models/nostr-profile/edit/field`,
                                            [
                                                [
                                                    `nostr_pk`,
                                                    ld.nostr_profile.public_key,
                                                ],
                                                [`rkey`, `name`],
                                            ],
                                        );
                                    },
                                },
                            },
                        ],
                    },
                }}
            />
        {/if}
    </LayoutTrellis>
</LayoutView>
<Nav
    basis={{
        prev: {
            label: `${$t(`common.back`)}`,
            route: `/models/nostr-profile`,
        },
        title: {
            label: {
                classes: `capitalize`,
                value: `${$t(`common.key`)}`,
            },
        },
        option: {
            label: {
                swap: {
                    on: {
                        value: `${$t(`common.done`)}`,
                    },
                    off: {
                        value: `${$t(`common.unlock`)}`,
                    },
                    toggle: vl_secret_key_unlock,
                },
            },
            callback: async (el) => {
                if (el) {
                    vl_secret_key_unlock =
                        !el.classList.contains(`swap-active`);
                }
                if (vl_secret_key_unlock) show_secret_key_hex = false;
            },
        },
    }}
/>
