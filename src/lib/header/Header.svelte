<script>
  import { activeTab, srcValue, active_settings, current_list, activeCard, settings_env, settings_type, settings_av, settings_ground_slot, settings_space_slot, settings_rarity, mobile, mobile_menu_active, mobile_sidebar_active, settings_search_desc, load_progress
  } from '$lib/stores';
  import HamburgerIcon from './HamburgerIcon.svelte';
  import {slide} from 'svelte/transition';

  const tabs = ['Starship Traits', 'Space Equipment', 'Ground Equipment', 'Personal Traits', 'Acronyms'];
  const lists = {'Starship Traits':'starship_traits', 'Personal Traits':'personal_traits','Space Equipment':'space_equipment', 'Ground Equipment':'ground_equipment','Knowledgebase':''};

  // swaps modules
  const handleClick = (title) => {
    if ($activeTab == title) {
      return
    }
    $activeTab = title;
    $current_list = lists[title];
    $active_settings = false;
    $load_progress = 0;

    //close mobile menu and sidebar
    if ($mobile) {
      $mobile_menu_active = false;
    }
    if ($mobile) {
      $mobile_sidebar_active = false;
    }

    //clear filters to prevent de-synchronization with the respective buttons
    $srcValue = '';
    $activeCard = '';
    $settings_env = '';
    $settings_type = [];
    $settings_av = [];
    $settings_ground_slot = [];
    $settings_space_slot = [];
    $settings_rarity = [];
    $settings_search_desc = false;
  };


  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // expands settings menu
  const toggleSettings = (event) => {
    active_settings.set(!$active_settings);
    if ($mobile) {
      $mobile_menu_active = false;
    }
    if ($mobile_sidebar_active) {
      $mobile_sidebar_active = false;
    }
  }

  // expands mobile menu
  const toggleMenu = () => {
    $mobile_menu_active = !$mobile_menu_active;
    if ($active_settings) {
      $active_settings = false;
    }

  }  

</script>

{#if !$mobile}

  <!-- DESKTOP -->
  <header>
    <nav>
      <ul class='horizontal_list'>
        {#each tabs as tab, index (index)}
          <li class ='desktop_li' class:active={$activeTab === tab}>
            <button class='desktop_button' on:click={() => handleClick(tab)}>{tab}</button>
          </li>
        {/each}
      </ul>
    </nav>
    <form on:submit={handleSubmit}>
      <label for="search" aria-label="search" class="visually-hidden"> Search </label>
      <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
      <button class="hamburger desktop_button" on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
    </form>
  </header>
  <div class='seperator_background'><div class='seperator'></div></div>

{:else}

  <!-- MOBILE -->
  <header>
    <button id='mobile_menu_button' class='desktop_button' on:click={()=>toggleMenu()}>Menu</button>
    <form class='mobile_form' on:submit={handleSubmit}>
      <label for="search" aria-label="search" class="visually-hidden"> Search </label>
      <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
      <button class='hamburger desktop_button' on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
    </form>
  </header>

  {#if $mobile_menu_active}
    <div id='mobile_menu' transition:slide>
      <ul class='vertical_list'>
        {#each tabs as tab, index (index)}
          <li class='mobile_li' class:active={$activeTab === tab}>
            <button class='mobile_button' on:click={() => handleClick(tab)}>{tab}</button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

{/if}

<style>
  header {
    display: flex;
    height: 2.5rem;
    width: 100%;
    background-color: var(--dark-background);
    z-index: 3;
    border-radius: var(--gutter) var(--gutter) 0 0;
  }
  #search {
    margin: 0 auto;
    border-right: 1px solid var(--dark-text); 
    height: 70%;
    width: 80%;
    font-size: 1rem;
    padding: 0 0.25rem;
    border: var(--border) solid var(--dark-background-hover);
    border-radius: calc(2*var(--border));
    background-color: var(--dark-background);
    color: var(--light-text);
  }
  #search:hover {
    background-color: var(--dark-background-hover);
  }
  #search::placeholder {
    color: var(--light-text);
  }
  nav {
    width: 70%;
    padding-bottom: var(--border);
  }
  .horizontal_list {
    height: 100%;
    margin: 0;
    padding: 0 0 var(--border) 0;
    display: flex;
    justify-content: center;
    list-style: none;
  }
  .vertical_list {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .mobile_li,
  .desktop_li,
  .desktop_button {
    height: 100%;
    width: 100%;
    padding: 0;
  }
  .desktop_li {
    margin: var(--border) 0 var(--border) var(--border);
  }
  .desktop_button {
    background-color: var(--dark-background);
    color: var(--light-text);
    border: calc(.1*var(--gutter)) solid var(--dark-background);
    margin-bottom: var(--border);
    border-radius: var(--gutter);
    text-transform: uppercase;
    font-weight: bold;
    font-size: 85%;
  }
  .mobile_button {
    background-color: var(--dark-background);
    color: var(--light-text);
    border: none;
    text-transform: uppercase;
    font-weight: bold;
    width: 100%;
    height: 2.5rem;
  }
  .desktop_button:hover {
    cursor: pointer;
    border-color: var(--light-text);
    text-decoration: underline;
  }

  .mobile_button:hover {
    cursor: pointer;
    background-color: var(--dark-background-hover);
    text-decoration: underline;
  }
  .desktop_button:active:not(.hamburger),.mobile_button:active:not(.hamburger) {
    transform: scale(0.98);
  }
  .hamburger:active {
    background-color: var(--science-blue-dimmed);
  }
  form {
    width: 30%;
    display: flex;
    justify-content: right;
    align-items: center;
    background-color: var(--dark-background);
    border-radius: var(--gutter);
    padding-top: var(--border);
    padding-right: var(--border);
  }
  .hamburger {
    width: 15%;
    display: flex;
    align-items: center;
    margin-top: var(--border);
  }
  .visually-hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  #mobile_menu {
    position: absolute;
    width: calc(100vw - 2*var(--gutter));
    background-color: var(--dark-background);
    top: 2.5rem;
    border-top: calc(.5*var(--border)) solid var(--science-blue);
    z-index: 5;
    border-bottom: var(--gutter) solid var(--science-blue);
  }
  .mobile_form {
    width: 100%;
  }
  #mobile_menu_button {
    width: 25%;
  }
  .seperator {
    height: var(--border);
    background-color: var(--light-background-hover);
    margin: 0 var(--gutter) 0 var(--gutter);
    padding: 0;
  }
  .seperator_background {
    background-color: var(--dark-background);
  }
</style>
