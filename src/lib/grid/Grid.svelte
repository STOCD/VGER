<script>
  import GridCard from "./GridCard.svelte";
  import {srcValue, filtered, current_list, activeTab, settings_env, settings_type, settings_av, settings_ground_slot, settings_space_slot,
          settings_boundto, settings_boundwhen, settings_rarity
    } from '$lib/stores';
  import { data } from '$lib/fetch/masterfetch';
  import {matchSorter} from 'match-sorter';

  console.log($activeTab);

  srcValue.subscribe( () => update_filter() );
  settings_env.subscribe( () => update_filter() );
  settings_type.subscribe( () => update_filter() );
  settings_av.subscribe( () => update_filter() );
  settings_ground_slot.subscribe( () => update_filter() );
  settings_space_slot.subscribe( () => update_filter() );
  settings_rarity.subscribe( () => update_filter() );
  settings_boundto.subscribe( () => update_filter() );
  settings_boundwhen.subscribe( () => update_filter() );

  function update_filter() {
    if ($activeTab == 'Personal Traits') {
      let environment_filtered = data[$current_list];
      if ($settings_env != '') {
        environment_filtered = matchSorter(data[$current_list], $settings_env, {keys: ['environment'], threshold: matchSorter.rankings.EQUAL})
      }
      let type_filtered = [];
      if ($settings_type.length == 0) {
        type_filtered = environment_filtered;
      }
      else {
        if ($settings_type.includes('rep')) {
          type_filtered.push(...matchSorter(environment_filtered, 'reputation', {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
        }
        if ($settings_type.includes('personal')) {
          type_filtered.push(...matchSorter(environment_filtered, 'personal', {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
        }
        if ($settings_type.includes('active_rep')) {
          type_filtered.push(...matchSorter(environment_filtered, 'activereputation', {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let av_filtered = [];
      if ($settings_av.length == 0) {
        av_filtered = type_filtered;
      }
      else {
        if ($settings_av.includes('innate')) {
          av_filtered.push(...matchSorter(type_filtered, 'innate', {keys: ['availability_type'], threshold: matchSorter.rankings.EQUAL}))
        }
        if ($settings_av.includes('species')) {
          av_filtered.push(...matchSorter(type_filtered, 'species', {keys: ['availability_type'], threshold: matchSorter.rankings.EQUAL}))
        }
        if ($settings_av.includes('other')) {
          av_filtered.push(...matchSorter(type_filtered, 'other', {keys: ['availability_type'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let search_filtered = matchSorter(av_filtered, $srcValue, {keys: ['name']});
      filtered.set(search_filtered);
      try {
        document.getElementById('main_section').scrollTop(0);
      }
      catch {}
    }
    else if ($activeTab == 'Starship Traits') {
      let search_filtered = matchSorter(data[$current_list], $srcValue, {keys: ['name']});
      filtered.set(search_filtered);
      try {
        document.getElementById('main_section').scrollTop = 0;
      }
      catch {}
    }
    else if ($activeTab == 'Space Equipment') {
      console.log(data[$current_list])
      let type_filtered = []
      if ($settings_space_slot.length == 0) {
        type_filtered = data[$current_list];
      }
      else {
        for (let k = 0; k < $settings_space_slot.length; k++) {
          type_filtered.push(...matchSorter(data[$current_list], $settings_space_slot[k], {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let rarity_filtered = [];
      if ($settings_rarity.length == 0) {
        rarity_filtered = type_filtered;
      }
      else {
        for (let k2 = 0; k2 < $settings_rarity.length; k2++) {
          rarity_filtered.push(...matchSorter(data[$current_list], $settings_rarity[k2], {keys: ['rarity'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let search_filtered = matchSorter(rarity_filtered, $srcValue, {keys: ['name']});
      filtered.set(search_filtered);
      try {
        document.getElementById('main_section').scrollTop = 0;
      }
      catch {}
    }
    else if ($activeTab == 'Ground Equipment') {
      let type_filtered = []
      if ($settings_ground_slot.length == 0) {
        type_filtered = data[$current_list];
      }
      else {
        for (let k = 0; k < $settings_ground_slot.length; k++) {
          type_filtered.push(...matchSorter(data[$current_list], $settings_ground_slot[k], {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let rarity_filtered = [];
      if ($settings_rarity.length == 0) {
        rarity_filtered = type_filtered;
      }
      else {
        for (let k2 = 0; k2 < $settings_rarity.length; k2++) {
          rarity_filtered.push(...matchSorter(data[$current_list], $settings_rarity[k2], {keys: ['rarity'], threshold: matchSorter.rankings.EQUAL}))
        }
      }
      let search_filtered = matchSorter(rarity_filtered, $srcValue, {keys: ['name']});
      filtered.set(search_filtered);
      try {
        document.getElementById('main_section').scrollTop = 0;
      }
      catch {}
    }
  }

  
</script>
<section id='main_section'>
<div id='div1'>
  {#each $filtered as item, index (index)}
    <GridCard {item} />
  {/each}
</div>
</section>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--card-image-width) +  var(--gutter)), 1fr));
    gap: var(--gutter) var(--gutter);
    margin-right: var(--gutter);
  }
  #main_section {
    width: 70%;
    overflow-y: scroll;
    margin-right: var(--gutter);
  }
</style>
