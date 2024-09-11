<script lang="ts">
    import LayoutView from "$lib/components/layout-view.svelte";
    import { Nav } from "@radroots/svelte-lib";
</script>

<LayoutView basis={{ classes: `px-4 gap-8` }}>test</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Home`,
            route: `/`,
        },
        title: {
            label: `Test`,
        },
    }}
/>
