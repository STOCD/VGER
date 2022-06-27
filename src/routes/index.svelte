<script>
  import { onMount } from 'svelte';
  import { activeTab, current_list, mobile, mobile_auto, mobile_override, reload_queue} from '$lib/stores';
  import Header from '$lib/header/Header.svelte';
  import Grid from '$lib/grid/Grid.svelte';
  import Acronyms from '$lib/acronyms/Acronyms.svelte';
  import Sidebar from '$lib/sidebar/Sidebar.svelte';
  import Settings from '$lib/settings/Settings.svelte';
  import MobileSidebar from '$lib/sidebar/MobileSidebar.svelte';
 
  //default tab
  $current_list = 'starship_traits';
  $activeTab = 'Starship Traits';
  
  onMount(() => {
    // test whether user is on mobile device
    $mobile_auto = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;
  });

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

  reload_queue.subscribe( () => handleImageReload());

  function handleImageReload() {
    if ($reload_queue.length > 0) {
      current = $reload_queue.shift();
      const res = fetchAndRetry(async () => await fetch(current['path']));
      if (res.status == 200) {
        current['callback']();
      }
      if ($reload_queue.length > 0) {
        handleImageReload()
      }
    }
  }

  async function fetchAndRetry(f) {
    const r = await f();
    if (r.status === 409) {
      const retryAfter = r.headers.get('retry-after');
      const sleepTime = getMillisToSleep(retryAfter);
      let r2 = null;
      setTimeout(()=> {r2 = fetchAndRetry(f)}, sleepTime);
      return r2
    }
    return r
  }

  function getMillisToSleep (retryHeaderString) {
    let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000)
    if (isNaN(millisToSleep)) {
      millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date())
    }
    return millisToSleep
}

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

{#if $mobile}
  <MobileSidebar/>
{/if}

<main>

  <!-- slots the current module -- is done individually for every module to force reload -->
  {#if $activeTab == 'Acronyms'}
    <Acronyms />
  {:else if $activeTab == 'Starship Traits'}
    <Grid/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Personal Traits'}
    <Grid/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Space Equipment'}
    <Grid/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
  {:else if $activeTab == 'Ground Equipment'}
    <Grid/>
    {#if !$mobile}
      <aside>
        <Sidebar/>
      </aside>
    {/if}
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
  aside {
  width: 30%;
  padding: 1rem;
  background-color: var(--light-background);
  overflow-y: auto;
}
</style>
