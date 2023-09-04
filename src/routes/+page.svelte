<script>
  import { onMount } from 'svelte';
  import { activeTab, current_list, mobile, mobile_auto, mobile_override} from '$lib/stores';
  import Header from '$lib/header/Header.svelte';
  import Grid from '$lib/grid/Grid.svelte';
  import Acronyms from '$lib/acronyms/Acronyms.svelte';
  import Sidebar from '$lib/sidebar/Sidebar.svelte';
  import Settings from '$lib/settings/Settings.svelte';
  import MobileSidebar from '$lib/sidebar/MobileSidebar.svelte';

  // recieves data from load function
  export let data;

  const card_data = data[0];
  const acr = data[1].content;
 
  // viewport height
  let vh = 0;

  //default tab
  $current_list = 'starship_traits';
  $activeTab = 'Starship Traits';
  
  onMount(() => {
    // test whether user is on mobile device
    $mobile_auto = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;

    // set viewport height
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`)
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
    display: flex;
    height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /* minus the height of the rest of the UI -- the term 100vw*(143/1920) calculates the height occupied by the banner image */
    height: calc(var(--vh, 1vh) * 100 - 100vw*(143/1920) - 5*var(--gutter));
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
    <Grid {card_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Personal Traits'}
    <Grid {card_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Space Equipment'}
    <Grid {card_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Ground Equipment'}
    <Grid {card_data}/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {/if}
</main>