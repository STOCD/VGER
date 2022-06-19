<script>
  import { onMount } from 'svelte';
  import { activeTab, current_list} from '$lib/stores';
  import Header from '$lib/header/Header.svelte';
  import Grid from '$lib/grid/Grid.svelte';
  import Acronyms from '$lib/acronyms/Acronyms.svelte';
  import Sidebar from '$lib/sidebar/Sidebar.svelte';
  import Settings from '$lib/settings/Settings.svelte';
 
  //default tab
  $current_list = 'starship_traits';
  $activeTab = 'Starship Traits';
  
  onMount(() => {
    // test whether user is on mobile device
    const mobile = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;
  });

</script>

<svelte:head>

  <title>VGER | {$activeTab}</title>

  <!-- this stylesheet is needed for the link and right-angle icons on the sidebar -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

</svelte:head>

<!-- Menu bar -->
<Header />

<!-- Settings sidebar, outside of viewport by default -->
<Settings/>


<main>

  <!-- slots the current module -- is done individually for every module to force reload -->
  {#if $activeTab == 'Acronyms'}
    <Acronyms />
  {:else if $activeTab == 'Starship Traits'}
    <Grid/>
    <Sidebar/>
  {:else if $activeTab == 'Personal Traits'}
    <Grid/>
    <Sidebar/>
  {:else if $activeTab == 'Space Equipment'}
    <Grid/>
    <Sidebar/>
  {:else if $activeTab == 'Ground Equipment'}
    <Grid/>
    <Sidebar/>
  {/if}

</main>

<style>
  main {
    display: flex;
    height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /* minus the height of the rest of the UI -- the term 100vw*(143/1920) calculates the height occupied by the banner image */
    width: 100%;
    margin: 0;
    padding: var(--gutter);
    background-color: var(--dark-background);
    overflow: hidden;
  }
</style>
