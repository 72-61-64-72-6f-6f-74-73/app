<script lang="ts">
    import { LayoutView, Nav } from "@radroots/svelte-lib";
</script>

<LayoutView basis={{ classes: `px-4 gap-8` }}>test</LayoutView>
<Nav
    basis={{
        prev: {
            label: `Home`,
            route: `/`,
        },
        title: {
            label: {
                value: `Test`,
            },
        },
    }}
/>
