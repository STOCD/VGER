<script>
    import {
        activeTab, srcValue, active_settings, mobile, mobile_menu_active, mobile_sidebar_active
    } from '$lib/stores';
    import HamburgerIcon from './HamburgerIcon.svelte';
    import { slide } from 'svelte/transition';

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
            <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
            <button class="hamburger desktop_button" on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
        </div>
    </header>
    <div class='seperator_background'><div class='seperator'></div></div>

{:else}
    <!-- MOBILE -->
    <header>
        <button id='mobile_menu_button' class='desktop_button' on:click={()=>toggleMenu()}>Menu</button>
        <input type="text" id="search" bind:value={$srcValue} placeholder="SEARCH" title='search the current tab'/>
        <button class='hamburger desktop_button' on:click={toggleSettings} title='Settings and Filters (tab-specific)'><HamburgerIcon /></button>
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
  .controls {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .hamburger {
    width: 15%;
    display: flex;
    align-items: center;
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
</style>
