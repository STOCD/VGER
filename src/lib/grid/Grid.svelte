<script>
  import GridCard from "./GridCard.svelte";
  export let data;
  
</script>

<div>
  {#each data as item, index (index)}
    <GridCard {item} />
  {/each}
</div>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: var(--gutter) var(--gutter);
    margin-right: var(--gutter);
  }
</style>
