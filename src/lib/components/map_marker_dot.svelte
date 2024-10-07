<script lang="ts">
    import { Fill } from "@radroots/svelte-lib";
</script>

<div class="flex flex-row p-1">
    <div
        class={`z-20 flex flex-row h-map_circle w-map_circle justify-center items-center bg-white rounded-full shadow-lg`}
    >
        <div
            class={`z-10 flex flex-row h-map_circle_inner w-map_circle_inner justify-center items-center bg-blue-400 rounded-full`}
        >
            <Fill />
        </div>
    </div>
</div>
