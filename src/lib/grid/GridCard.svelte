<script>

import { activeCard, mobile_sidebar_active, active_settings } from '$lib/stores';
    import ImageLoader from './ImageLoader.svelte';
export let item;
// export let lazy = false;
export let index;

let path = '';
let observer = null;

// makes sure the image always matches the item
/* (Each Grid card is inserted in the Grid.svelte compenent through an each block. 
If the list that the each block is fed with changes, the each block updates how many 
GridCards are inserted and re-assignes the variables. It does not destroy and re-create 
the GridCards! The img tags cannot reactively adapt to this, so it has to be done 
manually through this statement.) */
/*$: {
  if (path != item.image && path != ''){
    path = item.image;
  }
}



// sets image path # lazy loading
function onIntersect(entries) {
  if (!path && entries[0].isIntersecting) {
    path = item.image;
  }
}

// enables lazy load # lazy loading
function lazy_load(node) {
  observer && observer.observe(node);
  return {
    destroy() {
      observer && observer.unobserve(node)
    }
  }
}

// detects load error # lazy loading
async function loadError() {
  if (path != '') {
    const re = await fetchAndRetryIfNecessary(async () => (await fetch(path)))
    path = null;
  }
}

// activates lazy load # lazy loading
if (lazy && typeof window !== 'undefined') {
  path = '';
  observer = new IntersectionObserver(onIntersect, {rootMargin:'20px'});
}

// sleep function
function getMillisToSleep (retryHeaderString) {
  let millisToSleep = Math.round(parseFloat(retryHeaderString) * 1000)
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(0, new Date(retryHeaderString) - new Date())
  }
  return millisToSleep
}

// retries image fetch # lazy loading
async function fetchAndRetryIfNecessary (callAPIFn) {
  const response = await callAPIFn();
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    const millisToSleep = getMillisToSleep(retryAfter)
    await sleep(millisToSleep)
    return fetchAndRetryIfNecessary(callAPIFn)
  }
  return response
}*/

// makes this card the active card
const handleClick = () => {
  $activeCard = item;
  $mobile_sidebar_active = true;
  $active_settings = false;
};
</script>

<!-- One Grid card -->
<button class='card' title={item.name} on:click={handleClick}>
  <!--<img src={path} alt='hover' referrerpolicy='no-referrer' use:lazy_load on:error={()=>loadError()}/>-->
  <ImageLoader src={item.image} alt='' {index}/>
</button>

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
