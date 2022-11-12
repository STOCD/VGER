<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
</script>

<Banner />

<div>
  <slot /> <!-- page is inserted here -->
</div>


<style>
  div {
    background-color: var(--science-blue);
    padding: 0 var(--gutter) var(--gutter);
    margin-top: 0;
    width: 100%;
    position: fixed;
  }
</style>
