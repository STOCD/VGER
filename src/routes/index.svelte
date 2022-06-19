<script>
  import { onMount } from 'svelte';
  import { activeTab, current_list} from '$lib/stores';
  import Header from '$lib/header/Header.svelte';
  import Grid from '$lib/grid/Grid.svelte';
  import Acronyms from '$lib/acronyms/Acronyms.svelte';
  import Sidebar from '$lib/sidebar/Sidebar.svelte';
  import Settings from '$lib/settings/Settings.svelte';
 
  $current_list = 'starship_traits';
  $activeTab = 'Starship Traits';
  /*
  const unsub = activeCard.subscribe((current_value) => {
    $activeUrl = 'https://stobuilds.com/VGER/data/images/'+current_value.name+'.png';
  } )

  
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

  function cartesian(args) {
    let r = [], max = args.length-1;
    function helper(arr, i) {
        for (let j=0, l=args[i].length; j<l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
	}
  
  const handleImageError = function(elem) {
    console.log("fire");
    //elem.src = "https://stobuilds.com/VGER/data/images/Improved Brace for Impact.png".replaceAll(' ','%20');
    //$activeUrl = "https://stobuilds.com/VGER/data/images/Improved Brace for Impact.png".replaceAll(' ','%20');
    //return;
    const img = new Image();
    let start_url = $activeUrl;
    img.src = start_url;
    console.log("1");
    console.log(img.src);
    console.log(img.complete);
    if (img.complete) {
      console.log('lost')
      return;
    }
    else {
      let words = $activeCard.name.split(/(?<=[-\s])/g);
      let wordlist = words.map(word => [word.charAt(0).toUpperCase()+word.slice(1),word.charAt(0).toLowerCase()+word.slice(1)]);
      let combinations = cartesian(wordlist);
      for (let j = 0; j < combinations.length; j++) {
        let new_url = 'https://stobuilds.com/VGER/data/images/'+combinations[j].join('')+'.png';
        
        img.src = new_url.replaceAll(' ','%20');
        console.log(img.src);
        console.log(img.complete);
        setTimeout(() => {
          console.log(img.complete);
          if (img.complete) {
          console.log('here');
          $activeUrl = new_url.replaceAll(' ','%20');
          return;
        }
        }, 1000);
        
      
        
          if (img.complete || img.onload) {
            console.log(img.src);
            elem.src = new_url;
            break;
          }
          
       
        
      }
      
    }
  }
  */
  //const data = Array.from({ length: 9 }, () => starship_traits[0]);

  onMount(() => {
    // fetch initial card data
    const mobile = navigator.userAgent.toLowerCase().indexOf('mobi') != -1;
  });

  
</script>

<svelte:head>
  <title>VGER | {$activeTab}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<Header />
<Settings/>
<main>
  <!--<Acronyms />-->
  {#if $activeTab == 'Knowledgebase'}
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
    height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /* minus the height of the rest of the UI */
    width: 100%;
    margin: 0;
    padding: var(--gutter);
    background-color: var(--dark-background);
    overflow: hidden;
  }
</style>
