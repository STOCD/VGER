<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
  import Chevron from '$lib/assets/starfleet-chevron-science-grey.png';
</script>

<Banner />
<div>
  <h1>
    <span>Visual Glossary Educational Repository</span>
    <img src={Chevron} alt='Starfleet science chevron' />
  </h1>
  <slot />
</div>


<style>
  div {
    background-color: var(--science-blue);
    padding: var(--gutter);
    height: 100%;
  }
  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.5rem;
    color: white;
    margin: 0 0 var(--gutter);
    position: relative;
    padding-right: 0.5rem;
  }

  img {
    height: 2rem;
    width: 1.25rem;
    margin-left: 0.5rem;
  }
</style>
