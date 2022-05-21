<script>
  import { onMount } from 'svelte';
  import { activeTab, activeCard} from '$lib/stores';
  import Header from '$lib/header/Header.svelte';
  import Grid from '$lib/grid/Grid.svelte';
  import Acronyms from '$lib/acronyms/Acronyms.svelte';
  

  // placeholder data
  const entry = {
    name: 'Emergency Weapon Cycle',
    type: 'Starship Trait',
    obtained: ['Arbiter Battlecruiser', 'Kurak Battlecruiser', 'Morrigu Warbird'],
    description: {
      basic: 'While this starship trait is active, using Emergency Power to Weapons will also reduce weapon power cost and increase your weapon fire rate moderately.',
      detailed: 'On Emergency Power to Weapons: -50% Weapon Power Cost for 30 sec. 20% Firing Cycle Haste for Energy Weapons for 30 sec.',
    }
  };

  const data = Array.from({ length: 9 }, () => entry);

  onMount(() => {
    // fetch initial card data
  });
</script>

<svelte:head>
  <title>VGER | {$activeTab}</title>
</svelte:head>

<Header />
<main>
  <Acronyms />
  <!--{#if $activeTab == 'Knowledgebase'}
    <Acronyms />
  {:else}
  <section>
    <Grid {data} />
  </section>
  <aside>
    {#if $activeCard}
    <h2>{$activeCard.name}</h2>
    <h3>Basic Description</h3>
    <p>{$activeCard.description.basic}</p>
    <h3>Detailed Description</h3>
    <p>{$activeCard.description.detailed}</p>
    {/if}
  </aside>
  {/if}-->
</main>

<style>
  main {
    display: flex;
    height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /* minus the height of the rest of the UI */
    width: 100%;
    margin: 0;
    padding: var(--gutter);
    background-color: var(--dark-background);
    overflow: hidden;
  }

  section {
    width: 70%;
    overflow-y: scroll;
    margin-right: var(--gutter);
  }

  aside {
    width: 30%;
    padding: 1rem;
    background-color: var(--light-background);
  }
</style>
