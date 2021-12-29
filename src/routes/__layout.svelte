<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
</script>

<Banner />
<div>
  <h1>Visual Glossary Educational Repository</h1>
  <slot />
</div>


<style>
  div {
    background-color: var(--science-blue);
    padding: var(--gutter);
    height: 100%;
  }
  h1 {
    text-align: center;
    text-transform: uppercase;
    font-size: 1.5rem;
    color: white;
    margin: 0 0 var(--gutter);
  }
</style>
