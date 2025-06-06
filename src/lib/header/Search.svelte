<script>
    import {
        srcValue, mobile
    } from '$lib/stores';
    import { matchSorter } from 'match-sorter';
    import EnterIcon from './EnterIcon.svelte';
    import SearchIcon from './SearchIcon.svelte';
    import Close from './Close.svelte';
    import { beforeNavigate } from '$app/navigation';

    export let vger_data;
    let dialog_element;
    let global_search_element;
    let results_element;
    let global_search_value;

    const data_ready = {
        starship_traits: false,
        equipment: false,
        traits: false
    }
    let search_ready = false;
    $: {
        if (data_ready.starship_traits == true && data_ready.equipment == true && data_ready.traits == true) {
            search_ready = true;
            if(dialog_element.open) {
                update_search();
            }
        }
    }
    vger_data.starship_traits.then((result) => {
        vger_data.starship_traits = result;
        data_ready.starship_traits = true;
    });
    vger_data.traits.then((result) => {
        vger_data.traits = result;
        data_ready.traits = true;
    });
    vger_data.equipment.then((result) => {
        vger_data.equipment = result;
        data_ready.equipment = true;
    });
    const search_results = {
        starship_traits: [],
        space_equipment: [],
        ground_equipment: [],
        traits: []
    };
    
    beforeNavigate(() => {
        dialog_element.close();
    });

    function show_search_key(event) {
        if (event.key == 'Enter') {
            show_search();
        }
    }
    
    function show_search() {
        global_search_element.value = $srcValue;
        dialog_element.showModal();
        update_search();
    }

    function update_search_key(event) {
        if (event.key == 'Enter') {
            update_search();
        }
    }

    function update_search() {
        if (!search_ready) {
            return;
        }
        global_search_value = global_search_element.value;
        if (global_search_value == '') {
            search_results.starship_traits = [];
            search_results.space_equipment = [];
            search_results.ground_equipment = [];
            search_results.traits = [];
            return;
        }
        search_results.starship_traits = matchSorter(vger_data.starship_traits.starship_traits, global_search_value, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key:'obtained'}, {threshold: matchSorter.rankings.CONTAINS, key:'desc'}] });
        search_results.space_equipment =  matchSorter(vger_data.equipment.space_equipment, global_search_value, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key: 'desc2'}]});
        search_results.ground_equipment =  matchSorter(vger_data.equipment.ground_equipment, global_search_value, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key: 'desc2'}]});
        search_results.traits = matchSorter(vger_data.traits.personal_traits, global_search_value, {keys: [{threshold: matchSorter.rankings.ACRONYM, key: 'name'}, {threshold: matchSorter.rankings.CONTAINS, key:'desc'}]});
        try {
            results_element.scrollTop = 0;
        } catch {}
    }

    function get_desc_part(desc) {
        let clean_desc = desc.replace(/<[^>]+>/ig, '');
        let position = clean_desc.toLowerCase().indexOf(global_search_value.toLowerCase());
        if (position == -1) {
            clean_desc = clean_desc.substring(0, 200 + global_search_value.length);
            return clean_desc
        }
        else {
            clean_desc = clean_desc.substring(position - 30, position + global_search_value.length + 170);
            position = clean_desc.toLowerCase().indexOf(global_search_value.toLowerCase());
            return clean_desc.slice(0, position) + '<mark>' + clean_desc.slice(position, position + global_search_value.length) + '</mark>' + clean_desc.slice(position + global_search_value.length);
        }
    }

    function mark_result_text(text) {
        const position = text.toLowerCase().indexOf(global_search_value.toLowerCase());
        if (position == -1) {
            return text;
        }
        else {
            return text.slice(0, position) + '<mark>' + text.slice(position, position + global_search_value.length) + '</mark>' + text.slice(position + global_search_value.length);
        }
    }
</script>

