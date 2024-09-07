<script lang="ts">
    import { Fill } from "@radroots/svelte-lib";

    type MapMarkerDotStyleKey = `blue`;
    export let basis:
        | {
              style?: MapMarkerDotStyleKey;
          }
        | undefined = undefined;

    $: classes_styles = basis?.style ? styles[basis.style] : styles[`blue`];

    let styles: Record<MapMarkerDotStyleKey, string> = {
        blue: `text-blue-400`,
    };
</script>

<div class="flex flex-row p-1">
    <div
        class={`flex flex-row h-map_circle w-map_circle justify-center items-center bg-white rounded-full shadow-lg`}
    >
        <div
            class={`flex flex-row h-map_circle_inner w-map_circle_inner justify-center items-center rounded-full ${classes_styles}`}
        >
            <Fill />
        </div>
    </div>
</div>
<div class="hidden text-blue-400" />
