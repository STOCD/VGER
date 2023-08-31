<script>
    export let src;
    export let alt;
    export let index;

    import Intersector from './Intersector.svelte';
    import Image from './Image.svelte';
    import { onMount } from 'svelte';
    import { load_progress } from '$lib/stores';

    let native_loading = false;
    let this_img;
    let once_var = false;

    onMount(() => {
        /*if ('loading' in HTMLImageElement.prototype) {
            native_loading = true;
        }*/
        console.log([index, $load_progress, src])
    })

    function image_loaded() {
        once_var = true;
        load_progress.set($load_progress+1);
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
    {#if (intersecting && index < $load_progress + 10) || native_loading}
        <img {src} {alt} on:load={image_loaded} referrerpolicy='no-referrer' loading='lazy'/>
        <!--<Image {alt} {src}/>-->
    {/if}
</Intersector>