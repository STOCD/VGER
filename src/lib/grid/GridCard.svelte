<script>

import { activeCard, image_path, mobile_sidebar_active, active_settings } from '$lib/stores';
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

function lazy_load(node) {
  observer && observer.observe(node);
  return {
    destroy() {
      observer && observer.unobserve(node)
    }
  }
}

async function loadError() {
  if (path != '') {
    const re = await fetchAndRetryIfNecessary(async () => (await fetch(path)))
    path = null;
  }
}

if (lazy && typeof window !== 'undefined') {
  path = '';
  observer = new IntersectionObserver(onIntersect, {rootMargin:'20px'});
}

function getMillisToSleep (retryHeaderString) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000)
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date())
  }
  return millisToSleep
}

async function fetchAndRetryIfNecessary (callAPIFn) {
  const response = await callAPIFn();
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    const millisToSleep = getMillisToSleep(retryAfter)
    await sleep(millisToSleep)
    return fetchAndRetryIfNecessary(callAPIFn)
  }
  return response
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
