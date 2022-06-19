<script>
  import { activeCard, activeTab, image_path, wiki_url} from '$lib/stores';
  import { compensate_wiki_description, rarities } from '$lib/fetch/masterfetch';
  
  function showLinkIcon(e, id) {
    document.getElementById(id).style.visibility = 'visible';
  }

  function hideLinkIcon(e, id) {
    document.getElementById(id).style.visibility = 'hidden';
  }

  function openLink(e, type, name) {
    if (type == 'trait') {
      window.open(wiki_url+'Trait:_'+name.replaceAll(' ','_'));
    }
    else if (type == 'none') {
      window.open(wiki_url+name.replaceAll(' ','_'));
    }
  }

  function getDisplayRarity(rarity) {
    for (let i = 0; i < rarities.length; i++) {
      if (rarities[i].toLowerCase() == rarity.toLowerCase()) {
        return rarities[i];
      }
    }
    return rarity;
  }

</script>

<aside>
{#if $activeCard}

  <!-- Image of current card -->
  <img class='aside_image' src={image_path+$activeCard.name+'.png'} alt={$activeCard.name}>

  <!-- Name of currently selected item with link -- Traits -->
  {#if $activeTab == 'Starship Traits' || $activeTab == 'Personal Traits'}
    <h2 class='item_name' 
        on:mouseover={event => showLinkIcon(event, 'link_icon_header')} on:mouseleave={event => hideLinkIcon(event, 'link_icon_header')} 
        on:click={event => openLink(event,'trait', $activeCard.name)} 
        on:focus={event => showLinkIcon(event, 'link_icon_header')} on:blur={event => hideLinkIcon(event, 'link_icon_header')}>
      <span class='hover_underline'>{$activeCard.name}</span>
      <i class='fa fa-link link_icon' id='link_icon_header'/>
    </h2>
  
  <!-- Name of currently selected item with link -- Equipment -->
  {:else if $activeTab == 'Space Equipment' || $activeTab == 'Ground Equipment'}
    <h2 class='item_name' 
        on:mouseover={event => showLinkIcon(event, 'link_icon_header')} on:mouseleave={event => hideLinkIcon(event, 'link_icon_header')} 
        on:click={event => window.open($activeCard.url)} 
        on:focus={event => showLinkIcon(event, 'link_icon_header')} on:blur={event => hideLinkIcon(event, 'link_icon_header')}>
      <span class='hover_underline'>{$activeCard.name}</span>
      <i class='fa fa-link link_icon' id='link_icon_header'/>
    </h2>
  {/if}

  <!-- Individual Sections for the tabs ahead -->

  <!-- Starship Traits -->
  {#if $activeTab == 'Starship Traits'}

    <!-- type: Starship Trait -->
    <h4 class='item_type'>Starship Trait</h4>

    <!-- Obtained Information -->
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

    <!-- Description -->
    <h3 class='aside_head'>Description:</h3>
    <p class='aside_text'>
      {@html $activeCard.desc.replaceAll('<li>', '<li class="infobox_li">').replaceAll('<ul>', '<ul class="infobox_ul">')}
    </p>

  <!-- Personal Traits -->
  {:else if $activeTab == 'Personal Traits'}

    <!-- type of the trait -->
    <h4 class='item_type'>{$activeCard.display_type}</h4>

    <!-- shows obtain information if trait is an innate or species trait -->
    {#if $activeCard.availability_type == 'innate'}
      <h3 class='aside_head'>Availability</h3>
      <p class='aside_text'>
        {'This Trait is an innate trait to the following species: '+$activeCard.availability}
      </p>
    {:else if $activeCard.availability_type == 'species'}
      <h3 class='aside_head'>Availability</h3>
      <p class='aside_text'>
        {'The following species have this trait available by default: '+$activeCard.availability}
      </p>
    {/if}

    <!-- Description -->
    <h3 class='aside_head'>Description:</h3>
    <p class='aside_text'>
      {@html $activeCard.desc.replaceAll('<li>', '<li class="infobox_li">').replaceAll('<ul>', '<ul class="infobox_ul">')}
    </p>

  <!-- Space and Ground Equipment -->
  {:else if $activeTab == 'Space Equipment' || $activeTab == 'Ground Equipment'}

    <!-- display rarity and type -->
    <h4 class='item_type'>
      {getDisplayRarity($activeCard.rarity) + ' ' + $activeCard.display_type}
    </h4>

    <!-- Description -->
    <h3 class='aside_head'>Description:</h3>
    {#each [1,2,3,4,5,6,7,8,9] as int}
        {#if $activeCard.desc.head[int] != ''}
          <p class='item_head'>{@html $activeCard.desc.head[int]}</p>
        {/if}
        {#if $activeCard.desc.subhead[int] != ''}
          <p class='item_subhead'>{@html $activeCard.desc.subhead[int]}</p>
        {/if}
        {#if $activeCard.desc.text[int] != ''}
          <p class='item_text'>{@html compensate_wiki_description($activeCard.desc.text[int]).replaceAll('\n:','<br>&nbsp;&nbsp;&nbsp;&nbsp;')}</p>
        {/if}
      {/each}

  {/if}

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
margin: 0 0 var(--gutter) var(--gutter);
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
.item_head {
font-size: 105%;
padding-left: 0;
margin: calc(.5*var(--gutter)) 0 0 0;
}
.item_subhead {
font-size: 90%;
font-style: italic;
padding-left: 0;
margin: 0;
}
.item_text {
font-size: 85%;
padding-left: 0;
margin: 0;
}
</style>
