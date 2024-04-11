<script>
  import { activeCard, activeTab, mobile, mobile_sidebar_active} from '$lib/stores';
  import { compensate_wiki_description, rarities, wikihttp } from '$lib/fetch/constants';

  // shows chain icon
  function showLinkIcon(e, id) {
    document.getElementById(id).style.visibility = 'visible';
  }

  // shows chain icons
  function hideLinkIcon(e, id) {
    document.getElementById(id).style.visibility = 'hidden';
  }

  // gets wiki page link
  function getLink(type, name) {
    if (type == 'trait') {
      return wikihttp + 'Trait:_' + name.replaceAll(' ','_');
    }
    else if (type == 'none') {
      return wikihttp + name.replaceAll(' ','_');
    }
  }

  // makes the display type look pretty
  function getDisplayRarity(rarity) {
    for (let i = 0; i < rarities.length; i++) {
      if (rarities[i].toLowerCase() == rarity.toLowerCase()) {
        return rarities[i];
      }
    }
    return rarity;
  }
  
  function comp_equip_desc(text) {
    if (text === null) {return ''}
    text = text.replaceAll('\n:', '<br>&nbsp;&nbsp;&nbsp;&nbsp;');
    text = compensate_wiki_description(text)
    text = text.replaceAll('<li>', '<li class="infobox_li">');
    text = text.replaceAll('<ul>', '<ul class="infobox_ul">');
    return text;
  }
</script>

