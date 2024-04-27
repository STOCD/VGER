<script>
    export let src;
    export let alt;

    import Intersector from './Intersector.svelte';

    let once_var = true;
    let error_handled = false;
    let this_image;

    async function image_error() {
        if (!error_handled) {
            const this_name = src.split('/').pop()
            fetch(`api/images?image=${this_name}`, {method: 'POST'});
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
        <img {src} {alt} on:error={image_error} bind:this={this_image} referrerpolicy='no-referrer' loading='lazy'/>
    {/if}
</Intersector>
