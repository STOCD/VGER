<script>
  import { activeTab, srcValue, active_settings, current_list, activeCard, settings_env, settings_type, settings_av } from '$lib/stores';
  import SearchIcon from './SearchIcon.svelte';
  import HamburgerIcon from './HamburgerIcon.svelte';

  const tabs = ['Starship Traits', 'Starship Gear', 'Personal Traits', 'Knowledgebase'];
  const lists = {'Starship Traits':'starship_traits', 'Personal Traits':'personal_traits','Starship Gear':'','Knowledgebase':''};
  

  const handleClick = (title) => {
    $activeTab = title;
    $current_list = lists[title];
    $srcValue = '';
    $activeCard = '';
    $settings_env = '';
    $settings_type = [];
    $settings_av = [];
    // fetch active tab category json for card information
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // filter by search term and current active tab
  };
  const toggleSettings = (event) => {
    active_settings.set(!$active_settings);
  }
</script>

<header>
  <nav>
    <ul>
      {#each tabs as tab, index (index)}
        <li class:active={$activeTab === tab}>
          <button on:click={() => handleClick(tab)}>{tab}</button>
        </li>
      {/each}
    </ul>
  </nav>
  <form on:submit={handleSubmit}>
    <label for="search" aria-label="search" class="visually-hidden"> Search </label>
    <!--<button type="submit" class="search-button"><SearchIcon /></button>-->
    <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
    <button class="hamburger" on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
  </form>
</header>

<style>
  header {
    display: flex;
    height: 2.5rem;
    width: 100%;
    background-color: #616161;
  }
  #search {
    margin: 0 auto;
    border-right: 1px solid var(--dark-text); 
    height: 60%;
    width: 70%;
    font-size: 1rem;
    padding: 0 0.25rem;
    border: none;
    background-color: var(--dark-background);
    color: var(--light-text);
  }
  #search:hover {
    background-color: var(--dark-background-hover);
  }
  #search::placeholder {
    color: var(--light-background);
  }
  nav {
    width: 70%;
  }

  ul {
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    list-style: none;
  }

  li,
  button {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  button {
    background-color: var(--light-text);
    color: var(--gray-text);
    border: none;
    text-transform: uppercase;
    font-weight: bold;
  }
  button:not(.hamburger) {
    border-right: calc(.5*var(--border)) solid var(--dark-text);
  }

  button:hover {
    cursor: pointer;
    background-color: var(--light-text-hover);
    text-decoration: underline;
  }

  button:active:not(.hamburger):not(.search-button) {
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
    background-color: var(--light-text);
  }

  .search-button {
    border: none;
    width: 15%;
  }

  .hamburger {
    width: 15%;
    border-left: calc(.5*var(--border)) solid var(--dark-text);
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
</style>
