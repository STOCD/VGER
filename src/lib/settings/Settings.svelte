<script>

import { active_settings, icon_path, activeTab, settings_env, settings_type, settings_av } from '$lib/stores';
import { horizontalSlide } from './transitions';

active_settings.subscribe(() => {
    
    try {
    let settings_window = document.getElementById('settings_window');
    if ($active_settings == true) {
        settings_window.style.transform = 'translateX(-30.5vw)';
    }
    if ($active_settings == false) {
        settings_window.style.transform = 'translateX(0)';
    }
    }
    catch {}  
})

function showLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'visible';
    }
function hideLinkIcon(e, id) {
        document.getElementById(id).style.visibility = 'hidden';
}

let links = [{name:'Website',link:'https://stobuilds.com/VGER'},{name:'STOCD',link:'https://github.com/STOCD'},{name:'STOBuilds Discord',link:'https://discord.gg/stobuilds'}]

function sizeSettingsCallback(size) {
    let r = document.documentElement;
    if (size == 'small') {
        r.style.setProperty('--card-image-width', '2rem');
    }
    else if (size == 'medium') {
        r.style.setProperty('--card-image-width', '3rem');
    }
    else if (size == 'large') {
        r.style.setProperty('--card-image-width', '4rem');
    }
}

function envSettingsCallback(environment) {
    if ($settings_env == '') {
        if (environment == 'space' && document.getElementById('env_space').checked) {
            settings_env.set('ground');
        }
        else if (environment == 'ground' && document.getElementById('env_ground').checked) {
            settings_env.set('space');
        }
        else {
            settings_env.set(environment);
        }
    }
    else {
        settings_env.set('');
    }
}

function typeSettingsCallback(type) {
    if ($settings_type.includes(type)) {
        settings_type.set($settings_type.filter(element => element !== type));
    }
    else {
        settings_type.set([...$settings_type, type]);
    }
    console.log($settings_type)
}

function avSettingsCallback(av_type) {
    console.log($settings_av)
    if ($settings_av.includes(av_type)) {
        settings_av.set($settings_av.filter(element => element !== av_type));
    }
    else {
        settings_av.set([...$settings_av, av_type]);
    }
    console.log($settings_av)
}
</script>

