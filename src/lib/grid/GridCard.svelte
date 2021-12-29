<script>
  import { activeCard } from '$lib/stores';
  export let item;

  const handleClick = () => {
    $activeCard = item;
  };
  // https://static.wikia.nocookie.net/sto_gamepedia/images/8/80/Emergency_Weapon_Cycle_icon.png/
  // https://sto.fandom.com/wiki/Special:Filepath/Emergency_Weapon_Cycle_icon.png
</script>

<button class='card' on:click={handleClick}>
  <img src="https://via.placeholder.com/150" alt="placeholder" />
  <div class='content'>
    <h2>{item.type}</h2>
    <h3>{item.name}</h3>
  </div>
  <div class='content'>
    <h2>Obtained From</h2>
    <ul>
      {#each item.obtained as method, index (index)}
        <li>{method}</li>
      {/each}
    </ul>
  </div>
</button>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 19rem;
    border: none;
    margin: 0;
    padding: 1rem;
    color: var(--gray-text);
    background-color: var(--light-background);
  }

  .card:hover {
    cursor: pointer;
  }

  .card:active {
    transform: scale(0.98);
  }

  img {
    height: 9rem;
    width: 8rem;
    margin: 0 0 var(--gutter);
    margin-bottom: var(--gutter);
  }

  .content {
    text-align: center;
    /* margin-bottom: var(--gutter); */
  }

  h2 {
    font-size: 0.75rem;
    margin: 0 0 0.35rem;
  }

  h3 {
    font-size: 1rem;
    margin: 0;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }
</style>
