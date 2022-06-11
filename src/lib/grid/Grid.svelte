<script>
  import GridCard from "./GridCard.svelte";
  import {srcValue, filtered, current_list, activeTab, settings_env, settings_type, settings_av} from '$lib/stores';
  import { data } from '$lib/fetch/masterfetch';
  import {matchSorter} from 'match-sorter';

  srcValue.subscribe( () => update_filter() );
  settings_env.subscribe( () => update_filter() );
  settings_type.subscribe( () => update_filter() );
  settings_av.subscribe( () => update_filter() );

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