<!--{#if $active_settings}-->
<div transition:horizontalSlide={{axis:'x'}} class='settings_div' id='settings_window'>
    {#if $activeTab == 'Personal Traits'}
    <p class='settings_header'>Trait Type:</p>
    <div class='button_group'>
        <input type='checkbox'  id='type_personal' class ='settings_input' name='type'>
        <label class='settings_button' for='type_personal' on:click={()=>typeSettingsCallback('personal')} title='Includes Personal Traits when activated'>
            Personal
        </label>
        <input type='checkbox' id='type_rep' class='settings_input' name='type'>
        <label class='settings_button' for='type_rep' on:click={()=>typeSettingsCallback('rep')} title='Includes Reputation Traits when activated'>
            Reputation
        </label>
        <input type='checkbox'  id='type_active_rep' class ='settings_input' name='type'>
        <label class='settings_button' for='type_active_rep' on:click={()=>typeSettingsCallback('active_rep')} title='Includes Active Reputation Traits when activated'>
            Active Reputation
        </label>     
    </div>
    <p class='settings_header'>Trait Environment:</p>
    <div class='button_group'>
        <input type='checkbox' id='env_space' class='settings_input' name='env'>
        <label class='settings_button' for='env_space' on:click={()=>envSettingsCallback('space')} title='Includes Space Traits when activated'>
            Space
        </label>
        <input type='checkbox'  id='env_ground' class ='settings_input' name='env'>
        <label class='settings_button' for='env_ground' on:click={()=>envSettingsCallback('ground')}  title='Includes Ground Traits when activated'>
            Ground
        </label>    
    </div>
    <p class='settings_header'>Trait Availability:</p>
    <div class='button_group'>
        <input type='checkbox'  id='av_innate' class ='settings_input' name='type'>
        <label class='settings_button' for='av_innate' on:click={()=>avSettingsCallback('innate')}  title='Includes species specific and exclusive Traits when activated -- each species has one of those and it cannot be unslotted'>
            Innate
        </label>
        <input type='checkbox' id='av_species' class='settings_input' name='type'>
        <label class='settings_button' for='av_species' on:click={()=>avSettingsCallback('species')} title='Includes Traits available to the respective species by default'>
            Species
        </label>
        <input type='checkbox'  id='av_rest' class ='settings_input' name='type'>
        <label class='settings_button' for='av_rest' on:click={()=>avSettingsCallback('other')} title='Includes Traits available from Lockboxes, Missions, Recruitment Events and Traits unlocked by default depending on the player characters profession'>
            Obtainable
        </label>     
    </div>
    {/if}
    {#if $activeTab == 'Personal Traits' || $activeTab == 'Starship Traits'}
    <p class='settings_header'>Card size:</p>
    <div class='button_group'>
        <input type='radio' class='settings_input' id='size_small' name='size'>
        <label class='settings_button' for='size_small' on:click={()=>sizeSettingsCallback('small')}>Small</label>
        <input type='radio' class='settings_input' id='size_medium'name='size' checked>
        <label class='settings_button' for='size_medium' on:click={()=>sizeSettingsCallback('medium')}>Medium</label>
        <input type='radio' class='settings_input'  id='size_large' name='size'>
        <label class='settings_button' for= 'size_large' on:click={()=>sizeSettingsCallback('large')}>Large</label>
    </div>
    {/if}
    <div class='promo_footer'>
        <img class='footer_img' src={icon_path+'section31badge.png'} alt='STOCD'>
        <div class='promo_footer_center'>
            <p class='promo_footer_text'>
                <span style='color:var(--science-blue); font-weight:bold;'>Visual Glossary for Easy Reference</span><br>created by the STO Community Developers in cooperation with the STOBuilds Discord. <br>Check out links below!
            </p>
            
                {#each links as link, i}
                  <p style="font-size: 70%;" class='link_list' 
                    on:mouseover={event => showLinkIcon(event, 'settings_link_icon'+i)} on:mouseleave={event => hideLinkIcon(event, 'settings_link_icon'+i)} 
                    on:click={event => window.open(link.link)} 
                    on:focus={event => showLinkIcon(event, 'settings_link_icon'+i)} on:blur={event => hideLinkIcon(event, 'settings_link_icon'+i)}>
                    <i class='fa fa-angle-right'/>
                    <span class='hover_underline' >{link.name}</span>
                    <i class='fa fa-link link_icon' id={'settings_link_icon'+i} />
                    </p>
                {/each}
              
        </div>
        <img class='footer_img' src={icon_path+'stobuildslogo.png'} alt='STOBuilds'>
    </div>
</div>
<!--{/if}-->
<style>
    .settings_div {
        background-color: var(--light-text);
        position: absolute;
        height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /*viewport height minus top banner height, height of the bottom margin and height of the menu bar*/
        width: 30vw;
        right: -30.5vw;
        margin-right: var(--gutter);
        /*transform: translateX(10vw);*/
        transition: transform .5s cubic-bezier(0.075, 0.1, 0.165, 1);
        z-index: 10;
        border-left: var(--gutter) solid var(--science-blue);
        border-top: calc(.5*var(--border)) solid var(--dark-text);
    }
    .button_group {
        display: flex;
        justify-content: left;
        margin: var(--gutter) 0 var(--gutter) 0;
    }
    .settings_header {
        text-align: left;
        margin: calc(2*var(--gutter)) 0 0 var(--gutter);
        font-size: 150%;
        color: var(--dark-background);
    }
    .settings_input {
        display: none;
    }
    .settings_input:checked+label {
        color: var(--science-blue);
        border-color: var(--science-blue);
        background-color: var(--science-blue-transparent);
    }
    .settings_button {
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