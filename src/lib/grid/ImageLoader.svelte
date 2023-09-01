<script>
    export let src;
    export let alt;

    import Intersector from './Intersector.svelte';
    import { load_progress, current_list } from '$lib/stores';

    let once_var = false;
    let error_handled = false;
    let this_image;

    function image_loaded() {
        once_var = true;
        load_progress.set($load_progress+1);
    }

    async function image_error() {
        if (!error_handled) {
            const this_type = $current_list;
            const this_name = src.split('/').pop()
            const response = await fetch(`api/images?image=${this_name}&type=${this_type}`, {method: 'PUT'})
            this_image.src = await response.text();
            error_handled = true;
        }
    }
</script>

<style>
    img {
        width: var(--card-image-width);
        border-radius: calc(.5*var(--gutter));
        display: block;
    }
</style>

<Intersector once={once_var} let:intersecting={intersecting}>
    {#if intersecting}
        <img {src} {alt} on:load={image_loaded} on:error={image_error} bind:this={this_image} referrerpolicy='no-referrer' loading='lazy'/>
        <!--<Image {alt} {src}/>-->
    {/if}
</Intersector>
