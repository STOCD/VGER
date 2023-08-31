<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
</script>
<Banner />

<div class='main'>
  <slot /> <!-- page is inserted here -->
</div>


<style>
  .main {
    background-color: var(--science-blue);
    padding: 0 var(--gutter) var(--gutter);
    margin-top: 0;
    width: 100%;
    position: fixed;
  }
</style>
