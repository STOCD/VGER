<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
  import Settings from '$lib/settings/Settings.svelte';
  import Header from '$lib/header/Header.svelte';
  import {
    activeTab, srcValue, active_settings, activeCard, settings_env, settings_type,
    settings_av, settings_ground_slot, settings_space_slot, settings_rarity, mobile,
    mobile_menu_active, mobile_sidebar_active, settings_search_desc, mobile_auto, mobile_override
} from '$lib/stores';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  $: {
    switch ($page.url.pathname) {
        case '/starship-traits':
            $activeTab = 'Starship Traits';
            break;
        case '/space-equipment':
            $activeTab = 'Space Equipment';
            break;
        case '/ground-equipment':
            $activeTab = 'Ground Equipment';
            break;
        case '/personal-traits':
            $activeTab = 'Personal Traits';
            break;
        default:
            $activeTab = 'Acronyms';
    }
    reset_states();
  }

  function reset_states() {
    $active_settings = false;

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
  }
  onMount(() => {
    // test whether user is on mobile device
    $mobile_auto = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;
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
<svelte:head>
  <!-- this stylesheet is needed for the link and right-angle icons on the sidebar -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<Banner />

<div class='background'>
    <!-- Menu bar -->
    <Header />

    <!-- Settings sidebar, outside of viewport by default -->
    <Settings/>

    <main>
        <slot/>
    </main>
</div>


<style>
    .background {
        background-color: var(--science-blue);
        padding: 0 var(--gutter) var(--gutter) var(--gutter);
        margin-top: 0;
        width: 100%;
        position: fixed;
    }
</style>
