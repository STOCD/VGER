<script>
import {
    activeCard, mobile_sidebar_active, active_settings, mobile_menu_active
} from '$lib/stores';
    
export let item;

let icon_name
$: {
    if (item.icon_name) {
        icon_name = '/api/i/' + item.icon_name
    }
    else {
        icon_name = '/api/i/' + item.name
    }
}

// makes this card the active card
const handleClick = () => {
  $activeCard = item;
  $mobile_sidebar_active = true;
  $mobile_menu_active = false;
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
img {
    width: var(--card-image-width);
    height: calc(var(--card-image-width) * (64 / 49));
    border-radius: calc(.5*var(--gutter));
    display: block;
}
</style>

<!-- One Grid card -->
<button class='card' title={item.name} on:click={handleClick}>
   <img src={icon_name} alt='' loading='lazy'/>
</button>
