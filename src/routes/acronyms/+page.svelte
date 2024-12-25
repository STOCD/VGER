<script>
    import Acronyms from '$lib/acronyms/Acronyms.svelte';

    export let data;
</script>

<svelte:head>
    <title>VGER | Acronyms</title>
</svelte:head>

{#await data.acronyms}
    <div class='loader_container'>
        <span class='loading'></span>
    </div>
{:then acr} 
    <Acronyms {acr}/>
{/await}
