<script>
import { activeCard, mobile_sidebar_active, active_settings } from '$lib/stores';
import ImageLoader from './ImageLoader.svelte';
    
export let item;
export let index;

// makes this card the active card
const handleClick = () => {
  $activeCard = item;
  $mobile_sidebar_active = true;
  $active_settings = false;
};
</script>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: none;
    border-radius: calc(.5*var(--gutter));
    margin: 0;
    padding: calc(0.5*var(--gutter));
    color: var(--gray-text);
    background-color: var(--light-background);
  }

  .card:hover {
    cursor: pointer;
    background-color: var(--light-background-hover);
  }

  .card:active {
    transform: scale(0.98);
  }
</style>

<!-- One Grid card -->
<button class='card' title={item.name} on:click={handleClick}>
  <ImageLoader src={item.image} alt='' {index}/>
</button>