{#if $activeCard}
  <div class='sidebar_content' class:mobile_sidebar_content='{$mobile}'>

    <!-- Image of current card -->
    <img class='aside_image' src={$activeCard.image} referrerpolicy='no-referrer' alt={$activeCard.name}>

    <!-- Name of currently selected item with link -- Traits -->
    {#if $activeTab == 'Starship Traits' || $activeTab == 'Personal Traits'}
      <a class='item_name' class:mobile_underline='{$mobile}' href={getLink('trait', $activeCard.name)} target='_blank' rel='noopener noreferrer' referrerpolicy='no-referrer'
          on:mouseover={event => showLinkIcon(event, 'link_icon_header')} on:mouseleave={event => hideLinkIcon(event, 'link_icon_header')}
          on:focus={event => showLinkIcon(event, 'link_icon_header')} on:blur={event => hideLinkIcon(event, 'link_icon_header')}>
        <span class='hover_underline'>{$activeCard.name}</span>
        <i class='fa fa-link link_icon' id='link_icon_header' class:show_link_icon='{$mobile}'/>
      </a>
    
    <!-- Name of currently selected item with link -- Equipment -->
    {:else if $activeTab == 'Space Equipment' || $activeTab == 'Ground Equipment'}
      <a class='item_name' class:mobile_underline='{$mobile}' href={$activeCard.url} target='_blank' rel='noopener noreferrer' referrerpolicy='no-referrer'
          on:mouseover={event => showLinkIcon(event, 'link_icon_header')} on:mouseleave={event => hideLinkIcon(event, 'link_icon_header')}
          on:focus={event => showLinkIcon(event, 'link_icon_header')} on:blur={event => hideLinkIcon(event, 'link_icon_header')}>
        <span class='hover_underline'>{$activeCard.name}</span>
        <i class='fa fa-link link_icon' id='link_icon_header' class:show_link_icon='{$mobile}'/>
      </a>
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
          <li style="font-size: 100%;" class:mobile_margin='{$mobile}'>
            <a href={getLink('none', method)} target='_blank' rel='noopener noreferrer' referrerpolicy='no-referrer'
              on:mouseover={event => showLinkIcon(event, 'link_icon_'+i)} on:mouseleave={event => hideLinkIcon(event, 'link_icon_'+i)}
              on:focus={event => showLinkIcon(event, 'link_icon_'+i)} on:blur={event => hideLinkIcon(event, 'link_icon_'+i)}>
              <i class='fa fa-angle-right'/>
              <span class='hover_underline' class:mobile_underline='{$mobile}'>{method}</span>
              <i class='fa fa-link link_icon' id={'link_icon_'+i} class:show_link_icon='{$mobile}'/>
            </a>
          </li>
        {/each}
      </ul>

      <!-- Cost -->
      {#if $activeCard.cost.length > 0}
      <h3 class='aside_head'>Cost:</h3>
      <ul class='item_obtained'>
        {#each $activeCard.cost as cost_item}{@const [current_amount, current_unit] = cost_item.split(';')}
          <li style="font-size: 100%;">
            <i class='fa fa-angle-right'/>
            {#if current_unit == 'Zen'}
              <span title='Zen'>{current_amount} <img class='unit_image' src='zen.webp' alt='Zen'></span>
            {:else if current_unit == 'LB'}
              <span title='Lockbox'>{current_amount} <img class='unit_image' src='lb.webp' alt='Lockbox'></span>
            {:else if current_unit == 'APP'}
              <span title='Event'>{current_amount} <img class='unit_image' src='event.webp' alt='Event'></span>
            {:else if current_unit == 'PPP5'}
              <span title='Epic Phoenix Prize Pack Token'>
                {current_amount} <img class='unit_image' src='ppp5.webp' alt='Epic Phoenix Prize Pack Token'>
              </span>
            {:else if current_unit == 'Veteran'}
              <span title='Lifetime Subscription'>
                {current_amount} <img class='unit_image' src='lifetime.webp' alt='Lifetime Subscription'>
              </span>
            {:else if current_unit == 'R&D'}
              <span title='Promotional T6 Ship Choice Pack'>
                {current_amount} <img class='unit_image' src='promo.webp' alt='Promotional T6 Ship Choice Pack'>
              </span>
            {:else if current_unit == 'LC'}
              <span title='Lobi Crystal'>
                {current_amount} <img class='unit_image' src='lobi_crystal.webp' alt='Lobi Crystal'>
              </span>
            {:else}
              {current_amount}
            {/if}
          </li>
        {/each}
      </ul>
      {/if}

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
          {#if $activeCard.desc.head[int] != '' && $activeCard.desc.head[int] != null}
            <p class='item_head'>{@html $activeCard.desc.head[int]}</p>
          {/if}
          {#if $activeCard.desc.subhead[int] != '' && $activeCard.desc.subhead[int] != null}
            <p class='item_subhead'>{@html $activeCard.desc.subhead[int]}</p>
          {/if}
          {#if $activeCard.desc.text[int] != '' && $activeCard.desc.text[int] != null}
            <p class='item_text'>{@html comp_equip_desc($activeCard.desc.text[int])}</p>
          {/if}
        {/each}

    {/if}

  </div>

  <!-- Close Button for Mobile Page-->
  {#if $mobile}
    <div class='close_div'>
      <button class='close_button' on:click={()=>$mobile_sidebar_active=false}>Close</button>
    </div>
  {/if}
  
{/if}

<style>
#refr_image {
  background-color: rgb(255, 0, 0) !important;
  color: rgb(255, 255, 255) !important;
  border-color: rgb(255, 255, 255) !important;
}
.show_link_icon {
  visibility: visible !important;
}
a {
  text-decoration: none;
  color: var(--light-text);
}
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
  background-color: var(--dark-background);
  padding: var(--border);
}
#link_icon_header {
  margin: calc(.5*var(--gutter)) !important;
}
ul {
  list-style: disc;
  margin: 0;
  padding: 0;
}
.item_obtained li {
  list-style: none;
  margin-left: calc(1.5*var(--gutter));
  color: var(--light-text);
}
:global(.infobox_li) {
  list-style: disc;
}
:global(.infobox_ul) {
  margin-top: var(--gutter);
  margin-bottom: var(--gutter);
  margin-left: calc(2.5*var(--gutter));
  padding: 0;
}
.aside_text {
  font-size: medium;
  padding-left: 0;
  color: var(--light-text);
}
.aside_image {
  width: var(--aside-image-width);
  display: block;
  border: calc(0.25*var(--gutter)) solid var(--science-blue);
  border-radius: var(--gutter);
  margin: 0 0 var(--gutter) var(--gutter);
  float: right;
}
.item_name {
  display: block;
  font-size: 170%;
  font-weight: bold;
  margin: 0;
  color: var(--light-text);
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
  color: var(--light-text);
}
.fa-angle-right {
  margin-right: var(--border);
}
.item_head {
  font-size: 105%;
  font-weight: 500;
  padding-left: 0;
  margin: calc(.5*var(--gutter)) 0 0 0;
  color: #42afca;
}
.item_subhead {
  font-size: 90%;
  font-style: italic;
  padding-left: 0;
  margin: 0;
  color: yellow;
}
.item_text {
  font-size: 85%;
  padding-left: 0;
  margin: 0;
  color: var(--light-text);
}
.unit_image {
  border: none;
  height: calc(2 * var(--gutter));
  vertical-align: text-top;
}
.close_button {
  background-color: rgba(0,0,0,0);
  border: calc(.5*var(--border)) solid var(--gray-text);
  color: var(--gray-text);
  border-radius: calc(.5*var(--gutter));
  padding: calc(.5*var(--gutter));
  padding-bottom: calc(.7*var(--gutter));
  width: 100%;
  height: calc(3.5*var(--gutter));
}
.close_div {
  width: 100%;
  display: flex;
  justify-content: center;
}
.sidebar_content {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}
.mobile_sidebar_content {
  height: calc(100vh - 100vw*(143/1920) - 12.5*var(--gutter)); /*height of parent div minus it's padding minus close button height*/
  height: calc(var(--vh, 1vh) * 100 - 100vw*(143/1920) - 12.5*var(--gutter));
}
.mobile_margin {
  margin-top: var(--gutter);
  margin-bottom: var(--gutter);
}
.mobile_underline {
  text-decoration: underline;
}
</style>
