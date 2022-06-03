<script>
  import GridCard from "./GridCard.svelte";
  import {srcValue, filtered} from '$lib/stores';
  import {starship_traits} from '$lib/fetch/masterfetch';
  import {matchSorter} from 'match-sorter';
  
        srcValue.subscribe( () => {
            filtered.set(matchSorter(starship_traits, $srcValue, {keys : ['name']}));
            try {
                let div1 = document.getElementById('div1');
                if (div1 != null) {
                    div1.scrollTop = 0;
                } 
            
            }
            catch {}
      });
  
</script>

<div id='div1'>
  {#each $filtered as item, index (index)}
    <GridCard {item} />
  {/each}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(calc(var(--card-image-width) +  var(--gutter)), 1fr));
    gap: var(--gutter) var(--gutter);
    margin-right: var(--gutter);
  }
</style>
