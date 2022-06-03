<script>

import { active_settings, icon_path } from '$lib/stores';
import { horizontalSlide } from './transitions';

function showLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'visible';
        document.getElementById(id).style.textDecorationColor = 'transparent';
    }
function hideLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'hidden';
}

let settings_size = 'medium'
let current_size = ['','checked','']
let links = [{name:'Website',link:'https://stobuilds.com/VGER'},{name:'STOCD',link:'https://github.com/STOCD'},{name:'STOBuilds Discord',link:'https://discord.gg/stobuilds'}]

function sizeSettingsCallback(size) {
    let r = document.documentElement;
    if (size == 'small') {
        settings_size = 'small';
        current_size = ['checked','',''];
        r.style.setProperty('--card-image-width', '2rem');
    }
    else if (size == 'medium') {
        settings_size = 'medium';
        current_size = ['','checked',''];
        r.style.setProperty('--card-image-width', '3rem');
    }
    else if (size == 'large') {
        settings_size = 'large';
        current_size = ['','','checked'];
        r.style.setProperty('--card-image-width', '4rem');
    }
}





</script>
{#if $active_settings}
<div transition:horizontalSlide={{axis:'x'}} class='settings_div'>
    <p class='settings_header'>Card size:</p>
    <div class='button_group'>
        <input type='radio' class='settings_radio' id='size_small' name='size' checked={current_size[0]}>
        <label class='exclusive_button' for='size_small' on:click={()=>sizeSettingsCallback('small')}>Small</label>
        <input type='radio' class='settings_radio' id='size_medium'name='size' checked={current_size[1]}>
        <label class='exclusive_button' for='size_medium' on:click={()=>sizeSettingsCallback('medium')}>Medium</label>
        <input type='radio' class='settings_radio'  id='size_large' name='size' checked={current_size[2]}>
        <label class='exclusive_button' for= 'size_large' on:click={()=>sizeSettingsCallback('large')}>Large</label>
    </div>
    
    <div class='promo_footer'>
        <img class='footer_img' src={icon_path+'section31badge.png'} alt='STOCD'>
        <div class='promo_footer_center'>
            <p class='promo_footer_text'>
                <span style='color:var(--science-blue); font-weight:bold;'>Visual Glossary for Easy Reference</span><br>created by the STO Community Developers in cooperation with the STOBuilds Discord. <br>Check out links below!
            </p>
            
                {#each links as link, i}
                  <p style="font-size: 70%;" class='link_list' 
                    on:mouseover={event => showLinkIcon(event, 'link_icon_'+i)} on:mouseleave={event => hideLinkIcon(event, 'link_icon_'+i)} 
                    on:click={event => window.open(link.link)} 
                    on:focus={event => showLinkIcon(event, 'link_icon_'+i)} on:blur={event => hideLinkIcon(event, 'link_icon_'+i)}>
                    <i class='fa fa-angle-right'/>
                    <span class='hover_underline' >{link.name}</span>
                    <i class='fa fa-link link_icon' id={'link_icon_'+i} />
                    </p>
                {/each}
              
        </div>
        <img class='footer_img' src={icon_path+'stobuildslogo.png'} alt='STOBuilds'>
    </div>
</div>
{/if}
<style>
    .settings_div {
        background-color: var(--light-text);
        position: absolute;
        height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter));
        width: 30vw;
        right: 0;
        margin-right: var(--gutter);
        transform: translateX(0%);
        transition: transform 1s ease-in-out;
        z-index: 10;
        border-left: var(--gutter) solid var(--science-blue);
        border-top: calc(.5*var(--border)) solid var(--dark-text);
    }
    .button_group {
        display: flex;
        justify-content: center;
        margin: var(--gutter) 0 var(--gutter) 0;
    }
    .settings_header {
        text-align: center;
        margin: calc(2*var(--gutter)) 0 0 0;
        font-size: 170%;
        color: var(--dark-background);
    }
    .settings_radio {
        display: none;
    }
    .settings_radio:checked+label {
        color: var(--science-blue);
        border-color: var(--science-blue);
        background-color: var(--science-blue-transparent);
    }
    .exclusive_button {
        margin: 0 var(--gutter);
        font-size: 120%;
        color: var(--light-background);
        background-color: rgba(0,0,0,0);
        border: calc(.5*var(--border)) solid;
        border-color: var(--light-background);
        border-radius: calc(.5*var(--gutter));
        padding: calc(.5*var(--gutter));
    }
    .promo_footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .promo_footer_center {
        margin: 0 auto;
    }
    .footer_img {
        display: block;
        height: var(--aside-image-width);
        margin: var(--gutter);
    }
    .promo_footer_text {
        text-align: center;
        font-size: 70%;
        color: var(--dark-background);
        margin-bottom: calc(.5*var(--gutter));
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
    background-color: var(--light-text);
    padding: var(--border);
  }
  .link_list {
    color: var(--dark-background);
    text-align: center;
    margin: 0;
  }
  .fa-angle-right {
    margin-right: var(--border);
  }
  .hover_underline:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>