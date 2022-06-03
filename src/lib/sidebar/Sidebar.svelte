<script>
    import { activeCard, image_path, wiki_url} from '$lib/stores';

    export function showLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'visible';
        document.getElementById(id).style.textDecorationColor = 'transparent';
    }
    export function hideLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'hidden';
    }
    function openLink(e, type, name) {
        console.log(type);
        if (type == 'trait') {
            window.open(wiki_url+'Trait:_'+name.replaceAll(' ','_'));
        }
        else if (type == 'none') {
            window.open(wiki_url+name.replaceAll(' ','_'));
        }
    }
</script>

<aside>

    {#if $activeCard}
    <img class='aside_image' src={image_path+$activeCard.name+'.png'} alt={$activeCard.name}>
    <h2 class='item_name' 
      on:mouseover={event => showLinkIcon(event, 'link_icon_header')} on:mouseleave={event => hideLinkIcon(event, 'link_icon_header')} 
      on:click={event => openLink(event,'trait', $activeCard.name)} 
      on:focus={event => showLinkIcon(event, 'link_icon_header')} on:blur={event => hideLinkIcon(event, 'link_icon_header')}>
        <span class='hover_underline'>{$activeCard.name}</span>
        <i class='fa fa-link link_icon' id='link_icon_header'/>
    </h2>
    <h4 class='item_type'>{$activeCard.type}</h4>
    <h3 class='aside_head'>Obtained from:</h3>
    <ul class='item_obtained'>
      {#each $activeCard.obtained as method, i}
        <li style="font-size: 100%;" 
          on:mouseover={event => showLinkIcon(event, 'link_icon_'+i)} on:mouseleave={event => hideLinkIcon(event, 'link_icon_'+i)} 
          on:click={event => openLink(event, 'none', method)} 
          on:focus={event => showLinkIcon(event, 'link_icon_'+i)} on:blur={event => hideLinkIcon(event, 'link_icon_'+i)}>
          <i class='fa fa-angle-right'/>
          <span class='hover_underline' >{method}</span>
          <i class='fa fa-link link_icon' id={'link_icon_'+i} />
        </li>
      {/each}
    </ul>
    <h3 class='aside_head'>Description:</h3>
    <p class='aside_text'>{@html $activeCard.desc.replaceAll('<li>', '<li class="infobox_li">').replaceAll('<ul>', '<ul class="infobox_ul">')}</p> <!--$activeCard.desc-->
    
    {/if}
</aside>


<style>
  .link_icon {
    margin: calc(.5*var(--border));
    padding-left: var(--border);
    color: var(--gray-text);
    display: inline;
    font-size: 80%;
    text-decoration: none !important;
    text-decoration-color: transparent !important;
    visibility: hidden;
    cursor: pointer;
    position: absolute;
    border-radius: 20%;
    background-color: var(--light-background);
    padding: var(--border);
  }
  #link_icon_header {
    margin: calc(.5*var(--gutter)) !important;
  }
  aside {
    width: 30%;
    padding: 1rem;
    background-color: var(--light-background);
    overflow-y: auto;
  }
  ul {
    list-style: disc;
    margin: 0;
    padding: 0;
  }
  .item_obtained li {
    list-style: none;
    margin-left: calc(1.5*var(--gutter));
  }
  :global(.infobox_li) {
    list-style: disc;
  }
  :global(.infobox_ul) {
    margin-left: calc(2.5*var(--gutter));
    padding: 0;
  }
  .aside_text {
    font-size: medium;
    padding-left: 0;
  }
  .aside_image {
    width: var(--aside-image-width);
    display: block;
    border: calc(0.25*var(--gutter)) solid var(--science-blue);
    margin: 0;
    float: right;
  }
  .item_name {
    font-size: 170%;
    margin: 0;
  }
  .hover_underline:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  .item_type {
    color: var(--gray-text);
    margin: 0;
    font-style: italic;
    font-size: 90%;
  }
  .aside_head {
    margin: calc(3*var(--gutter)) 0 var(--gutter) 0;
  }
  .fa-angle-right {
    margin-right: var(--border);
  }
</style>

