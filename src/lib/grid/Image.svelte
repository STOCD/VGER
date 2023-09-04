<script>
    export let src;
    export let alt;

    import { onMount } from 'svelte';

    let loaded = false;
    let thisImage;

    onMount(() => {
        thisImage.onload = () => {
            loaded = true;
        }
    });
</script>

<style>
    img {
        width: var(--card-image-width);
        border-radius: calc(.5*var(--gutter));
        display: block;
        opacity: 0;
    }

    img.loaded {
        opacity: 1;
    }
</style>

<img {src} {alt} class:loaded bind:this={thisImage} referrerpolicy='no-referrer' loading='lazy'/>
