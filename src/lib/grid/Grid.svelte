<script>
    import GridCard from "./GridCard.svelte";
    import {
        srcValue, filtered, activeTab, settings_cost, settings_env, settings_type,
        settings_av, settings_ground_slot, settings_space_slot, settings_rarity, mobile,
        settings_search_desc
    } from '$lib/stores';
    import { matchSorter } from 'match-sorter';

    export let data;

    // update filter and search on change of any filter store variable
    srcValue.subscribe( () => update_filter() );
    settings_cost.subscribe( () => update_filter() );
    settings_env.subscribe( () => update_filter() );
    settings_type.subscribe( () => update_filter() );
    settings_av.subscribe( () => update_filter() );
    settings_ground_slot.subscribe( () => update_filter() );
    settings_space_slot.subscribe( () => update_filter() );
    settings_rarity.subscribe( () => update_filter() );


    // updates the filter for the current tab
    function update_filter() {
        // Personal Traits
        if ($activeTab == 'Personal Traits') {
            
            // environment filter
            let environment_filtered = data;
            if ($settings_env != '') {
                environment_filtered = matchSorter(data, $settings_env, {keys: ['environment'], threshold: matchSorter.rankings.EQUAL})
            }

            // type filters
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

            let search_filtered = matchSorter(av_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key:'desc'}]});
            filtered.set(search_filtered);

            // scroll to the top
            try {
            document.getElementById('main_section').scrollTop(0);
            }
            catch {}

        }

        // Starship Traits
        else if ($activeTab == 'Starship Traits') {
            // cost filter
            let cost_filtered = [];
            if ($settings_cost.length == 0){
                cost_filtered = data;
            }
            else {
                for (let j = 0; j < $settings_cost.length; j++) {
                    cost_filtered.push(...matchSorter(data, $settings_cost[j], {keys: ['cost_filter'], threshold: matchSorter.rankings.EQUAL}));
                }
            }

            // search filter
            let search_filtered = matchSorter(cost_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key:'obtained'}, {threshold: matchSorter.rankings.CONTAINS, key:'desc'}] });
            filtered.set(search_filtered);

            // scroll to the top
            try {
                document.getElementById('main_section').scrollTop = 0;
            }
            catch {}
        }

        // Space Equipment
        else if ($activeTab == 'Space Equipment') {

            // type filters
            let type_filtered = [];
            if ($settings_space_slot.length == 0) {
                type_filtered = data;
            }
            else {
                for (let k = 0; k < $settings_space_slot.length; k++) {
                    type_filtered.push(...matchSorter(data, $settings_space_slot[k], {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
                }
            }
            let rarity_filtered = [];
            if ($settings_rarity.length == 0) {
                rarity_filtered = type_filtered;
            }
            else {
                for (let k2 = 0; k2 < $settings_rarity.length; k2++) {
                    rarity_filtered.push(...matchSorter(type_filtered, $settings_rarity[k2], {keys: ['rarity'], threshold: matchSorter.rankings.EQUAL}))
                }
            }

            // search filter
            let search_filtered = matchSorter(rarity_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}]});
            if ($settings_search_desc) {
                search_filtered = search_filtered.concat(matchSorter(rarity_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.CONTAINS, key: 'desc2'}]}))
            }
            filtered.set(search_filtered);

            // scroll to the top
            try {
                document.getElementById('main_section').scrollTop = 0;
            }
            catch {}

        }

        // ground equipment
        else if ($activeTab == 'Ground Equipment') {

            // type filters
            let type_filtered = []
            if ($settings_ground_slot.length == 0) {
                type_filtered = data;
            }
            else {
                for (let k = 0; k < $settings_ground_slot.length; k++) {
                    type_filtered.push(...matchSorter(data, $settings_ground_slot[k], {keys: ['type'], threshold: matchSorter.rankings.EQUAL}))
                }
            }
            let rarity_filtered = [];
            if ($settings_rarity.length == 0) {
                rarity_filtered = type_filtered;
            }
            else {
                for (let k2 = 0; k2 < $settings_rarity.length; k2++) {
                    rarity_filtered.push(...matchSorter(type_filtered, $settings_rarity[k2], {keys: ['rarity'], threshold: matchSorter.rankings.EQUAL}))
                }
            }

            // search filter
            let search_filtered = matchSorter(rarity_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}]});
            if ($settings_search_desc) {
                search_filtered = search_filtered.concat(matchSorter(rarity_filtered, $srcValue, {keys: [{threshold: matchSorter.rankings.CONTAINS, key: 'desc2'}]}))
            } 
            filtered.set(search_filtered);

            // scroll to the top
            try {
            document.getElementById('main_section').scrollTop = 0;
            }
            catch {}
        }
    }
</script>

<!-- main grid section -->
<section class='section' class:mobile_section='{$mobile}' id='main_section'>
  <div id='div1'>
    <!-- inserts a grid card for each item -->
    {#each $filtered as item, index (index)}
      <GridCard {item} {index}/>
    {/each}
  </div>
</section>

<style>
  #div1 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--card-image-width) +  var(--gutter)), 1fr));
    gap: var(--gutter) var(--gutter);
    margin-right: var(--gutter);
  }
  .section {
    width: 70%;
    overflow-y: scroll;
    margin-right: var(--gutter);
  }
  .mobile_section {
    width: 100%;
    margin: 0;
  }
</style>
