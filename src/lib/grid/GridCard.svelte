<script>

import { activeCard, image_path, mobile_sidebar_active } from '$lib/stores';
export let item;
export let lazy = false;
let path = '';
let observer = null;
//let cardimage = image_path+item.name+'.png';
//$: {cardimage = image_path+item.name+'.png';}

$: {  
    if (path != image_path+item.name+'.png' && path != '') {
      path = image_path+item.name+'.png';
    }
  }

const handleClick = () => {
  $activeCard = item;
  $mobile_sidebar_active = true;
};

function onIntersect(entries) {
  if (!path && entries[0].isIntersecting) {
    path = image_path+item.name+'.png';
  
  }
}

function lazy_load(node) {
  observer && observer.observe(node);
  return {
    destroy() {
      observer && observer.unobserve(node)
    }
  }
}

if (lazy && typeof window !== 'undefined') {
  path = '';
  observer = new IntersectionObserver(onIntersect, {rootMargin:'20px'});
}

</script>

<button class='card' title={item.name} on:click={handleClick}>
  <img src={path} alt='hover' use:lazy_load />
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
