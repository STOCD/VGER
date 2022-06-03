<script>
  import { activeCard, image_path } from '$lib/stores';
  import { onMount } from 'svelte';
  import {starship_traits} from '$lib/fetch/masterfetch';
  export let item;
  let cardimage = image_path+item.name+'.png';
  $: cardimage = image_path+item.name+'.png';

  const handleClick = () => {
    $activeCard = item;
  };
  // https://static.wikia.nocookie.net/sto_gamepedia/images/8/80/Emergency_Weapon_Cycle_icon.png/
  // https://sto.fandom.com/wiki/Special:Filepath/Emergency_Weapon_Cycle_icon.png
</script>

<button class='card' on:click={handleClick}>
  <img src={cardimage} alt={item.name} />
</button>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /*height: 10rem;*/
    border: none;
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

  img {
    width: var(--card-image-width);
    /*margin: 0 0 var(--gutter);
    margin-bottom: var(--gutter);*/
  }
</style>
