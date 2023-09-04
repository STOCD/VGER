<script>
    import { onMount } from 'svelte';
    
    export let once = false;

    let intersecting = false;
    let container;

    onMount(() => {
        if (typeof IntersectionObserver !== 'undefined') {
            const rootMargin = `0px 0px 0px 0px`;

            const observer = new IntersectionObserver(entries => {
                intersecting = entries[0].isIntersecting;
                if (intersecting && once) {
                    observer.unobserve(container);
                }
            }, {rootMargin});
            observer.observe(container);
            return () => observer.unobserve(container);
        }
    });
</script>

<style>
    div {
        margin: 0;
        padding: 0;
    }
</style>

<div bind:this={container}>
    <slot {intersecting}/>
</div>