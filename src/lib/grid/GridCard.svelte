<script>

import { activeCard, image_path, mobile_sidebar_active, active_settings, reload_queue } from '$lib/stores';
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
  $active_settings = false;
};

function onIntersect(entries) {
  if (!path && entries[0].isIntersecting) {
    path = image_path+item.name+'.png';
  }
}

async function getImage(p) {
  const f = async () => await fetch(p);
  const response = await f();
  if (response.status == 200)
    path = response.url;
}

function lazy_load(node) {
  observer && observer.observe(node);
  return {
    destroy() {
      observer && observer.unobserve(node)
    }
  }
}

function setPath() {
  path = null;
}

function loadError() {
  if (path != '') {
    $reload_queue.push({'path':path, 'callback':setPath})
  }
}

if (lazy && typeof window !== 'undefined') {
  path = '';
  observer = new IntersectionObserver(onIntersect, {rootMargin:'20px'});
}

</script>

<button class='card' title={item.name} on:click={handleClick}>
  <img src={path} alt='hover' use:lazy_load on:error={()=>loadError()}/>
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
