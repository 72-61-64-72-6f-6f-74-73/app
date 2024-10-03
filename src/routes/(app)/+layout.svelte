<script lang="ts">
    import { lc } from "$lib/client";
    import { _conf } from "$lib/conf";
    import { app_nostr_key } from "$lib/stores";
    import {
        type NostrRelayFormFields,
        parse_nostr_relay_form_keys,
    } from "@radroots/models";
    import {
        LayoutWindow,
        ndk,
        ndk_init,
        ndk_user,
        nostr_ndk_configured,
        nostr_relays_connected,
        nostr_relays_poll_documents,
        nostr_relays_poll_documents_count,
    } from "@radroots/svelte-lib";
    import { parse_nostr_relay_information_document_fields } from "@radroots/utils";

    app_nostr_key.subscribe(async (_app_nostr_key) => {
        try {
            if (!_app_nostr_key) return;
            const secret_key = await lc.keystore.get(
                _conf.kv.nostr_key(_app_nostr_key),
            );
            if (!secret_key) {
                alert(`!secret_key`); //@todo
                return;
            }
            const nostr_relays = await lc.db.nostr_relay_get({
                list: ["all"],
            });
            if (typeof nostr_relays === `string`) {
                alert(nostr_relays); //@todo
                return;
            }
            for (const { url } of nostr_relays) $ndk.addExplicitRelay(url);
            await $ndk.connect();
            const ndk_user = await ndk_init({
                $ndk,
                secret_key,
            });
            if (!ndk_user) {
                nostr_ndk_configured.set(false);
                return;
            }
            $ndk_user = ndk_user;
            $ndk_user.ndk = $ndk;
            nostr_ndk_configured.set(true);
        } catch (e) {
            console.log(`(app_nostr_key) error `, e);
        }
    });

    nostr_ndk_configured.subscribe(async (_nostr_ndk_configured) => {
        try {
            if (!_nostr_ndk_configured) return;
            console.log(`(nostr_ndk_configured) success`);
            nostr_relays_poll_documents.set(true);
        } catch (e) {
            console.log(`(error) nostr_ndk_configured`, e);
        }
    });

    nostr_relays_poll_documents.subscribe(
        async (_nostr_relays_poll_documents) => {
            try {
                if (!_nostr_relays_poll_documents) return;
                await fetch_relay_documents();
            } catch (e) {
                console.log(`(error) nostr_relays_poll_documents`, e);
            }
        },
    );

    nostr_relays_connected.subscribe(async (_nostr_relays_connected) => {
        try {
            if (!_nostr_relays_connected.length) return;
            else if ($nostr_ndk_configured) {
                console.log(`nostr sync...`);
            }
        } catch (e) {
            console.log(`(error) nostr_relays_connected `, e);
        }
    });

    const fetch_relay_documents = async (): Promise<void> => {
        try {
            if (
                $nostr_relays_poll_documents_count >=
                _conf.nostr.relay_polling_count_max
            )
                return;
            nostr_relays_poll_documents_count.set(
                $nostr_relays_poll_documents_count + 1,
            );
            const nostr_relays = await lc.db.nostr_relay_get({
                list: ["on_key", { public_key: $app_nostr_key }],
            });
            if (typeof nostr_relays === `string`) throw new Error();

            const unconnected_relays = nostr_relays.filter(
                (i) => !$nostr_relays_connected.includes(i.id),
            );
            if (unconnected_relays.length === 0) {
                nostr_relays_poll_documents.set(false);
                return;
            }

            for (const nostr_relay of unconnected_relays) {
                const res = await lc.http.fetch({
                    url: nostr_relay.url.replace(`ws://`, `http://`),
                    headers: {
                        Accept: "application/nostr+json",
                    },
                });
                if (typeof res === `string`) continue;
                else if (res.status === 200 && res.data) {
                    const doc = parse_nostr_relay_information_document_fields(
                        res.data,
                    );
                    if (!doc) continue;
                    const fields: Partial<NostrRelayFormFields> = {};
                    for (const [k, v] of Object.entries(doc)) {
                        const field_k = parse_nostr_relay_form_keys(k);
                        if (field_k) fields[field_k] = v;
                    }
                    if (Object.keys(fields).length < 1) continue;
                    await lc.db.nostr_relay_update({
                        on: {
                            url: nostr_relay.url,
                        },
                        fields,
                    });
                    nostr_relays_connected.set(
                        Array.from(
                            new Set([
                                ...$nostr_relays_connected,
                                nostr_relay.id,
                            ]),
                        ),
                    );
                }
            }

            setTimeout(
                fetch_relay_documents,
                _conf.delay.nostr_relay_poll_document,
            );
        } catch (e) {
            console.log(`(error) fetch_relay_documents `, e);
        }
    };
</script>

<LayoutWindow>
    <slot />
</LayoutWindow>
