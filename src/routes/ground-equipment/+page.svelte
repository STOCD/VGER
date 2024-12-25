<script>
    import Grid from '$lib/grid/Grid.svelte';
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import MobileSidebar from '$lib/sidebar/MobileSidebar.svelte';
    import { mobile } from '$lib/stores';
    export let data;
</script>

<svelte:head>
    <title>VGER | Ground Equipment</title>
</svelte:head>

{#if $mobile}
  <MobileSidebar/>
{/if}
<section class='section' class:mobile_section='{$mobile}' id='main_section'>
    {#await data.equipment}
        <div class='loader_container'>
            <span class='loading'></span>
        </div>
    {:then items}
        <Grid data={{items: items.ground_equipment, tab: 'Ground Equipment'}}/>
    {/await}
</section>
{#if !$mobile}
    <aside>
        <Sidebar/>
    </aside>
{/if}
