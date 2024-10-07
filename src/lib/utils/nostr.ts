import { lc } from "$lib/client";
import NDK, { NDKKind, NDKUser } from "@nostr-dev-kit/ndk";
import { fmt_tags_basis_nip99, ndk_event } from "@radroots/utils";

export const nostr_sync_models_trade_product = async (opts: {
    $ndk: NDK;
    $ndk_user: NDKUser;
}): Promise<void> => {
    try {
        console.log(`(nostr_sync_models_trade_product) run`)

        const trade_products_all = await lc.db.trade_product_get({
            list: [`all`],
        });
        if (`err` in trade_products_all) return;
        for (const trade_product of trade_products_all.results) {
            const tags_basis = await fmt_tags_basis_nip99({
                d_tag: trade_product.id,
                title: trade_product.key,
                summary: `${trade_product.key} ${trade_product.lot} ${trade_product.process}`,
            });
            if (!tags_basis) continue;

            const { $ndk, $ndk_user } = opts;
            const ev = await ndk_event({
                $ndk,
                $ndk_user,
                basis: {
                    kind: NDKKind.Classified,
                    content: `This is a rad roots posting of ${trade_product.key}`,
                    tags: [...tags_basis],
                },
            });
            if (!ev) return;
            await ev.publish();
        }

        console.log(`(nostr_sync_models_trade_product) done`)

    } catch (e) {
        console.log(`(error) nostr_sync_models_trade_product `, e);
    }
};