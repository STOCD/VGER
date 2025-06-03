<script>
    import {
        activeTab, srcValue, active_settings, mobile, mobile_menu_active, mobile_sidebar_active
    } from '$lib/stores';
    import HamburgerIcon from './HamburgerIcon.svelte';
    import InfoIcon from './InfoIcon.svelte';
    import Close from './Close.svelte';
    import { slide } from 'svelte/transition';

    let dialog_element;

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

<dialog bind:this={dialog_element}>
    <div class='sticky_container' >
        <button class='dialog_close icon_button' on:click={() => dialog_element.close()}><Close/></button>
    </div>
    <div>
        <h2 class='first_heading'>General</h2>
        <ul class='info_list'>
            <li>Click an icon to show details in the sidebar.</li>
            <li>The search bar can be used to narrow down shown icons.</li>
            <li>Item names and ship names on starship traits link to the according wiki page.</li>
            <li>Acronyms can be clicked to open a wiki page containing more information.</li>
        </ul>
        <h2>Search</h2>
        <ul class='info_list'>
            <li>The search recognizes acronyms in item names. Example: Searching "DPRM" will show "Console - Universal - Dynamic Power Redistributor Module".</li>
            <li>In the starship traits module, searching for a ship name will show its trait(s).</li>
            <li>Item descriptions are automatically searched within the starship and personal traits modules.</li>
            <li>To search item descriptions in the equipment modules, enable the "Search Descriptions" setting.</li>
        </ul>
        <h2>Filters and Settings</h2>
        <ul class='info_list'>
            <li>Multiple filters can be applied, narrowing down shown icons. Selecting multiple filters requires an item to match all applied filters to be shown.</li>
            <li>Some filter buttons can be hovered to reveal details on the filter.</li>
        </ul>
        <p class='more_info_text'>For more detailed information please visit our website, linked at the bottom of the settings menu.</p>
    </div>
</dialog>

{#if !$mobile}
    <!-- DESKTOP -->
    <header>
        <nav>
            <ul class='horizontal_list'>
                <li class='desktop_li'>
                    <a class='desktop_button' class:bt-active={$activeTab === 'Starship Traits'}
                            href='starship-traits'>
                        Starship Traits
                    </a>
                </li>
                <li class ='desktop_li'>
                    <a class='desktop_button' class:bt-active={$activeTab === 'Space Equipment'}
                            href='space-equipment'>
                        Space Equipment
                    </a>
                </li>
                <li class ='desktop_li'>
                    <a class='desktop_button' class:bt-active={$activeTab === 'Ground Equipment'}
                            href='ground-equipment'>
                        Ground Equipment
                    </a>
                </li>
                <li class ='desktop_li'>
                    <a class='desktop_button' class:bt-active={$activeTab === 'Personal Traits'}
                            href='personal-traits'>
                        Personal Traits
                    </a>
                </li>
                <li class ='desktop_li'>
                    <a class='desktop_button' class:bt-active={$activeTab === 'Acronyms'}
                            href='acronyms'>
                        Acronyms
                    </a>
                </li>
            </ul>
        </nav>
        <div class='controls'>
            <button class='icon_button' on:click={() => dialog_element.showModal()}><InfoIcon/></button>
            <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
            <button class="icon_button" on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
        </div>
    </header>
    <div class='seperator_background'><div class='seperator'></div></div>

{:else}
    <!-- MOBILE -->
    <header>
        <button id='mobile_menu_button' class='desktop_button' on:click={()=>toggleMenu()}>Menu</button>
        <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
        <button class='icon_button' on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
    </header>

    {#if $mobile_menu_active}
        <div id='mobile_menu' transition:slide>
            <ul class='vertical_list'>
                <li class='mobile_li'>
                    <a class='mobile_button' class:bt-active={$activeTab === 'Starship Traits'}
                            href='starship-traits'>
                        Starship Traits
                    </a>
                </li>
                <li class ='mobile_li'>
                    <a class='mobile_button' class:bt-active={$activeTab === 'Space Equipment'}
                            href='space-equipment'>
                        Space Equipment
                    </a>
                </li>
                <li class ='mobile_li'>
                    <a class='mobile_button' class:bt-active={$activeTab === 'Ground Equipment'}
                            href='ground-equipment'>
                        Ground Equipment
                    </a>
                </li>
                <li class ='mobile_li'>
                    <a class='mobile_button' class:bt-active={$activeTab === 'Personal Traits'}
                            href='personal-traits'>
                        Personal Traits
                    </a>
                </li>
                <li class ='mobile_li'>
                    <a class='mobile_button' class:bt-active={$activeTab === 'Acronyms'}
                            href='acronyms'>
                        Acronyms
                    </a>
                </li>
                <li class='mobile_li'>
                    <button class='mobile_button' on:click={() => dialog_element.showModal()}>Short Guide</button>
                </li>
            </ul>
        </div>
    {/if}

{/if}

<style>
  header {
    display: flex;
    gap: var(--border);
    padding: var(--border);
    height: calc(5 * var(--gutter));
    width: 100%;
    align-items: center;
    background-color: var(--dark-background);
    z-index: 3;
    border-radius: var(--gutter) var(--gutter) 0 0;
  }
  #search {
    margin: var(--border) var(--gutter);
    height: 70%;
    width: 100%;
    align-self: center;
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
    height: 100%;
  }
  .horizontal_list {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    list-style: none;
  }
  .vertical_list {
    width: 100%;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .bt-active {
    text-decoration: underline !important;
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
    display: block;
    align-content: center;
    text-align: center;
    background-color: var(--dark-background);
    color: var(--light-text);
    border: calc(.1*var(--gutter)) solid var(--dark-background);
    border-radius: var(--gutter);
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 85%;
  }
  .mobile_button {
    display: block;
    align-content: center;
    text-align: center;
    background-color: var(--dark-background);
    color: var(--light-text);
    border: none;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1rem;
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
  .desktop_button:active, .mobile_button:active {
    transform: scale(0.98);
  }
  .controls {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .icon_button {
    color: var(--medium-text);
    background: none;
    border: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon_button:hover {
    color: var(--light-text);
    cursor: pointer;
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
    display: block;
    background-color: var(--dark-background);
  }
  dialog {
    background-color: var(--dark-background);
    border: var(--border) solid var(--science-blue);
    border-radius: var(--gutter);
    color: var(--light-text);
    max-width: 95vw;
    padding: 1.2rem;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
  }
  .dialog_close {
    padding: var(--gutter);
    position: absolute;
    right: 0;
    top: 0;
    height: fit-content;
    border-radius: 50%;
    background-color: #1a1a1aaa;
  }
  .sticky_container {
    position: sticky;
    top: 0;
    right: 0;
  }
  h2 {
    margin-top: 1.2rem;
    margin-bottom: 0;
  }
  .first_heading {
    margin-top: 0;
  }
  .info_list {
    margin-top: var(--gutter);
    margin-bottom: 0;
    padding-left: 2rem;
    line-height: 130%;
  }
  .more_info_text {
    margin-bottom: 0;
    margin-top: 1.2rem;
    font-style: italic;
  }
</style>
