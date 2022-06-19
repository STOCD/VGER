<script>

import { activeCard, image_path } from '$lib/stores';
export let item;
let cardimage = image_path+item.name+'.png';

const handleClick = () => {
  $activeCard = item;
};

</script>

<button class='card' title={item.name} on:click={handleClick}>
  <img src={cardimage} alt={item.name} />
</button>

<style>

  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
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
  }

</style>
