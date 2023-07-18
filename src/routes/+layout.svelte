<script>
  import '../app.css';
  import Banner from '$lib/banner/Banner.svelte';
</script>

<div id='message-box'>
  <div class='flex-row'>
    <h1>
      <i fa class='fa fa-exclamation-triangle warning-left'/>
      Legacy VGER
      <i fa class='fa fa-exclamation-triangle warning-right'/>
    </h1>
    <i class='fa fa-times close-icon' on:click={e => document.getElementById('message-box').style.visibility = 'hidden'}/>
  </div>
  <p>
    This is a legacy version of VGER based on the sto.fandom.com wiki which is no longer maintained and therefore outdated. Check out <a href='https://vger.netlify.app' target='_blank' rel='noopener noreferrer'>vger.netlify.app</a> for the main version of VGER.
  </p>
</div>
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
  #message-box {
    position: absolute;
    top: var(--gutter);
    right:var(--gutter);
    background-color: #dd0000;
    border-radius: var(--gutter);
    border: none;
    width: 25%;
    padding: var(--gutter);
  }
  h1 {
    color: #000000;
    font-size: 150%;
    display: inline;
    margin: 0 0 var(--gutter) 0;
  }
  p {
    color: #000000;
    margin: 0;
  }
  i {
    color: #000000;
    
  }
  .flex-row {
    display: flex;
  }
  a {
    color: #550088;
  }
  .close-icon {
    margin: 0 var(--border) 0 auto;
  }
  .close-icon:hover {
    color: var(--light-background);
  }
  .warning-left {
    margin: 0 var(--border) 0 0;
    font-size: 90%;
  }
  .warning-right {
    margin: 0 0 0 var(--border);
    font-size: 90%;
  }
</style>
