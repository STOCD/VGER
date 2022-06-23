<script>

import { 
    active_settings, icon_path, activeTab, settings_env, settings_type, settings_av, 
    settings_space_slot, settings_ground_slot, settings_rarity, mobile_override, mobile
    } from '$lib/stores';
import {equipment_types_ground, equipment_types_space, rarities} from '$lib/fetch/masterfetch';
const links = [{name:'Website',link:'https://stobuilds.com/VGER'},{name:'STOCD',link:'https://github.com/STOCD'},{name:'STOBuilds Discord',link:'https://discord.gg/stobuilds'}]

active_settings.subscribe(() => {
    
    try {
    let settings_window = document.getElementById('settings_window');
    if ($active_settings == true) {
        if (!$mobile) {
            settings_window.style.transform = 'translateX(-30.5vw)';
        }
        else {
            settings_window.style.transform = 'translateX(-100vw)';
        }
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

function getDisplayType(text) {
    return text == 'Hangar Bay' ? 'Hangar Pet' : text == 'Warp Engine' ? 'Warp Core' : text == 'Singularity Engine' ? 'Singularity Core' : text.replaceAll('Ship ','');
}

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
}

function avSettingsCallback(av_type) {
    if ($settings_av.includes(av_type)) {
        settings_av.set($settings_av.filter(element => element !== av_type));
    }
    else {
        settings_av.set([...$settings_av, av_type]);
    }
}

function groundTypeSettingsCallback(type) {
    if ($settings_ground_slot.includes(type)) {
        settings_ground_slot.set($settings_ground_slot.filter(element => element !== type));
    }
    else {
        settings_ground_slot.set([...$settings_ground_slot, type]);
    }
}

function spaceTypeSettingsCallback(type) {
    if ($settings_space_slot.includes(type)) {
        settings_space_slot.set($settings_space_slot.filter(element => element !== type));
    }
    else {
        settings_space_slot.set([...$settings_space_slot, type]);
    }
}

function arraySettingsCallback(item, variable) {
    console.log(variable)
    if (variable.includes(item)) {
        variable = variable.filter(element => element !== item);
    }
    else {
        variable = [...variable, item];
    }
    console.log(variable)
}
function raritySettingsCallback(item) {
    if ($settings_rarity.includes(item)) {
        $settings_rarity = $settings_rarity.filter(element => element !== item);
    }
    else {
        $settings_rarity = [...$settings_rarity, item];
    }
}
</script>

<!-- Settings Sidebar -- sliding in from the right on click -->
<div class='settings_div' class:mobile_settings_div='{$mobile}' id='settings_window'>

    <!-- Wrapper for Settings -->
    <div class='settings_content' class:mobile_settings_content='{$mobile}'>

        <!-- Settings exclusive for Personal Traits -->
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

            <!-- Title replacement as mobile devices have no hover -->
            {#if $mobile}
                <p class='text'>Innate: Includes species specific and exclusive Traits when activated -- each species has one of those and it cannot be unslotted</p>
                <p class='text'>Species: Includes Traits available to the respective species by default</p>
                <p class='text'>Obtainable: Includes Traits available from Lockboxes, Missions, Recruitment Events and Traits unlocked by default depending on the player characters profession</p>
            {/if}

            <hr style='margin-top: calc(3*var(--gutter));'/>

        <!-- Settings exclusive for Ground Equipment -->
        {:else if $activeTab == 'Ground Equipment'}
            <p class='settings_header'>Equipment Slot:</p>
            <div class='button_group'>
                {#each equipment_types_ground as type}
                    <input type='checkbox' id={'ground_type='+type} class='settings_input' name='ground_equipment_type'>
                    <label class='settings_button' for={'ground_type='+type} on:click={()=>groundTypeSettingsCallback(type)} title={'Includes '+getDisplayType(type)+' Items'}> 
                        {getDisplayType(type)}
                    </label>
                {/each}
            </div>

            <p class='settings_header'>Default Rarity:</p>
            <div class='button_group'>
                {#each rarities as rarity}
                    <input type='checkbox' id={'ground_rarity='+rarity} class='settings_input' name='ground_rarity'>
                    <label class='settings_button' for={'ground_rarity='+rarity} on:click={()=>raritySettingsCallback(rarity)} title={'Includes '+rarity+' Items'}> 
                        {rarity}
                    </label>
                {/each}
            </div>

            <hr style='margin-top: calc(3*var(--gutter));'/>

        <!-- Settings exclusive for Space Equipment -->
        {:else if $activeTab == 'Space Equipment'}
            <p class='settings_header'>Equipment Slot:</p>
            <div class='button_group'>
                {#each equipment_types_space as type}
                    <input type='checkbox' id={'space_type='+type} class='settings_input' name='space_equipment_type'>
                    <label class='settings_button' for={'space_type='+type} on:click={()=>spaceTypeSettingsCallback(type)} title={'Includes '+getDisplayType(type)+' Items'}> 
                        {getDisplayType(type)}
                    </label>
                {/each}
            </div>
        
            <p class='settings_header'>Default Rarity:</p>
            <div class='button_group'>
                {#each rarities as rarity}
                    <input type='checkbox' id={'space_rarity='+rarity} class='settings_input' name='space_rarity'>
                    <label class='settings_button' for={'space_rarity='+rarity} on:click={()=>raritySettingsCallback(rarity)} title={'Includes '+rarity+' Items'}> 
                        {rarity}
                    </label>
                {/each}
            </div>
        
            <hr style='margin-top: calc(3*var(--gutter));'/>
        {/if}

        <!-- Card Size Setting -- for all tabs -->
        <p class='settings_header'>Card size:</p>
        <div class='button_group'>
            <input type='radio' class='settings_input' id='size_small' name='size'>
            <label class='settings_button' for='size_small' on:click={()=>sizeSettingsCallback('small')}>Small</label>
            <input type='radio' class='settings_input' id='size_medium'name='size' checked>
            <label class='settings_button' for='size_medium' on:click={()=>sizeSettingsCallback('medium')}>Medium</label>
            <input type='radio' class='settings_input'  id='size_large' name='size'>
            <label class='settings_button' for= 'size_large' on:click={()=>sizeSettingsCallback('large')}>Large</label>
        </div>

        <p class='settings_header'>Mobile Website:</p>
        <div class='button_group'>
            <input type='radio' class='settings_input' id='mobile_auto' name='mobile' checked>
            <label class='settings_button' for='mobile_auto' on:click={()=>$mobile_override='auto'}>Auto</label>
            <input type='radio' class='settings_input' id='mobile_mobile' name='mobile'>
            <label class='settings_button' for='mobile_mobile' on:click={()=>$mobile_override='mobile'}>Mobile Website</label>
            <input type='radio' class='settings_input' id='mobile_pc' name='mobile'>
            <label class='settings_button' for='mobile_pc' on:click={()=>$mobile_override='pc'}>Desktop Website</label>
        </div>
        
    </div>

    <!-- Footer present on all tabs at the bottom of the settings sidebar -->
    <div class='promo_footer'>
        <img class='footer_img' src={icon_path+'section31badge.png'} alt='STOCD'>
        <div class='promo_footer_center'>
            <p class='promo_footer_text'>
                <span style='color:var(--science-blue); font-weight:bold;'>Visual Glossary for Easy Reference</span><br>
                created by the STO Community Developers in cooperation with the STOBuilds Discord. <br>
                Check out links below!
            </p>
            {#each links as link, i}
                <p style="font-size: 70%;" class='link_list' class:mobile_margin='{$mobile}'
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

<style>
    .settings_div {
        background-color: var(--light-text);
        position: absolute;
        height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter)); /*viewport height minus top banner height, height of the bottom margin and height of the menu bar*/
        width: 30vw;
        right: -30.5vw;
        margin-right: var(--gutter);
        transition: transform .5s cubic-bezier(0.075, 0.1, 0.165, 1);
        z-index: 10;
        border-left: var(--gutter) solid var(--science-blue);
        border-top: calc(.5*var(--border)) solid var(--dark-text);
    }
    .mobile_settings_div {
        width: calc(100vw - 2*var(--gutter));
        right: -100vw;
        border-left: none;
    }
    .settings_content {
        overflow-y: auto;
        height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter) - 1.2*var(--aside-image-width)); /*.settings_div height minus .promo_footer height*/
        margin-right: var(--border);
    }
    .mobile_settings_content {
        height: calc(100vh - 100vw*(143/1920) - 5*var(--gutter) - 1.75*var(--aside-image-width)); /*.settings_div height minus .promo_footer height*/
    }
    .button_group {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        margin-bottom: var(--gutter);
    }
    .settings_header {
        text-align: left;
        margin: calc(2*var(--gutter)) 0 0 var(--gutter);
        font-size: 130%;
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
        margin: var(--gutter) 0 0 var(--gutter);
        font-size: 100%;
        color: var(--light-background);
        background-color: rgba(0,0,0,0);
        border: calc(.5*var(--border)) solid;
        border-color: var(--light-background);
        border-radius: calc(.5*var(--gutter));
        padding: calc(.5*var(--gutter));
        vertical-align: middle;
    }
    .promo_footer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 calc(-1* var(--border)) var(--border) 0 var(--light-background);
    }
    .promo_footer_center {
        margin: auto;
    }
    .footer_img {
        display: block;
        height: var(--aside-image-width);
        margin: 0 var(--gutter);
        
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
    .mobile_margin{
        margin-top: var(--gutter);
        margin-bottom: var(--gutter);
    }
    .text {
        text-align: left;
        margin: var(--gutter) 0 0 var(--gutter);
        font-size: 80%;
        color: var(--dark-background);
    }
</style>