<style>
    #global_search {
        background: var(--dark-background);
        border: none;
        color: var(--light-text);
        font-size: 1rem;
        outline: none;
        width: 100%;
    }
    #search {
        background: none;
        border: none;
        color: var(--light-text);
        font-size: 1rem;
        margin-left: var(--gutter);
        outline: none;
        width: 100%;
    }
    #search::placeholder, #global_search::placeholder{
        color: var(--medium-text);
    }
    dialog {
        background: none;
        filter: drop-shadow(2px 4px 16px #0003);
        border-radius: var(--gutter);
        border: none;
        color: var(--light-text);
        flex-direction: column;
        overflow: hidden;
        position: relative;
        height: calc(100% - 2rem);
        max-height: 55rem;
        width: calc(100vw - var(--gutter));
        max-width: 55rem;

    }
    dialog:open {
        display: flex;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(1px);
    }
    :global(mark) {
        background-color: var(--science-blue-mark);
        border-radius: var(--border);
        color: var(--medium-text);
    }
    .bg_container {
        background-color: var(--dark-background);
        border-radius: var(--gutter);
        box-shadow: var(--border) var(--border) 2px #111;
        display: flex;
        flex-direction: column;
        height: fit-content;
        max-height: 100%;
        overflow: hidden;
    }
    .container {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .container.mobile {
        border: var(--border) solid var(--light-background);
        border-radius: var(--gutter);
    }
    .key {
        align-self: center;
        background: none;
        border: 1.5px solid var(--medium-text);
        border-radius: calc(.5 * var(--gutter));
        box-shadow: var(--border) var(--border) .5px #555555;
        color: var(--medium-text);
        height: fit-content;
        margin-right: var(--gutter);
        visibility: hidden;
    }
    .icon_button {
        background: none;
        border: none;
        padding: 0 var(--gutter);
        color: var(--gray-text);
    }
    .icon_button:hover {
        color: var(--light-text);
        cursor: pointer;
    }
    .loading_placeholder {
        color: var(--medium-text);
        margin: var(--gutter);
    }
    .result_link {
        --bg: var(--dark-background);
        color: var(--medium-text);
        display: block;
        font-size: 1.2rem;
        margin: 0;
        padding: calc(1.7 * var(--gutter));
        text-decoration: none;
    }
    .result_link:hover {
        --bg: var(--light-background);
        background-color: var(--light-background);
    }
    .result_name {
        color: var(--light-text);
    }
    .result_desc {
        font-size: 1rem;
        margin: var(--gutter) 0 0 0;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
        left: 0;
    }
    .result_desc::after {
        content: '';
        background: linear-gradient(to right, transparent, var(--bg));
        height: 100%;
        width: 1rem;
        right: 0;
        top: 0;
        position: absolute;
    }
    .result_desc::before {
        content: '';
        background: linear-gradient(to left, transparent, var(--bg));
        height: 100%;
        width: 1rem;
        left: 0;
        top: 0;
        position: absolute;
    }
    .results_scroll {
        overflow: auto;
        overscroll-behavior-y: none;
        scrollbar-width: thin;
    }
    .search_bar {
        display: flex;
        width: 100%;
    }
    .search_header {
        border-radius: var(--gutter);
        display: flex;
        height: 2.8rem;
        padding: var(--gutter) 0 var(--gutter) var(--gutter);
        width: 100%;
    }
    .section_header {
        background-color: var(--dark-background);
        color: var(--gray-text);
        font-size: 1.2rem;
        font-weight: normal;
        margin: 0;
        padding: calc(1.5 * var(--gutter));
        padding-top: calc(2.5* var(--gutter));
        position: sticky;
        text-transform: uppercase;
        top: 0;
        z-index: 2;
    }
    .h_seperator {
        background-color: var(--light-background-hover);
        margin: 0 var(--gutter);
        padding-top: var(--border);
    }
    .v_seperator {
        background-color: var(--light-background-hover);
        margin: 0;
        width: var(--border);
    }
    .show_key {
        visibility: visible;
    }
</style>

<dialog bind:this={dialog_element}>
    <div class='bg_container'>
        <div class='search_header'>
            <div class='search_bar'>
                <input type='text' id='global_search' placeholder='Search' bind:this={global_search_element} on:keydown={(event) => update_search_key(event)}>
                <button class='icon_button'><SearchIcon/></button>
            </div>
            <div class='v_seperator'></div>
            <button class='icon_button' on:click={() => dialog_element.close()}><Close/></button>
        </div>
        {#if !search_ready}
            <div class='loading_placeholder'>Search loading <div class='loader_container small'><span class='loading small'></span></div></div>
        {:else if search_results.starship_traits.length + search_results.space_equipment.length + search_results.ground_equipment.length + search_results.traits.length > 0 }
            <div class='h_seperator'></div>
            <div class='results_scroll' bind:this={results_element}>
                {#if search_results.starship_traits.length > 0}
                    <h2 class='section_header'>Starship Traits</h2>
                    {#each search_results.starship_traits as result}
                        <a href='/starship-traits?s={result.name}' class='result_link'>
                            <span class='result_name'>{@html mark_result_text(result.name)}</span>
                            <span class='result_obtained'> • {@html mark_result_text(result.obtained.join(', '))}</span>
                            <div class='result_desc'>{@html get_desc_part(result.desc)}</div>
                        </a>
                    {/each}
                {/if}
                {#if search_results.space_equipment.length > 0}
                    <h2 class='section_header'>Space Equipment</h2>
                    {#each search_results.space_equipment as result}
                        <a href='/space-equipment?s={result.name}' class='result_link'>
                            <span class='result_name'>{@html mark_result_text(result.name)}</span>
                            <div class='result_desc'>{@html get_desc_part(result.desc2)}</div>
                        </a>
                    {/each}
                {/if}
                {#if search_results.ground_equipment.length > 0}
                    <h2 class='section_header'>Ground Equipment</h2>
                    {#each search_results.ground_equipment as result}
                        <a href='/ground-equipment?s={result.name}' class='result_link'>
                            <span class='result_name'>{@html mark_result_text(result.name)}</span>
                            <div class='result_desc'>{@html get_desc_part(result.desc2)}</div>
                        </a>
                    {/each}
                {/if}
                {#if search_results.traits.length > 0}
                    <h2 class='section_header'>Traits</h2>
                    {#each search_results.traits as result}
                        <a href='/personal-traits?s={result.name}' class='result_link'>
                            <span class='result_name'>{@html mark_result_text(result.name)}</span>
                            <div class='result_desc'>{@html get_desc_part(result.desc)}</div>
                        </a>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
</dialog>

<div class='container' class:mobile={$mobile}>
    <input type='text' id='search' placeholder='Search' bind:value={$srcValue} on:keyup={(event) => show_search_key(event)} title='Search the current module. Hit Enter to search globally.'/>
    <button class='key' class:show_key={$srcValue.length > 0} on:click={() => show_search()}><EnterIcon/></button>
</div>
