<script>
    import { onMount } from 'svelte';
    import { 
        activeTab, mobile, mobile_auto, mobile_override, starship_traits_ready,
        equipment_ready, personal_traits_ready
    } from '$lib/stores';
    import Header from '$lib/header/Header.svelte';
    import Grid from '$lib/grid/Grid.svelte';
    import Acronyms from '$lib/acronyms/Acronyms.svelte';
    import Sidebar from '$lib/sidebar/Sidebar.svelte';
    import Settings from '$lib/settings/Settings.svelte';
    import MobileSidebar from '$lib/sidebar/MobileSidebar.svelte';

    // recieves data from load function
    export let data;
    const acr = data.acronyms;
    let starship_trait_data = [];
    let space_equipment_data = [];
    let ground_equipment_data = [];
    let personal_trait_data = [];

    // viewport height
    let vh = 0;

    //default tab
    $activeTab = 'Acronyms';

    onMount(() => {
    // test whether user is on mobile device
    $mobile_auto = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;

    // set viewport height
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    fetch('api/starshiptraits').then(response => response.json()).then(
        obj => {
            starship_trait_data = obj.starship_traits;
            $starship_traits_ready = true;
        }
    ).catch(err => console.log(err));
    fetch('api/traits').then(response => response.json()).then(
        obj => {
            personal_trait_data = obj.personal_traits;
            $personal_traits_ready = true;
        }
    ).catch(err => console.log(err));
    fetch('api/equipment').then(response => response.json()).then(
        obj => {
            space_equipment_data = obj.space_equipment;
            ground_equipment_data = obj.ground_equipment;
            $equipment_ready = true;
        }
    ).catch(err => console.log(err));

    });

    // makes sure the app is always in the right mode: Desktop / Mobile
    $: {
    if ($mobile_override === 'auto') {
        $mobile = $mobile_auto;
    }
    else {
        let new_mobile = $mobile_override == 'pc' ? false : true;
        if (new_mobile != $mobile) {
            $mobile = new_mobile;
        }
    }
    }
</script>

<style>
  main {
    display: flex;/* minus the height of the rest of the UI -- the term 100vw*(143/1920) calculates the height occupied by the banner image */
    height: calc(100vh - 100vw * (143/1920) - 5 * var(--gutter));
    width: 100%;
    margin: 0;
    padding: var(--gutter);
    background-color: var(--dark-background);
    overflow: hidden;
    border-radius: 0 0 var(--gutter) var(--gutter);
  }
  aside {
  width: 30%;
  padding: 1rem;
  background-color: var(--dark-background);
  border: calc(.5*var(--gutter)) solid var(--light-background);
  border-radius: var(--gutter);
  overflow-y: auto;
}
</style>

<svelte:head>

  <title>VGER | {$activeTab}</title>

  <!-- this stylesheet is needed for the link and right-angle icons on the sidebar -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

</svelte:head>

<!-- Menu bar -->
<Header />

<!-- Settings sidebar, outside of viewport by default -->
<Settings/>

{#if $mobile}
  <MobileSidebar/>
{/if}

<main>
  <!-- slots the current module -- is done individually for every module to force reload -->
  {#if $activeTab == 'Acronyms'}
    <Acronyms {acr} />
  {:else if $activeTab == 'Starship Traits'}
    <Grid data={starship_trait_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Personal Traits'}
    <Grid data={personal_trait_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Space Equipment'}
    <Grid data={space_equipment_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Ground Equipment'}
    <Grid data={ground_equipment_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {/if}
</main>